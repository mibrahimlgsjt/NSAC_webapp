# WORKER: UI_PERF_POLISH
> Scoped session. Implement only what's listed. Do not touch files outside OWNED FILES.

## CONTEXT
Finalize the visual and performance aspects of Campus Companions. This adds the "Gummy" tactile feel, ensures fast perceived load times via BlurHash, and optimizes queries.

## OWNED FILES
- static/sw.js
- static/manifest.json
- templates/base.html
- templates/public/index.html
- templates/public/animal_detail.html
- blueprints/api.py

## CONTRACT
- Design: Confetti on success, BlurHash placeholders, Tailwind v4 transitions.
- Perf: 5-minute TTL caching for trending animals.

## CONSTRAINTS
- Use `canvas-confetti` via CDN.
- Wire BlurHash strings into the template `<img>` tags (use a `loading` state).
- Ensure the Service Worker and Manifest are correctly linked for PWA support.
- Verify that `Animal` and `Sighting` indexes are actually used in queries (via logic review).

## TASK STEPS
1. `templates/base.html` — Add `canvas-confetti` CDN script. Add PWA meta tags.
2. `templates/public/index.html` — Implement BlurHash placeholders for the trending carousel.
3. `templates/public/animal_detail.html` — Add "Gummy" button animations and BlurHash loading state.
4. `blueprints/api.py` — Ensure `trending` endpoint is properly cached and invalidates on new sightings.
5. `static/manifest.json` — Update with NSAC branding and icons.
6. `static/sw.js` — Implement a basic "offline-first" cache for static assets.

## DEPENDENCIES
- none

## SHARED FILE TOUCHES
None.

## DONE CONDITIONS
- [ ] Confetti triggers on successful feeding submission (requires simple JS in template).
- [ ] Images show BlurHash placeholders before loading.
- [ ] PWA manifest is valid.
- [ ] Trending animals API response is cached.
- [ ] No Python or JS errors.

## STARTUP INSTRUCTIONS
Read this file fully. Read `design2.md` Section 7 and 8.
Begin at Step 1. Log decisions in CHECKPOINT.md.
