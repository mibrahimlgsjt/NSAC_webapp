# Coding Conventions

**Analysis Date:** 2024-05-23

## Naming Patterns

**Files:**
- Snake Case: `image_handler.py`, `bloom_filter.py`

**Classes:**
- Pascal Case: `Animal`, `Sighting`, `MedicalLog` (in `models.py`)

**Functions & Variables:**
- Snake Case: `feed_animal`, `vote_tag`, `hunger_score`, `last_fed`

## Code Style

**Formatting:**
- No strict formatter configuration found (e.g., Black, Prettier configs are missing). Code relies on standard PEP-8 style formatting.

**Linting:**
- No linting configuration detected (e.g., Flake8, Ruff).

## Import Organization

**Order:**
1. Standard library imports (`os`, `datetime`)
2. Third-party library imports (`flask`, `sqlalchemy`)
3. Local application imports (`models`, `extensions`, `utils`)

**Pattern:**
- Explicit imports are favored over star imports.
- e.g., `from models import Animal, Sighting` instead of `from models import *`.

## Error Handling

**Patterns:**
- HTTP Errors: Uses `db.get_or_404()` to automatically throw 404s if resources are missing (`blueprints/api.py`).
- Try-Catch Blocks: Exceptions are caught and printed locally (`print(f"Error saving image: {e}")`) rather than utilizing a robust logging framework (`utils/image_handler.py`).
- JSON Returns: API errors are returned as JSON dicts like `return jsonify(error="..."), 400` instead of raising exceptions.

## Logging

**Framework:** `print` statements (console)

**Patterns:**
- Used for simple status updates during DB seeding (`print("Seeding database...")`).
- Used for error catching in utilities (`print(f"Blurhash error: {e}")`).
- *Note:* A structured logging module (`logging`) is not actively configured or used.

## Comments

**When to Comment:**
- Minimal inline comments. Comments are mostly used for explaining "why" a certain workaround exists, e.g., `# Fix for Heroku/Render Postgres URLs`.
- Used to define structural blocks in large files (e.g., `# --- Round 4: Paginated Sightings ---` in `blueprints/api.py`).

**Docstrings:**
- Very sparse. Some utility functions include brief docstrings (e.g., `save_image` in `utils/image_handler.py`). Models and route handlers typically omit docstrings.

## Function Design

**Size:**
- Route handlers are kept relatively small (10-25 lines).
- Utility functions are larger when dealing with external libraries or file systems (e.g., `save_image` is ~60 lines).

**Return Values:**
- API routes consistently use Flask's `jsonify()` for structured responses containing `success` booleans and payload data (e.g., `jsonify(success=True, message="...")`).
- View routes consistently use `render_template()` or `redirect()`.

## Module Design

**Application Factory Pattern (Partial):**
- The app uses a global `app = Flask(__name__)` instantiation in `app.py` instead of a true `create_app()` factory function. However, extensions are initialized cleanly using `.init_app()` or imported globally via `extensions.py` to prevent circular imports.

**Blueprints:**
- Extensively used to split route handling by domain logic (`admin`, `public`, `auth`, `api`).

---

*Convention analysis: 2024-05-23*