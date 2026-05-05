# WORKER: API_BP
> Scoped session. Implement only what's listed. Do not touch files outside OWNED FILES.

## CONTEXT
Implement the RESTful API for Campus Companions. This handles all data-driven interactions from both students (reporting, upvoting) and volunteers (logging feedings, medical cases).

## OWNED FILES
- blueprints/api.py

## CONTRACT
- Endpoints:
  - `GET /api/animals/trending`: Paginated trending animals.
  - `GET /api/animals/<id>/sightings`: Paginated sighting feed.
  - `POST /api/animals/<id>/karma`: Upvote personality tag (Bloom Filter gated).
  - `POST /api/feed`: Log a feeding round.
  - `POST /api/medical`: Open a medical case.
  - `POST /api/inventory/update`: Update stock quantity.
  - `POST /api/sighting`: Multipart image upload + sighting record.
  - `POST /api/emergency`: Student emergency report submission.

## CONSTRAINTS
- Return JSON for all endpoints.
- Use `login_required` for volunteer/admin endpoints (feed, medical, inventory).
- Use `vote_bloom` from `extensions.py` to prevent duplicate karma votes.
- Image uploads: Resize to max 800px width using Pillow (use a helper or local logic).
- Generate BlurHash for new sightings.
- Use SQLAlchemy for all database operations.

## TASK STEPS
1. `blueprints/api.py` — Implement all endpoints.
   - `trending`: Join animals with sightings/likes and cache if possible (simple query for now).
   - `karma`: Check `vote_bloom` before incrementing `Animal.likes`.
   - `feed`: Create `FeedingLog` and update `Animal.last_fed_at`.
   - `medical`: Create `MedicalLog` and update `Animal.health_status`.
   - `sighting`: Handle multipart file, save to `static/uploads/sightings/`, generate BlurHash, create `Sighting`.
   - `emergency`: Create `EmergencyReport`.

## DEPENDENCIES
- pillow
- blurhash-python

## SHARED FILE TOUCHES
- `app.py` — add: `# TODO-MERGE: from blueprints.api import api_bp; app.register_blueprint(api_bp)`

## DONE CONDITIONS
- [ ] All 8 API endpoints return valid JSON responses.
- [ ] Feeding log updates the animal's last fed timestamp.
- [ ] Image upload saves file and creates database record.
- [ ] Karma voting is successfully restricted by the Bloom Filter.
- [ ] No Python syntax errors.

## STARTUP INSTRUCTIONS
Read this file fully. Read `models.py` and `extensions.py`.
Begin at Step 1. Log decisions in CHECKPOINT.md.
