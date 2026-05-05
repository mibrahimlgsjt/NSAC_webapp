# Technology Stack

**Analysis Date:** 2024-05-23

## Languages

**Primary:**
- Python 3.10 - Backend logic and web framework
- HTML/CSS/JavaScript - Frontend UI and logic (Vanilla JS)

**Secondary:**
- SQL (via ORM) - Database queries

## Runtime

**Environment:**
- Python 3.10 (as specified in `render.yaml` and `app.py`)

**Package Manager:**
- pip
- Lockfile: `requirements.txt` present

## Frameworks

**Core:**
- Flask 3.0.3 - Web application framework
- SQLAlchemy 2.0.29 / Flask-SQLAlchemy 3.1.1 - ORM and database abstraction

**Testing:**
- pytest 8.1.1 - Unit testing framework

**Build/Dev:**
- gunicorn 21.2.0 - WSGI HTTP Server for UNIX (Production)

## Key Dependencies

**Critical:**
- Pillow 10.3.0 - Image processing and manipulation (resizing, converting)
- blurhash - Generating compact image placeholders
- Flask-Login 0.6.3 - User authentication and session management
- Flask-Caching 2.1.0 - In-memory caching for trending animals and optimizations

**Infrastructure:**
- psycopg2-binary 2.9.11 - PostgreSQL database adapter
- cloudinary 1.36.0 - Cloud image hosting and delivery API client

## Configuration

**Environment:**
- Configured via environment variables (e.g. `DATABASE_URL`, `SECRET_KEY`, `CLOUDINARY_URL`, `CLOUDINARY_API_KEY`)
- Handled gracefully in `app.py` with fallbacks for local development (e.g., SQLite for local).

**Build:**
- `render.yaml` - Infrastructure-as-code deployment configuration for Render
- `gunicorn.conf.py` - Worker configuration and concurrency settings

## Platform Requirements

**Development:**
- Python 3.10
- SQLite

**Production:**
- Render platform (Web service and Postgres Database)
- WSGI capable host (Gunicorn with Nginx)

---

*Stack analysis: 2024-05-23*