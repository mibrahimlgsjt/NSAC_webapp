# WORKER: PUBLIC_BP
> Scoped session. Implement only what's listed. Do not touch files outside OWNED FILES.

## CONTEXT
Implement the student-facing side of Campus Companions. This includes the home page dashboard, animal directory, detailed animal profiles, and the emergency reporting form.

## OWNED FILES
- blueprints/public.py
- templates/public/index.html
- templates/public/directory.html
- templates/public/animal_detail.html
- templates/public/report.html

## CONTRACT
- Routes: `/` (index), `/directory`, `/animal/<id>`, `/report`
- Features: Sector feeding status grid, trending animals carousel, searchable directory, emergency form.

## CONSTRAINTS
- Use Gummy UI (Glassmorphism, backdrop-blur, soft colors).
- Home page: Show a grid of sectors (C1, C2, NBS, SEECS, etc.) with feeding status.
- Animal Detail: Show personality tags, mood badge, and last fed status.
- Emergency Form: Use `severity` selector (minor_injury, sickness, other).
- Use Alpine.js for interactive elements (e.g., search filtering in directory).
- Extend `templates/base.html`.

## TASK STEPS
1. `blueprints/public.py` — Implement routes for index, directory, animal_detail, and report.
   - `index`: Fetch all animals (trending) and calculate sector feeding status for the grid.
   - `directory`: List all animals, ordered by name.
   - `animal_detail`: Show specific animal info + recent sightings.
2. `templates/public/index.html` — Build the homepage with sector grid and trending carousel.
3. `templates/public/directory.html` — Build the searchable list of animals.
4. `templates/public/animal_detail.html` — Build the tactile profile page.
5. `templates/public/report.html` — Build the emergency reporting form.

## DEPENDENCIES
- none

## SHARED FILE TOUCHES
- `app.py` — add: `# TODO-MERGE: from blueprints.public import public_bp; app.register_blueprint(public_bp)`

## DONE CONDITIONS
- [ ] All 4 public routes render correctly.
- [ ] Sector grid correctly reflects feeding status from `FeedingLog`.
- [ ] Directory search (client-side via Alpine.js) works.
- [ ] No Python syntax errors.
- [ ] UI follows Gummy UI aesthetics.

## STARTUP INSTRUCTIONS
Read this file fully. Read `models.py` to understand the relationships and fields.
Begin at Step 1. Log decisions in CHECKPOINT.md.
