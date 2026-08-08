from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import User
from app.schemas.user import UserRead

router = APIRouter(prefix="/users", tags=["users"])

MEDIA_ROOT = Path(__file__).resolve().parent.parent.parent / "media"
AVATAR_DIR = MEDIA_ROOT / "avatars"

ALLOWED_CONTENT_TYPES = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp"}
MAX_AVATAR_BYTES = 5 * 1024 * 1024


@router.post("/me/avatar", response_model=UserRead)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> User:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PNG, JPEG, or WEBP images are allowed",
        )

    contents = await file.read()
    if len(contents) > MAX_AVATAR_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Image must be under 5MB"
        )

    AVATAR_DIR.mkdir(parents=True, exist_ok=True)
    extension = ALLOWED_CONTENT_TYPES[file.content_type]
    filename = f"{current_user.id}{extension}"
    (AVATAR_DIR / filename).write_bytes(contents)

    current_user.avatar_url = f"/media/avatars/{filename}"
    await db.commit()
    await db.refresh(current_user)
    return current_user
