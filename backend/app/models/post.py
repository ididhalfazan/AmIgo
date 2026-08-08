import uuid

from sqlalchemy import CheckConstraint, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, CreatedAtMixin, UUIDPrimaryKeyMixin


class Post(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "posts"
    __table_args__ = (
        CheckConstraint("type IN ('image', 'video', 'status')", name="ck_posts_type"),
        CheckConstraint("visibility IN ('public', 'private')", name="ck_posts_visibility"),
    )

    author_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    community_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("communities.id")
    )
    type: Mapped[str] = mapped_column(String(20))
    caption: Mapped[str | None] = mapped_column(String(5000))
    visibility: Mapped[str] = mapped_column(String(20), default="public")

    author: Mapped["User"] = relationship(back_populates="posts")  # noqa: F821
    community: Mapped["Community | None"] = relationship(back_populates="posts")  # noqa: F821
    media: Mapped[list["PostMedia"]] = relationship(back_populates="post")
    likes: Mapped[list["Like"]] = relationship(back_populates="post")
    comments: Mapped[list["Comment"]] = relationship(back_populates="post")


class PostMedia(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "post_media"
    __table_args__ = (
        CheckConstraint("media_type IN ('image', 'video')", name="ck_post_media_type"),
    )

    post_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("posts.id"))
    storage_key: Mapped[str] = mapped_column(String(1000))
    media_type: Mapped[str] = mapped_column(String(20))

    post: Mapped["Post"] = relationship(back_populates="media")


class Like(Base, CreatedAtMixin):
    __tablename__ = "likes"

    post_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("posts.id"), primary_key=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True
    )

    post: Mapped["Post"] = relationship(back_populates="likes")
    user: Mapped["User"] = relationship()  # noqa: F821


class Comment(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "comments"

    post_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("posts.id"))
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    body: Mapped[str] = mapped_column(String(2000))

    post: Mapped["Post"] = relationship(back_populates="comments")
    user: Mapped["User"] = relationship()  # noqa: F821
