import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDPrimaryKeyMixin, utcnow


class Community(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "communities"

    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(String(2000))
    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))

    posts: Mapped[list["Post"]] = relationship(back_populates="community")  # noqa: F821
    members: Mapped[list["CommunityMember"]] = relationship(back_populates="community")


class CommunityMember(Base):
    __tablename__ = "community_members"
    __table_args__ = (
        CheckConstraint("role IN ('admin', 'member')", name="ck_community_members_role"),
    )

    community_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("communities.id"), primary_key=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True
    )
    role: Mapped[str] = mapped_column(String(20), default="member")
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    community: Mapped["Community"] = relationship(back_populates="members")
    user: Mapped["User"] = relationship()  # noqa: F821
