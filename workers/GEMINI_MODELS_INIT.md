# WORKER: MODELS_INIT
> Scoped session. Implement only what's listed. Do not touch files outside OWNED FILES.

## CONTEXT
Align the data models and application factory with the new System Design Document (design2.md). This ensures the foundation for all blueprints is correct.

## OWNED FILES
- models.py
- extensions.py
- app.py

## CONTRACT
- Models: User, Animal, Sighting, FeedingLog, MedicalLog, EmergencyReport, InventoryItem
- Factory: create_app() in app.py

## CONSTRAINTS
- Flask 3.x with application factory pattern
- SQLAlchemy 2.x declarative models
- SQLite in development
- Role-based fields in User model
- Indexing for sector and timestamp fields as per design2.md

## TASK STEPS
1. `models.py` — Update models to match design2.md specifications.
   - User: id, username, password_hash, role, created_at
   - Animal: id, name, species, sector, health_status, mood, last_fed_at, blurhash, personality_tags
   - Sighting: id, animal_id, reporter_name, image_path, blurhash, location_hint, created_at
   - FeedingLog: id, animal_id, volunteer_id, fed_at, notes
   - MedicalLog: id, animal_id, volunteer_id, status (open/closed), description, cost, opened_at, closed_at
   - EmergencyReport: id, animal_id (nullable), reporter_name, location, severity, created_at
   - InventoryItem: id, name, category (A/B/C), quantity, unit, low_stock_threshold, last_updated
2. `extensions.py` — Ensure db, cache, and login_manager are initialized globally as singletons.
3. `app.py` — Refine `create_app()` to handle configuration, initialize extensions, and register blueprints.

## DEPENDENCIES
- blurhash-python==1.1.4

## SHARED FILE TOUCHES
None (All owned files).

## DONE CONDITIONS
- [ ] All models in `models.py` match the `design2.md` schema.
- [ ] `create_app()` correctly initializes the app and extensions.
- [ ] No Python syntax errors (`python -m py_compile models.py extensions.py app.py`)
- [ ] Database can be initialized via `flask shell` (smoke test).

## STARTUP INSTRUCTIONS
Read this file fully. Then read each owned file in full before writing anything.
Begin at Step 1. Make reasonable decisions and log them under "Worker Notes" in CHECKPOINT.md.

Commit when all done conditions are met.
