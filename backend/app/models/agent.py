import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, CreatedAtMixin, UUIDPrimaryKeyMixin


class Reminder(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "reminders"
    __table_args__ = (
        CheckConstraint("source IN ('agent', 'user')", name="ck_reminders_source"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    text: Mapped[str] = mapped_column(String(2000))
    remind_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    google_calendar_event_id: Mapped[str | None] = mapped_column(String(255))
    source: Mapped[str] = mapped_column(String(20), default="user")

    user: Mapped["User"] = relationship(back_populates="reminders")  # noqa: F821


class Notification(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "notifications"
    __table_args__ = (
        CheckConstraint(
            "type IN ('reminder', 'community_summary', 'daily_summary')",
            name="ck_notifications_type",
        ),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    type: Mapped[str] = mapped_column(String(30))
    payload: Mapped[dict] = mapped_column(JSONB)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user: Mapped["User"] = relationship(back_populates="notifications")  # noqa: F821


class AgentChatMessage(Base, UUIDPrimaryKeyMixin, CreatedAtMixin):
    __tablename__ = "agent_chat_messages"
    __table_args__ = (
        CheckConstraint("role IN ('user', 'assistant')", name="ck_agent_chat_messages_role"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    role: Mapped[str] = mapped_column(String(20))
    content: Mapped[str] = mapped_column(String(10000))

    user: Mapped["User"] = relationship()  # noqa: F821
