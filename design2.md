# NSAC Campus Companions — System Design Document

> **NUST Stray Animals Club (NSAC)** · Mobile-First Web Application  
> Stack: Flask 3.x · SQLAlchemy · Alpine.js · Tailwind CSS v4

---

## 1. Problem Statement

NUST's campus hosts a significant population of stray animals managed informally by the NUST Stray Animals Club. Currently, feeding rounds are tracked via WhatsApp groups, medical cases are logged in spreadsheets, and emergency reports from students have no structured channel. This creates coordination failures — missed feedings, duplicated rescues, and lost medical history.

**Campus Companions** is a purpose-built platform that replaces this informal system with structured, role-aware tooling for both students and volunteers.

---

## 2. Target Users & Core Use Cases

| User | Primary Need | Key Actions |
|---|---|---|
| **Student** | Discover campus animals; report emergencies | Browse directory, view feeding status, submit sighting/report |
| **Volunteer** | Log feeding rounds and medical cases | Mark feedings, open/close medical logs, update inventory |
| **Admin** | Oversee operations and export records | Full CRUD, CSV export, inventory ABC analysis |

---

## 3. Architecture

The application follows a **Blueprint-modular Flask architecture** with a clear separation between public-facing, admin, API, and auth concerns.

```
campus-companions/
├── app.py                  # App factory, config, blueprint registration
├── extensions.py           # DB, Cache, Login manager initialization
├── models.py               # SQLAlchemy schema
├── blueprints/
│   ├── public/             # Student-facing views
│   ├── admin/              # Volunteer/Admin dashboard
│   ├── api/                # RESTful endpoints
│   └── auth/               # Login / logout
├── utils/
│   ├── image.py            # Resize + BlurHash generation
│   └── bloom_filter.py     # Duplicate vote prevention
├── static/                 # Tailwind output, icons, confetti assets
└── templates/              # Jinja2 templates (Gummy UI design language)
```

### Request Lifecycle

```
Browser → Flask Router → Blueprint View → SQLAlchemy ORM → SQLite / PostgreSQL
                                       ↘ Flask-Caching (SimpleCache)
                                       ↘ utils/ (image, bloom filter)
```

---

## 4. Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Backend | Flask 3.x + Blueprints | Lightweight, hackathon-friendly, easy modularization |
| ORM | SQLAlchemy 2.x | Declarative models, easy migration path to PostgreSQL |
| Database | SQLite (dev) / PostgreSQL or Turso (prod) | Zero-config dev; scalable prod options |
| Frontend CSS | Tailwind CSS v4 | Utility-first; Gummy UI design tokens built on CSS variables |
| Frontend JS | Alpine.js v3 | Lightweight reactivity without a full SPA build step |
| Auth | Flask-Login | Session-based RBAC; minimal overhead |
| Caching | Flask-Caching (SimpleCache) | In-process cache for trending queries; drop-in upgrade to Redis |
| Images | Pillow + BlurHash | Responsive placeholders for low-bandwidth campus Wi-Fi |

---

## 5. Data Model

### Entity Overview

```
User ──< FeedingLog
User ──< MedicalLog
User ──< Sighting

Animal ──< FeedingLog
Animal ──< MedicalLog
Animal ──< Sighting
Animal ──< EmergencyReport

InventoryItem  (standalone, ABC-categorized)
```

### Entity Descriptions

**`User`**
- Fields: `id`, `username`, `password_hash`, `role` (`admin` | `volunteer`), `created_at`
- Role-based access control enforced at blueprint level via `@login_required` + role checks.

**`Animal`**
- Fields: `id`, `name`, `species`, `sector`, `health_status`, `mood`, `last_fed_at`, `blurhash`, `personality_tags`
- Composite index on `(sector, last_fed_at)` for fast sector-status queries.

**`Sighting`**
- Fields: `id`, `animal_id`, `reporter_name`, `image_path`, `blurhash`, `location_hint`, `created_at`
- Composite index on `(animal_id, created_at)` for paginated sighting feeds.

**`FeedingLog`**
- Fields: `id`, `animal_id`, `volunteer_id`, `fed_at`, `notes`
- Drives the "Last Fed" badge on the public directory.

**`MedicalLog`**
- Fields: `id`, `animal_id`, `volunteer_id`, `status` (`open` | `closed`), `description`, `cost`, `opened_at`, `closed_at`
- Full rescue lifecycle — supports cost tracking for club reporting.

**`EmergencyReport`**
- Fields: `id`, `animal_id` (nullable), `reporter_name`, `location`, `severity` (`minor_injury` | `sickness` | `other`), `created_at`
- Feeds the admin dashboard alert queue.

**`InventoryItem`**
- Fields: `id`, `name`, `category` (`A` | `B` | `C`), `quantity`, `unit`, `low_stock_threshold`, `last_updated`
- ABC classification allows volunteers to prioritize restocking critical items.

