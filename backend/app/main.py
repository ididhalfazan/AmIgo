from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import auth, communities, notifications, posts, users
from app.api.users import MEDIA_ROOT
from app.core.config import settings

app = FastAPI(title="AmIgo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MEDIA_ROOT.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=str(MEDIA_ROOT)), name="media")

app.include_router(auth.router, prefix="/api")
app.include_router(posts.router, prefix="/api")
app.include_router(communities.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(users.router, prefix="/api")


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
