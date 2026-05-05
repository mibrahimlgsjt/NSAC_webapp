# Codebase Structure

**Analysis Date:** 2024-05-23

## Directory Layout

```
NSAC_webapp-main/
├── blueprints/      # Flask routing modules
├── instance/        # Local SQLite database (auto-generated)
├── static/          # Static assets (CSS, JS, manifest)
├── templates/       # HTML template files (Jinja2)
├── tests/           # Unit tests
├── utils/           # Helper functions and external service integrations
├── app.py           # Application entry point and initialization
├── extensions.py    # Global singleton definitions
└── models.py        # Database models
```

## Directory Purposes

**`blueprints/`:**
- Purpose: Modular routing components.
- Contains: Python files defining Flask Blueprints.
- Key files: `api.py` (JSON endpoints), `public.py` (frontend HTML routes).

**`utils/`:**
- Purpose: Abstracted logic and helper scripts.
- Contains: Image processing, algorithms.
- Key files: `image_handler.py` (handles Pillow and Cloudinary logic), `bloom_filter.py` (custom voting filter).

**`templates/`:**
- Purpose: Frontend views.
- Contains: Jinja2 `.html` files.
- Key files: `base.html` (layout wrapper), `index.html` (homepage dashboard), `admin_panel.html`.

**`tests/`:**
- Purpose: Automated testing.
- Contains: Pytest files.
- Key files: `test_basic.py`.

## Key File Locations

**Entry Points:**
- `app.py`: Main application factory and server startup script.
- `gunicorn.conf.py`: Configuration for Gunicorn WSGI server.
- `pythonanywhere_wsgi.py`: WSGI entry point for PythonAnywhere hosting.

**Configuration:**
- `render.yaml`: Deployment spec for Render.
- `requirements.txt`: Python dependencies.

**Core Logic:**
- `models.py`: All SQLAlchemy schemas and property methods.
- `extensions.py`: Initializations for SQLAlchemy, LoginManager, Cache.

**Testing:**
- `tests/test_basic.py`: Functional tests.

## Naming Conventions

**Files:**
- snake_case: `app.py`, `image_handler.py`

**Directories:**
- snake_case: `blueprints`, `utils`

## Where to Add New Code

**New API Endpoint:**
- Primary code: `blueprints/api.py`
- Tests: `tests/test_basic.py`

**New HTML View:**
- Implementation: `blueprints/public.py` (or new blueprint)
- Template: `templates/new_view.html`

**New Database Entity:**
- Implementation: Add class to `models.py`. Ensure to run DB migrations (currently handled by `db.create_all()` in `app.py` seed logic).

**Utilities:**
- Shared helpers: `utils/`

## Special Directories

**`instance/`:**
- Purpose: Stores local `.sqlite` database file during development.
- Generated: Yes
- Committed: No (ignored via standard `.gitignore` practices, though currently present).

**`static/uploads/`:**
- Purpose: Local fallback directory for user-uploaded images if Cloudinary isn't configured.
- Generated: Yes (at runtime)
- Committed: No

---

*Structure analysis: 2024-05-23*