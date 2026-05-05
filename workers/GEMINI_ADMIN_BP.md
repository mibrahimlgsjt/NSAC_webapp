# WORKER: ADMIN_BP
> Scoped session. Implement only what's listed. Do not touch files outside OWNED FILES.

## CONTEXT
Implement the volunteer and admin management interfaces. This is the core coordination tool for NSAC, replacing manual spreadsheets with structured medical logs, inventory tracking, and summary dashboards.

## OWNED FILES
- blueprints/admin.py
- templates/admin/admin_panel.html
- templates/admin/medical.html
- templates/admin/inventory.html

## CONTRACT
- Routes: `/admin/panel`, `/admin/medical`, `/admin/inventory`, `/admin/export` (CSV)
- Features: Medical log management (open/close), inventory ABC analysis (low-stock alerts), record export.

## CONSTRAINTS
- Protect all routes with `@login_required`.
- Assert `current_user.role == 'admin'` for inventory and export features.
- Medical logs: Support filtering by status (open/closed).
- Inventory: Implement ABC categorization logic in the view or model (prefer view for now).
- Use Gummy UI (tactile cards, clear typography).
- Extend `templates/base.html`.

## TASK STEPS
1. `blueprints/admin.py` — Implement routes for panel, medical, inventory, and export.
   - `panel`: Overview of open medical logs, recent feedings, and low-stock inventory alerts.
   - `medical`: Table/list of medical logs with actions to close/update.
   - `inventory`: ABC-categorized list of supplies with thresholds.
   - `export`: Generate a CSV of all medical logs.
2. `templates/admin/admin_panel.html` — Build the mission control dashboard.
3. `templates/admin/medical.html` — Build the medical case tracker.
4. `templates/admin/inventory.html` — Build the supply management view.

## DEPENDENCIES
- none

## SHARED FILE TOUCHES
- `app.py` — add: `# TODO-MERGE: from blueprints.admin import admin_bp; app.register_blueprint(admin_bp)`

## DONE CONDITIONS
- [ ] Admin panel renders summary cards for medical and inventory.
- [ ] Medical log view allows seeing all cases.
- [ ] CSV export produces a downloadable file.
- [ ] No Python syntax errors.
- [ ] Role-based access is enforced (volunteers can't see inventory/export).

## STARTUP INSTRUCTIONS
Read this file fully. Read `models.py` to understand the field names for `MedicalLog` and `InventoryItem`.
Begin at Step 1. Log decisions in CHECKPOINT.md.
