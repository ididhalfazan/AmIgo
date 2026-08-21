import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AuthorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str


class PostCreate(BaseModel):
    caption: str
    type: str = "status"
    community_id: uuid.UUID | None = None


class PostRead(BaseModel):
    id: uuid.UUID
    author: AuthorRead
    caption: str | None
    type: str
    community_id: uuid.UUID | None
    created_at: datetime
    like_count: int
    comment_count: int
    liked_by_me: bool


class FeedPage(BaseModel):
    posts: list[PostRead]
    has_more: bool
