import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.api.posts import PAGE_SIZE, _post_query, _to_post_read
from app.core.database import get_db
from app.models import Community, CommunityMember, Post, User
from app.schemas.community import CommunityCreate, CommunityRead
from app.schemas.post import FeedPage

router = APIRouter(prefix="/communities", tags=["communities"])


def _community_query():
    return select(Community).options(selectinload(Community.members))


async def _fetch_community(db: AsyncSession, community_id: uuid.UUID) -> Community | None:
    result = await db.scalars(
        _community_query()
        .where(Community.id == community_id)
        .execution_options(populate_existing=True)
    )
    return result.one_or_none()


def _to_community_read(community: Community, current_user_id: uuid.UUID) -> CommunityRead:
    member_ids = {m.user_id for m in community.members}
    return CommunityRead(
        id=community.id,
        slug=community.slug,
        name=community.name,
        description=community.description,
        member_count=len(member_ids),
        is_member=current_user_id in member_ids,
    )


@router.get("", response_model=list[CommunityRead])
async def list_communities(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[CommunityRead]:
    result = await db.scalars(_community_query().order_by(Community.name))
    communities = result.all()
    return [_to_community_read(c, current_user.id) for c in communities]


@router.post("", response_model=CommunityRead, status_code=status.HTTP_201_CREATED)
async def create_community(
    payload: CommunityCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CommunityRead:
    existing = await db.scalar(select(Community).where(Community.slug == payload.slug))
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already in use")

    community = Community(
        slug=payload.slug,
        name=payload.name,
        description=payload.description,
        created_by=current_user.id,
    )
    db.add(community)
    await db.flush()
    db.add(CommunityMember(community_id=community.id, user_id=current_user.id, role="admin"))
    await db.commit()

    created = await _fetch_community(db, community.id)
    assert created is not None
    return _to_community_read(created, current_user.id)


@router.post("/{community_id}/join", response_model=CommunityRead)
async def join_community(
    community_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CommunityRead:
    community = await _fetch_community(db, community_id)
    if community is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")

    already_member = any(m.user_id == current_user.id for m in community.members)
    if not already_member:
        db.add(CommunityMember(community_id=community_id, user_id=current_user.id, role="member"))
        await db.commit()
        community = await _fetch_community(db, community_id)
        assert community is not None

    return _to_community_read(community, current_user.id)


@router.get("/{community_id}/feed", response_model=FeedPage)
async def community_feed(
    community_id: uuid.UUID,
    page: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FeedPage:
    result = await db.scalars(
        _post_query()
        .where(Post.community_id == community_id)
        .order_by(Post.created_at.desc())
        .offset(page * PAGE_SIZE)
        .limit(PAGE_SIZE + 1)
    )
    posts = list(result.all())
    has_more = len(posts) > PAGE_SIZE
    posts = posts[:PAGE_SIZE]

    return FeedPage(
        posts=[_to_post_read(p, current_user.id) for p in posts],
        has_more=has_more,
    )