---

## 6. Module Breakdown

### `public` Blueprint — Student-Facing Views

| Route | View | Description |
|---|---|---|
| `/` | Home | Sector feeding status grid + animal carousel (trending) |
| `/directory` | Directory | Searchable, filterable list of all campus animals |
| `/animal/<id>` | Detail | Personality traits, mood badge, sighting gallery, feeding history |
| `/report` | Report | Emergency submission form with severity selector |

### `admin` Blueprint — Volunteer/Admin Dashboard

| Route | Description |
|---|---|
| `/admin/panel` | Overview: open medical cases, recent feedings, low-stock alerts |
| `/admin/medical` | Medical log table with open/close actions |
| `/admin/inventory` | Stock management with ABC category filter |
| `/admin/export` | CSV export of medical logs for club reporting |

All admin routes are protected by `@login_required` + role assertion.

### `api` Blueprint — RESTful Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/animals/trending` | GET | Paginated trending animals (cached) |
| `/api/animals/<id>/sightings` | GET | Paginated sighting feed |
| `/api/animals/<id>/karma` | POST | Upvote personality tag (Bloom Filter gated) |
| `/api/feed` | POST | Log a feeding round |
| `/api/medical` | POST | Open a medical case |
| `/api/inventory/update` | POST | Update stock quantity |
| `/api/sighting` | POST | Multipart image upload + sighting record |
| `/api/emergency` | POST | Student emergency report submission |

### `auth` Blueprint

- `GET/POST /login` — Credential validation, session creation.
- `GET /logout` — Session teardown.

---

## 7. Performance & Optimizations

### Image Pipeline
1. Student uploads image via `/api/sighting` (multipart).
2. Pillow resizes to a max dimension (e.g., 800px) before disk write.
3. BlurHash string is computed and stored on the `Sighting` / `Animal` record.
4. Frontend renders the BlurHash placeholder instantly; swaps in the real image on load.

This keeps perceived load time fast on NUST's shared campus Wi-Fi.

### Bloom Filter — Duplicate Vote Prevention
- `utils/bloom_filter.py` implements a bit-array Bloom Filter keyed on `(user_fingerprint, animal_id, tag)`.
- False-positive rate is acceptable: a rare missed vote is better than DB-hammering uniqueness checks on every karma interaction.
- Filter is persisted to disk (pickle) to survive server restarts.

### Caching Strategy
- Trending animals query (expensive join + sort) is cached with a 5-minute TTL via `@cache.cached`.
- Cache is invalidated on new feeding log or sighting submission.
- SimpleCache is used for development; the same `cache.cached` decorator works with a Redis backend in production with a one-line config change.

### Database Indexing
```python
# Animal — fast sector status lookups
Index('ix_animal_sector_fed', Animal.sector, Animal.last_fed_at)

# Sighting — fast paginated feeds per animal
Index('ix_sighting_animal_created', Sighting.animal_id, Sighting.created_at)
```

---

## 8. UI/UX — Gummy UI Design Language

The visual identity is built around **Glassmorphism** with soft, tactile "Gummy" elements:

- **Glass Cards**: `backdrop-filter: blur` + semi-transparent backgrounds on animal cards, dashboard panels.
- **Mood Badges**: Color-coded pill badges (`Happy 🟢`, `Resting 🟡`, `Unwell 🔴`) derived from `Animal.mood`.
- **Mobile-First Layout**: Bottom navigation bar, 48px+ touch targets, swipeable carousels.
- **Confetti Rewards**: Lightweight confetti burst triggered on successful feeding log submission — positive reinforcement for volunteers.
- **BlurHash Placeholders**: Smooth color-bloom placeholder shown while images load, matching the card's glassmorphic palette.
- **Feeding Status Grid**: Home page shows a sector grid with color-coded urgency (green → fed recently, amber → overdue, red → critical).

---

## 9. Deployment Considerations

| Concern | Approach |
|---|---|
| Database | SQLite for local dev; environment variable switches to PostgreSQL / Turso for prod |
| Static Files | Tailwind CSS compiled to a single minified output; served via Flask static or CDN |
| Image Storage | Local `static/uploads/` for dev; swap to object storage (S3-compatible) for prod |
| Secret Management | `SECRET_KEY` and DB credentials via `.env` + `python-dotenv` |
| WSGI | Gunicorn in production; Flask dev server locally |

---

## 10. Future Extensions

- **Push Notifications**: Volunteer alerts for new emergency reports via Web Push API.
- **Geolocation Sightings**: Map view of sighting clusters by campus sector.
- **ML Mood Inference**: Infer animal mood from uploaded sighting images (lightweight MobileNet).
- **Redis Upgrade**: Drop-in cache backend upgrade for multi-worker production deployments.
- **PWA Support**: Service worker + manifest for offline access to the animal directory.
