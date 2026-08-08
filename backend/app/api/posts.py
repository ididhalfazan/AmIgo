import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import Like, Post, User
from app.schemas.post import FeedPage, PostCreate, PostRead

router = APIRouter(tags=["posts"])

PAGE_SIZE = 10


def _post_query():
    return select(Post).options(
        joinedload(Post.author),
        selectinload(Post.likes),
        selectinload(Post.comments),
    )


async def _fetch_post(db: AsyncSession, post_id: uuid.UUID) -> Post | None:
    # populate_existing forces relationships to reload even if this Post is
    # already in the session's identity map from an earlier query in the
    # same request (e.g. toggle_like fetches before and after the commit).
    result = await db.scalars(
        _post_query().where(Post.id == post_id).execution_options(populate_existing=True)
    )
    return result.one_or_none()


def _to_post_read(post: Post, current_user_id: uuid.UUID) -> PostRead:
    return PostRead(
        id=post.id,
        author=post.author,
        caption=post.caption,
        type=post.type,
        community_id=post.community_id,
        created_at=post.created_at,
        like_count=len(post.likes),
        comment_count=len(post.comments),
        liked_by_me=any(like.user_id == current_user_id for like in post.likes),
    )


@router.get("/feed", response_model=FeedPage)
async def get_feed(
    page: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FeedPage:
    # Phase 1: a public timeline across all posts, newest first. Once
    # follow relationships have UI, this should filter to
    # author_id IN (SELECT followee_id FROM follows WHERE follower_id = me) —
    # see plan.md > Data Model > Feed assembly.
    result = await db.scalars(
        _post_query()
        .where(Post.visibility == "public", Post.community_id.is_(None))
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


@router.get("/users/me/posts", response_model=FeedPage)
async def get_my_posts(
    page: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FeedPage:
    result = await db.scalars(
        _post_query()
        .where(Post.author_id == current_user.id)
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


@router.post("/posts", response_model=PostRead, status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: PostCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PostRead:
    post = Post(
        author_id=current_user.id,
        caption=payload.caption,
        type=payload.type,
        community_id=payload.community_id,
    )
    db.add(post)
    await db.commit()

    created = await _fetch_post(db, post.id)
    assert created is not None
    return _to_post_read(created, current_user.id)


@router.post("/posts/{post_id}/like", response_model=PostRead)
async def toggle_like(
    post_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PostRead:
    post = await _fetch_post(db, post_id)
    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    existing_like = await db.scalar(
        select(Like).where(Like.post_id == post_id, Like.user_id == current_user.id)
    )
    if existing_like is None:
        db.add(Like(post_id=post_id, user_id=current_user.id))
    else:
        await db.delete(existing_like)
    await db.commit()

    # Re-fetch rather than refresh(post) — expire_on_commit is False, so the
    # in-memory `likes` collection wouldn't otherwise pick up the change.
    updated = await _fetch_post(db, post_id)
    assert updated is not None
    return _to_post_read(updated, current_user.id)
