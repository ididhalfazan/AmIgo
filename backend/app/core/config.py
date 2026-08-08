from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    secret_key: str = "dev-secret-key-change-me"
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/amigo"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    frontend_url: str = "http://localhost:3000"

    anthropic_api_key: str | None = None
    agent_model: str = "claude-sonnet-5"

    storage_endpoint: str | None = None
    storage_bucket: str | None = None
    storage_access_key: str | None = None
    storage_secret_key: str | None = None

    google_calendar_client_id: str | None = None
    google_calendar_client_secret: str | None = None


settings = Settings()
