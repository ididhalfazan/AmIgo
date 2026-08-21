import uuid

from pydantic import BaseModel, ConfigDict, Field


class CommunityCreate(BaseModel):
    name: str
    slug: str = Field(pattern=r"^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")
    description: str | None = None


class CommunityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    slug: str
    name: str
    description: str | None
    member_count: int
    is_member: bool
