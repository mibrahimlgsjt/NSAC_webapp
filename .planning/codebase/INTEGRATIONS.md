# External Integrations

**Analysis Date:** 2024-05-23

## APIs & External Services

**Image Hosting:**
- Cloudinary - Used for storing and serving user-uploaded sightings and animal profile images.
  - SDK/Client: `cloudinary`
  - Auth: `CLOUDINARY_URL`, `CLOUDINARY_CLOUD_name`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - Implementation: Handled in `utils/image_handler.py`. Fallbacks to local filesystem if not configured.

## Data Storage

**Databases:**
- PostgreSQL (Production)
  - Connection: `DATABASE_URL` (configured via Render's managed Postgres)
  - Client: `psycopg2-binary` and `Flask-SQLAlchemy`
- SQLite (Local Development)
  - Connection: Hardcoded fallback `sqlite:///nsac.sqlite` in `app.py`
  - Client: Built-in Python `sqlite3` and `Flask-SQLAlchemy`

**File Storage:**
- Cloudinary (Production)
- Local filesystem only (Development / Fallback) - uses `static/uploads/sightings` directory structure.

**Caching:**
- In-memory SimpleCache (`Flask-Caching`) - Configured in `app.py` and `extensions.py`

## Authentication & Identity

**Auth Provider:**
- Custom (Local Database)
  - Implementation: Session-based using `Flask-Login` (`login_manager`). Password hashing via `werkzeug.security`.
  - Roles: "admin", "volunteer".

## Monitoring & Observability

**Error Tracking:**
- None detected.

**Logs:**
- Standard output logs via Gunicorn and Flask.
- Manual logging using print statements in `utils/image_handler.py`.

## CI/CD & Deployment

**Hosting:**
- Render
  - Configuration: `render.yaml` defining web service and database.
- PythonAnywhere (Alternative)
  - Configuration: `pythonanywhere_wsgi.py` present.

**CI Pipeline:**
- None detected natively in repo (Render auto-deploys on push).

## Environment Configuration

**Required env vars:**
- `DATABASE_URL` - Database connection string
- `SECRET_KEY` - Flask session and security key
- `CLOUDINARY_URL` - Cloudinary connection string (Optional but recommended)

**Secrets location:**
- Expected to be provided by host (Render environment settings). `app.py` defaults to `nsac_secret_key` if `SECRET_KEY` is omitted, which is insecure for production.

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- None detected.

---

*Integration audit: 2024-05-23*