<p align="center">
  <img src="./assets/banner.png" alt="AmIgo project banner" width="100%" />
</p>

<h3 align="center">Social Media Platform — Feed, Communities, and AI Agents</h3>

<p align="center">
  Profiles, posts, feeds, and communities — backed by AI agents that summarize activity,<br/>
  manage reminders, and let users act on the platform through chat.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/Python-3.11+-blue?style=flat-square&logo=python" />
  <img src="https://img.shields.io/badge/FastAPI-latest-green?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql" />
  <img src="https://img.shields.io/badge/Claude_API-Anthropic-D97757?style=flat-square" />
  <img src="https://img.shields.io/badge/Zustand-state-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Docker-compose-2496ED?style=flat-square&logo=docker" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
</p>

---

## Why this document exists

The [README](./README.md) states AmIgo's product vision but deliberately leaves the stack open ("FastAPI / Node.js", "PostgreSQL / MongoDB"). This document makes those decisions, in the same level of detail as a comparable shipped project ([FunShop](https://github.com/EsferSamiX/FunShop)), so implementation can start without re-litigating architecture per PR.

**Decisions pinned in this document, and why:**

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + Zustand + Axios — proven combination for SSR feeds and client-persisted state (cart in FunShop, feed/agent-chat state here).
- **Backend**: FastAPI + SQLAlchemy 2 (async) + Alembic + Pydantic + python-jose/bcrypt + uv + pytest — same stack as FunShop; async matters more here because agent calls to Claude are I/O-bound.
- **Database**: PostgreSQL 16 — relational integrity for follows/likes/community-membership graphs beats a document store here.
- **Auth**: JWT in an httpOnly cookie via a Next.js API-route proxy, same pattern as FunShop.
- **AI layer**: Claude API (Anthropic), Python SDK, `claude-sonnet-5` as the default agent model — see [Agent Layer](#agent-layer) below for why.

---

## Key Features

### Standard Social Media Features

- User login / sign-up (JWT via httpOnly cookie)
- User profile management (public/private post visibility)
- Image posting, video posting, status posting
- Activity feed (posts from people you follow)
- Community creation, membership, and interaction (posts scoped to a community)

### Agentic Features

| Agent | Trigger shape | What it does |
|---|---|---|
| **Reminder Agent** | Scheduled (cron) | End-of-day reminders, daily activity summary, platform-wide overview |
| **Community Agent** | Scheduled (cron) | Daily per-community summary, engagement sentiment, highlights |
| **Chat Agent** | Request (user-initiated) | Conversational access to platform actions — "remind me about X", "summarize community Y" |
| **Profile Summary Agent** | Request (on-demand) | Summarizes a user's **public** activity and interests only |

The Chat Agent can set reminders and sync them to Google Calendar; the Reminder Agent and Community Agent run unattended on a schedule and their output surfaces as notifications the user reads later.

---

## Architecture

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    BROWSER  —  Next.js 16  (port 3000)                   ║
║                                                                          ║
║  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐    ║
║  │  Feed / Profile  │  │  Communities     │  │  Agent Chat / Auth   │    ║
║  │                  │  │                  │  │                      │    ║
║  │  SSR feed        │  │  SSR list        │  │  Client-side chat UI │    ║
║  │  Infinite scroll │  │  SSG community   │  │  Zustand + localStorage│  ║
║  │  Post composer   │  │  page (ISR 1h)   │  │  httpOnly JWT cookie │    ║
║  │  (image/video)   │  │  Membership      │  │  Middleware guard    │    ║
║  └──────────────────┘  └──────────────────┘  └──────────────────────┘    ║
║                                                                          ║
║  React · TypeScript · Tailwind CSS · Zustand · Axios                     ║
╚═══════════════════════╦══════════════════════════════════════════════════╝
                        ║  HTTPS  REST / JSON
╔═══════════════════════╩══════════════════════════════════════════════════╗
║                  BACKEND API  —  FastAPI  (port 8000)                    ║
║                                                                          ║
║  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐ ┌───────────────┐  ║
║  │  /api/auth   │ │ /api/posts   │ │ /api/communities│ │ /api/agents  │  ║
║  │              │ │ /api/feed    │ │                │ │              │  ║
║  │ register     │ │ /api/media   │ │ create/join    │ │ POST /chat   │  ║
║  │ login / me   │ │ upload URL   │ │ list/detail    │ │ GET  summary │  ║
║  │ JWT HS256    │ │ likes/comments│ │ community feed │ │ (calls agents│  ║
║  │              │ │              │ │                │ │  package)    │  ║
║  └──────────────┘ └──────────────┘ └────────────────┘ └───────────────┘  ║
║                                                                          ║
║  app/agents/  — shared prompt/tool logic used by BOTH the API above     ║
║  and the scheduled worker below (see Agent Layer)                       ║
║                                                                          ║
║  SQLAlchemy 2 (async) · Alembic · Pydantic · python-jose · bcrypt        ║
╚═══════╦═══════════════════════════════════════════╦════════════════════╝
        ║  asyncpg (SQL)                             ║  imports app/agents/
╔═══════╩═══════════════════════════╗   ╔═══════════╩════════════════════╗
║   PostgreSQL 16  (port 5432)      ║   ║  WORKER  —  APScheduler process  ║
║                                    ║   ║  (same image, different entrypoint)║
║  users · follows · posts          ║   ║                                  ║
║  post_media · likes · comments    ║   ║  Nightly: Reminder Agent         ║
║  communities · community_members  ║   ║  Nightly: Community Agent        ║
║  reminders · notifications        ║   ║  → writes reminders/notifications ║
║  agent_chat_messages              ║◀──╢    back to Postgres              ║
╚════════════════════════════════════╝   ╚════════════════════════════════╝
                        ║                              ║
                        ╚══════════════╦═══════════════╝
                                        ║ HTTPS
                              ╔═════════╩═════════╗
                              ║   Claude API       ║
                              ║   (Anthropic)       ║
                              ║   claude-sonnet-5   ║
                              ╚═════════════════════╝
```

### Service Breakdown

| Service | Stack | Port | Responsibility |
|---|---|---|---|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS, Zustand | 3000 | SSR feed, composer, community pages, agent chat UI |
| **Backend API** | FastAPI, SQLAlchemy 2, Alembic, python-jose | 8000 | REST API, JWT auth, feed assembly, media upload URLs, request-path agent calls (chat, on-demand summaries) |
| **Worker** | Same backend image, `python -m app.worker` entrypoint, APScheduler | — | Runs the Reminder Agent and Community Agent on a nightly schedule |
| **Database** | PostgreSQL 16 | 5432 | Users, social graph, posts, communities, reminders, notifications |
| **Object storage** | S3-compatible (e.g. Cloudflare R2 / AWS S3) | — | Original image/video files uploaded by users |
| **Claude API** | Anthropic, `claude-sonnet-5` | — | Powers all four agents (chat + three summarizers) |

---

## Agent Layer

**This is the one decision FunShop's structure gives no template for — the tree diagram alone would hide it, so it's stated explicitly here.**

**Decision: one shared `backend/app/agents/` package, consumed by two different processes — not a separate top-level service.**

The deciding axis is *request-shaped vs. cron-shaped*, not "is it AI":

- **Chat Agent** is request-shaped: a user is waiting on the response, latency matters, it runs inside the FastAPI request path (`POST /api/agents/chat`).
- **Reminder Agent** and **Community Agent** are cron-shaped: nobody is waiting, they must run without an inbound request, they must run even if no user opens the app. These run in a separate **worker** process (APScheduler, `python -m app.worker`) started as a second container in `docker-compose.yml`, sharing the same Docker image and codebase as the API.
- **Profile Summary Agent** is a hybrid: on-demand but not conversational — triggered by a request (`GET /api/agents/profile-summary/{user_id}`), synchronous, no persistent schedule needed.

Both processes import the same `app/agents/` package (prompt templates, Claude tool definitions, DB query helpers) so agent logic is written once. What differs is *who calls it and when* — the API router calls it inline; the worker calls it on a schedule and persists the result as a `notification` row for the user to read later.

```
backend/app/agents/
├── client.py              # shared Anthropic client construction, model/effort defaults
├── tools.py                # Claude tool definitions: create_reminder, sync_google_calendar,
│                           #   query_community_activity, query_public_profile
├── reminder_agent.py        # end-of-day summary + reminders (called by worker)
├── community_agent.py        # daily community summary + engagement insights (called by worker)
├── chat_agent.py             # conversational tool-use loop (called by API request path)
└── profile_summary_agent.py  # public-activity summary (called by API request path)
```

**Model choice:** `claude-sonnet-5` as the default for all four agents — per Anthropic's current guidance it reaches near-Opus quality on summarization/tool-use tasks at Sonnet cost, which fits a social app's per-user, per-day call volume better than Opus pricing. Use the Python SDK's tool runner (`client.beta.messages.tool_runner`) for the Chat Agent's multi-turn tool loop; the three summarizer agents are single-call, no tool loop needed beyond the read-only query tools listed above. Effort defaults to `medium`; raise to `high` only if summary quality on real data proves it's needed.

**Google Calendar sync**: implemented as a tool (`sync_google_calendar`) the Chat Agent can call when a user asks to set a reminder — it performs OAuth (Google Calendar API) using a token stored per-user, and writes the resulting event ID onto the `reminders` row. This is request-path only (Reminder Agent does not sync calendar events on its own — it only writes `reminders` rows; syncing is a user-initiated action via chat).

### Privacy constraint (load-bearing, not a closing paragraph)

The README states: *"AmIgo should only summarize public profile activity when the information is publicly available."* This is encoded as a hard constraint on `profile_summary_agent.py`'s data-access layer, not as prompt wording alone:

- The query helper the Profile Summary Agent calls (`query_public_profile` in `tools.py`) filters `posts.visibility = 'public'` and `users.bio_is_public = true` **at the SQL level** — the agent is never handed private rows to selectively withhold. There is no code path where the agent's prompt sees private data and is merely instructed not to repeat it.
- The Community Agent's `query_community_activity` similarly only reads posts/comments from communities the requesting user is a member of.

---

## Media (image and video posting)

FunShop never needed an upload path — product images were DummyJSON CDN URLs. AmIgo does, and this is scoped explicitly:

- **Upload flow**: client requests a **presigned upload URL** from `POST /api/media/upload-url` (backend generates it against S3-compatible object storage), uploads the file directly to storage from the browser, then submits the resulting object key as part of `POST /api/posts`.
- **Storage target**: S3-compatible object storage (AWS S3 or Cloudflare R2 — either works; not pinned further since it's an infra choice, not an architecture one).
- **Transcoding**: **out of scope for Phase 1.** Images and videos are stored and served as uploaded; the frontend uses native `<img>` / `<video>` tags. No thumbnail generation, no format conversion, no resolution ladders. Revisit in Phase 3 if upload sizes or playback compatibility become a real problem.
- **Validation**: file-type and size limits are enforced backend-side before issuing the presigned URL (reject non-image/video MIME types, cap size — e.g. 10MB image / 100MB video) — this is a system boundary and does get validated, unlike internal function calls.

---

## Data Model

Not a renamed product catalog — a social graph. Each table's reason for existing:

| Table | Purpose |
|---|---|
| `users` | id, name, email, hashed_password, bio, avatar_url, bio_is_public |
| `follows` | follower_id, followee_id, created_at — the social graph |
| `posts` | id, author_id, community_id (nullable), type [image/video/status], caption, visibility [public/private], created_at |
| `post_media` | id, post_id, storage_key, media_type — supports multiple media per post |
| `likes` | post_id, user_id, created_at |
| `comments` | id, post_id, user_id, body, created_at |
| `communities` | id, slug, name, description, created_by |
| `community_members` | community_id, user_id, role [admin/member], joined_at |
| `reminders` | id, user_id, text, remind_at, google_calendar_event_id (nullable), source [agent/user] |
| `notifications` | id, user_id, type [reminder/community_summary/daily_summary], payload, read_at |
| `agent_chat_messages` | id, user_id, role, content, created_at — Chat Agent conversation history |

**Feed assembly**: query-time fan-out for Phase 1 — `GET /api/feed` joins `posts` to `follows` at read time (`WHERE author_id IN (SELECT followee_id FROM follows WHERE follower_id = :me)`), indexed on `(author_id, created_at)`. This is simpler to build and reason about than write-time fan-out (a per-follower feed-copy table), and is the right tradeoff at MVP scale. Revisit write-time fan-out only if read latency on the feed becomes a measured problem at higher follower-counts — not before.

**Community membership and roles** gate both post visibility (`community_id` posts are only listed to members) and the Community Agent's data access (see Privacy constraint above).

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create account — returns JWT |
| `POST` | `/api/auth/login` | Login — returns JWT |
| `GET` | `/api/auth/me` | Authenticated user info |
| `GET` | `/api/feed` | Paginated feed — posts from followed users |
| `POST` | `/api/posts` | Create a post (status/image/video, referencing uploaded media) |
| `GET` | `/api/posts/{id}` | Single post with comments |
| `POST` | `/api/posts/{id}/like` | Like/unlike a post |
| `POST` | `/api/posts/{id}/comments` | Add a comment |
| `POST` | `/api/media/upload-url` | Get a presigned upload URL for image/video |
| `GET` | `/api/communities` | List communities |
| `POST` | `/api/communities` | Create a community |
| `POST` | `/api/communities/{id}/join` | Join a community |
| `GET` | `/api/communities/{id}/feed` | Posts scoped to one community |
| `POST` | `/api/agents/chat` | Chat Agent — conversational request/response |
| `GET` | `/api/agents/community-summary/{id}` | On-demand community summary (Community Agent, request path) |
| `GET` | `/api/agents/profile-summary/{user_id}` | Public profile/interest summary (Profile Summary Agent) |
| `GET` | `/api/notifications` | List notifications (including nightly agent output) |

Full interactive docs at `http://localhost:8000/docs` (Swagger UI) once implemented — same as FunShop's backend.

---

## Pages

| Route | Rendering | Key Features |
|---|---|---|
| `/feed` | SSR | Infinite scroll, post composer (status/image/video) |
| `/communities` | SSR | List, join, create |
| `/communities/[slug]` | SSG (ISR 1h) | Community feed, membership, "Summarize this community" (calls Community Agent) |
| `/profile/[id]` | SSR | Public activity, "Summarize this person" (Profile Summary Agent, public data only) |
| `/chat` | Client | Agent Chat — conversational UI, JWT protected |
| `/notifications` | Client | Reminder/summary feed from the nightly worker |
| `/login` / `/register` | Client | JWT auth |

---

## Requirements

| Dependency | Version |
|---|---|
| Python | 3.11+ |
| Node.js | 18+ |
| PostgreSQL | 14+ |
| uv | latest |
| Anthropic API key | — |
| Google Cloud project (Calendar API) | — (only needed for calendar sync) |

---

## Project Structure

```
AmIgo/
├── backend/
│   ├── app/
│   │   ├── api/            # Route handlers (auth, posts, feed, communities, agents, media)
│   │   ├── agents/         # Shared agent package — see Agent Layer above
│   │   ├── core/            # Config, database, security
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic (feed assembly, media upload URLs, notifications)
│   │   └── worker.py          # APScheduler entrypoint — nightly Reminder/Community Agent runs
│   ├── migrations/            # Alembic migration files
│   └── tests/                  # pytest test suite
├── frontend/
│   └── src/
│       ├── app/               # Next.js pages (App Router)
│       ├── components/         # Reusable UI components
│       ├── hooks/               # Custom hooks (infinite scroll, agent chat streaming)
│       ├── lib/                  # Axios client
│       ├── store/                 # Zustand stores (composer state, chat state)
│       └── types/                  # TypeScript types
├── assets/                          # Logo and screenshots
├── docker-compose.yml                # postgres + backend (API) + worker + frontend
├── README.md
└── plan.md                             # this document
```

---

## Setup

### 1. Clone and configure

```bash
git clone https://github.com/your-username/amigo.git
cd amigo
```

### 2. Create the database

```sql
CREATE DATABASE amigo;
```

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
SECRET_KEY=your-long-random-secret-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/amigo
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000

ANTHROPIC_API_KEY=your-anthropic-api-key
AGENT_MODEL=claude-sonnet-5

STORAGE_ENDPOINT=your-s3-compatible-endpoint
STORAGE_BUCKET=amigo-media
STORAGE_ACCESS_KEY=...
STORAGE_SECRET_KEY=...

GOOGLE_CALENDAR_CLIENT_ID=...
GOOGLE_CALENDAR_CLIENT_SECRET=...
```

### 4. Install dependencies, migrate, run

```bash
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload          # API on :8000
uv run python -m app.worker                   # separate terminal/container — nightly agents
```

### 5. Frontend

```bash
cd ../frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm install
npm run dev                                   # :3000
```

---

## Docker

```yaml
# docker-compose.yml (shape)
services:
  postgres: ...
  backend:      # FastAPI API — uvicorn entrypoint
  worker:       # same image as backend — `python -m app.worker` entrypoint instead
  frontend:     # Next.js
```

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger docs | http://localhost:8000/docs |
| Worker | no exposed port — runs the nightly agent schedule |

---

## Roadmap

### Phase 1: Core Social Media Platform

- User registration, login, profile management
- Status/image/video posting (direct-to-storage upload, no transcoding)
- Query-time feed assembly
- Basic community creation, membership, and community feed

### Phase 2: Agentic Features

- Reminder Agent (nightly, via worker)
- Community Agent (nightly, via worker)
- Chat Agent (request-path, tool-use loop)
- Profile Summary Agent (public-data-only, enforced at the query layer)

### Phase 3: Integrations and Improvements

- Google Calendar sync (Chat Agent tool)
- Notification system polish, read/unread state
- Revisit feed fan-out strategy if read latency becomes a measured problem
- Media transcoding/thumbnails if upload size or format compatibility becomes a problem
- Community engagement analytics beyond what the Community Agent already summarizes
- Privacy/permission controls beyond public/private post visibility

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `SECRET_KEY` | Yes | — | JWT signing secret |
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `ALGORITHM` | No | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `30` | JWT token lifetime |
| `FRONTEND_URL` | No | `http://localhost:3000` | Allowed CORS origin |
| `NEXT_PUBLIC_API_URL` | Yes (frontend) | — | Backend base URL for the frontend bundle |
| `ANTHROPIC_API_KEY` | Yes | — | Claude API key — powers all four agents |
| `AGENT_MODEL` | No | `claude-sonnet-5` | Model used by the agent layer |
| `STORAGE_ENDPOINT` / `STORAGE_BUCKET` / `STORAGE_ACCESS_KEY` / `STORAGE_SECRET_KEY` | Yes | — | S3-compatible object storage for media uploads |
| `GOOGLE_CALENDAR_CLIENT_ID` / `GOOGLE_CALENDAR_CLIENT_SECRET` | No | — | Only needed for the Chat Agent's calendar-sync tool |

---

## Assumptions & Limitations

- Media transcoding, thumbnailing, and resolution ladders are out of scope for Phase 1 — files are stored and served as uploaded.
- Feed assembly is query-time fan-out; this is a deliberate MVP tradeoff, not an oversight — revisit only if it measurably doesn't scale.
- The Profile Summary Agent's privacy constraint is enforced at the SQL query layer, not by prompt instruction alone — private data is never in the agent's context to begin with.
- The Reminder Agent writes reminders but does not sync to Google Calendar on its own; calendar sync is a Chat Agent tool the user invokes explicitly.
- JWT tokens expire in 30 minutes with no refresh-token flow, matching FunShop's precedent — users are redirected to login on expiry.

---

## Privacy Considerations

AmIgo should only summarize public profile activity when the information is publicly available. Private user data should not be used for summaries without proper permission — see [Privacy constraint](#privacy-constraint-load-bearing-not-a-closing-paragraph) above for how this is enforced in code, not just in prompt wording.

---

## License

MIT
