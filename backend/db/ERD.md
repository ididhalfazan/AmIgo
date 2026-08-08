# AmIgo — Entity Relationship Diagram

Schema for the Phase 1 social platform (see `plan.md` > Data Model for the narrative version). 11 tables.

```mermaid
erDiagram
    USERS {
        uuid id PK
        string name
        string email UK
        string hashed_password
        string bio
        string avatar_url
        bool bio_is_public
        timestamp created_at
    }

    FOLLOWS {
        uuid follower_id FK
        uuid followee_id FK
        timestamp created_at
    }

    POSTS {
        uuid id PK
        uuid author_id FK
        uuid community_id FK "nullable"
        string type "image | video | status"
        string caption
        string visibility "public | private"
        timestamp created_at
    }

    POST_MEDIA {
        uuid id PK
        uuid post_id FK
        string storage_key
        string media_type "image | video"
    }

    LIKES {
        uuid post_id FK
        uuid user_id FK
        timestamp created_at
    }

    COMMENTS {
        uuid id PK
        uuid post_id FK
        uuid user_id FK
        string body
        timestamp created_at
    }

    COMMUNITIES {
        uuid id PK
        string slug UK
        string name
        string description
        uuid created_by FK
    }

    COMMUNITY_MEMBERS {
        uuid community_id FK
        uuid user_id FK
        string role "admin | member"
        timestamp joined_at
    }

    REMINDERS {
        uuid id PK
        uuid user_id FK
        string text
        timestamp remind_at
        string google_calendar_event_id "nullable"
        string source "agent | user"
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string type "reminder | community_summary | daily_summary"
        json payload
        timestamp read_at "nullable"
        timestamp created_at
    }

    AGENT_CHAT_MESSAGES {
        uuid id PK
        uuid user_id FK
        string role "user | assistant"
        string content
        timestamp created_at
    }

    USERS ||--o{ FOLLOWS : "follower_id"
    USERS ||--o{ FOLLOWS : "followee_id"
    USERS ||--o{ POSTS : "authors"
    COMMUNITIES ||--o{ POSTS : "scopes (nullable)"
    POSTS ||--o{ POST_MEDIA : "attaches"
    POSTS ||--o{ LIKES : "receives"
    USERS ||--o{ LIKES : "gives"
    POSTS ||--o{ COMMENTS : "receives"
    USERS ||--o{ COMMENTS : "writes"
    COMMUNITIES ||--o{ COMMUNITY_MEMBERS : "has"
    USERS ||--o{ COMMUNITY_MEMBERS : "joins"
    USERS ||--o{ COMMUNITIES : "creates (created_by)"
    USERS ||--o{ REMINDERS : "owns"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AGENT_CHAT_MESSAGES : "sends"
```

## Notes

- **`FOLLOWS` is a self-referencing join on `USERS`** (`follower_id` and `followee_id` both point to `users.id`) — Mermaid draws it as two relationships since it can't express one table joining to itself twice in a single edge.
- **`POSTS.community_id` is nullable** — a post either belongs to a community feed or is a plain profile/follow-feed post.
- **`POST_MEDIA` is one-to-many** — a single post can carry multiple images/videos (a carousel), not just one.
- **Feed assembly is query-time**, not a separate fan-out table — see `plan.md` > Data Model for why.
- **Privacy enforcement**: the Profile Summary Agent's queries filter on `POSTS.visibility = 'public'` and `USERS.bio_is_public = true` at the SQL layer — see `plan.md` > Agent Layer > Privacy constraint.
- **Not yet in this schema**: a `reposts`/share table (the feed UI has a share button, but re-sharing isn't modeled in Phase 1 — flagged during schema review, not yet confirmed to add).
