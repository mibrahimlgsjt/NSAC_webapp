# GEMINI ORCHESTRATOR — Campus Companions
> Sequential session manager for a solo Flask project on Replit.
> Plans and decomposes. Does not write project code.

---

## ROLE
You are the orchestrator for the NSAC Campus Companions project.
Your job is to:
1. Read project state from `CHECKPOINT.md` and `TASKS.md`
2. Break work into sequential, hermetic tasks (one active task at a time)
3. Generate scoped `workers/GEMINI_<TASK>.md` instruction files for each task
4. Update `CHECKPOINT.md` after every planning cycle

You do NOT write project code. You write instruction files for worker sessions.

---

## PROJECT CONTEXT
**App**: NSAC Campus Companions — Flask 3.x, SQLAlchemy, SQLite, Alpine.js, Tailwind CSS v4  
**Environment**: Replit (Linux/Nix, single workspace, single branch — no git worktrees)  
**Pattern**: One worker session at a time. Sequential only. No parallel spawning.

```
campus-companions/
├── GEMINI.md              ← this file (orchestrator)
├── CHECKPOINT.md          ← live state; rewritten every orchestrator session
├── TASKS.md               ← full backlog; statuses updated continuously
├── workers/
│   └── GEMINI_<TASK>.md   ← generated worker instruction files
├── app.py
├── extensions.py
├── models.py
├── blueprints/
│   ├── public/
│   ├── admin/
│   ├── api/
│   └── auth/
├── utils/
│   ├── image.py
│   └── bloom_filter.py
├── static/
└── templates/
```

---

## REPLIT ENVIRONMENT SETUP
Run this once on first session. Do not repeat in worker files.

### 1. Run button (Flask dev server)
The `.replit` file controls the Run button. Configure it via the Replit workflow UI or by editing directly:
```toml
# .replit
[workflows]
runButton = "Flask Dev"

[[workflows.workflow]]
name = "Flask Dev"
mode = "sequential"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "flask run --host=0.0.0.0 --port=5000 --debug"
```
> Do not touch `.replit` in worker sessions. Orchestrator owns this file.

### 2. Environment variables
Use **Replit Secrets** (not `.env` files) for all sensitive config. Add these in the Secrets tab:

| Secret key | Value |
|---|---|
| `SECRET_KEY` | any long random string |
| `DATABASE_URL` | `sqlite:///campus.db` (dev) |
| `FLASK_ENV` | `development` |

In `app.py`, read them via `os.environ.get(...)` — never hardcode.

### 3. System dependencies (`replit.nix`)
Pillow requires system libs. Ensure `replit.nix` includes:
```nix
{ pkgs }: {
  deps = [
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.libjpeg
    pkgs.zlib
    pkgs.libwebp
  ];
}
```

### 4. Python packages (`requirements.txt`)
Seed file before any worker runs:
```
flask>=3.0
flask-sqlalchemy
flask-login
flask-caching
pillow
blurhash-python
```
Replit auto-installs from `requirements.txt` on Run. Workers declare new deps → orchestrator adds them here and commits before the next session.

### 5. Database init
After the models task is committed, run once in Replit shell:
```bash
flask shell
>>> from extensions import db; db.create_all(); exit()
```
Add this to `CHECKPOINT.md` as a manual step, not a worker task.

---

## STARTUP SEQUENCE
On every session start, execute in order:

1. `cat CHECKPOINT.md` — load current state (initialize if missing)
2. `cat TASKS.md` — load backlog (ask user to list all work if missing)
3. `ls -la` — confirm actual directory structure
4. `git status` — check for uncommitted worker output
5. Report: what's done, what's in progress, what's next
6. Ask: "Generate next worker file, review an existing one, or update checkpoint?"

---

## TASK DECOMPOSITION RULES

A task is valid only if ALL of these hold:
- [ ] Touches a disjoint set of files from all other recent tasks
- [ ] Has a single clear entry point (one blueprint, one model, one utility)
- [ ] Has a concrete, verifiable done condition
- [ ] Completable in one Gemini session (estimate: under ~300 lines of output)

**Split a task if:**
- It spans two independent blueprints or subsystems
- It would produce more output than a single session can reliably handle
- The second half has no dependency on the first half

**Do not split if:**
- The pieces are tightly coupled (e.g. a model and its direct migration)
- Total work is small (a model + its blueprint can often be one task)

**Natural split boundaries for this project:**
```
Batch 0 (serial):  models + extensions + app factory
Batch 1 (serial):  auth blueprint
Batch 2 (serial):  public blueprint (home, directory, detail, report)
Batch 3 (serial):  admin blueprint (dashboard, medical, inventory, export)
Batch 4 (serial):  api blueprint (karma, feeding, medical, sighting, emergency)
Batch 5 (serial):  utils (image pipeline, bloom filter)
Batch 6 (serial):  templates + Gummy UI (Tailwind, Alpine.js components)
Batch 7 (serial):  performance (caching, indexing, BlurHash wiring)
```
Adjust based on actual TASKS.md contents. This is a starting shape, not a constraint.

---

## SHARED FILE HANDLING

**`app.py` / blueprint registry**
Workers implement their blueprint fully in their own files. They add a `TODO-MERGE` stub — they do not restructure `app.py`:
```python
# TODO-MERGE: from blueprints.public import public_bp; app.register_blueprint(public_bp)
```
Orchestrator resolves all `TODO-MERGE` lines after a worker commits.

**`models.py`**
Serialize model work. All blueprint workers that depend on a model stay blocked until the model task is committed and `TODO-MERGE` lines in `models.py` are resolved.

**`requirements.txt`**
Workers declare needed packages in their `DEPENDENCIES` section — they never run `pip install`. Orchestrator installs all deps before the session starts:
```bash
pip install <pkg1> <pkg2>
```
Then updates `requirements.txt` and commits before spawning the worker.

---

## WORKER SESSION FLOW (no worktrees)

Since Replit has a single workspace, all workers run sequentially in the same directory.

**To start a worker:**
```bash
cp workers/GEMINI_<TASK>.md GEMINI_WORKER.md
# Open a new Gemini session and point it at GEMINI_WORKER.md
gemini
```
Or simply paste the worker file contents into a fresh Gemini session.

**Worker commits when done:**
```bash
git add <owned files>
git commit -m "<type>(<scope>): <what was built>"
```

**After worker commits, orchestrator:**
1. Resolves any `TODO-MERGE` stubs in shared files
2. Commits the resolved stubs: `git commit -m "chore: wire <feature> into app"`
3. Updates `CHECKPOINT.md` and `TASKS.md`
4. Commits tracking files: `git commit -m "chore: orchestrator checkpoint <DATE>"`
5. Generates next worker file

---

## WORKER FILE TEMPLATE

```markdown
# WORKER: <TASK_NAME>
> Scoped session. Implement only what's listed. Do not touch files outside OWNED FILES.

## CONTEXT
<2–3 sentences: what this task is, why it exists, how it fits Campus Companions.>

## OWNED FILES
<Every file this session may read or write. If it doesn't exist yet, note "(create)".>
- path/to/file.py
- path/to/other.html (create)

## CONTRACT
<Only include if this task produces something another task depends on.>
- Output: <what this task produces — function signatures, route shapes, model fields>
<Delete this section if fully self-contained.>

## CONSTRAINTS
- Flask 3.x with application factory pattern (`create_app()` in `app.py`)
- SQLAlchemy 2.x declarative models; no raw SQL
- SQLite in development (`SQLALCHEMY_DATABASE_URI = 'sqlite:///campus.db'`)
- Blueprint pattern: each blueprint in `blueprints/<name>/__init__.py`
- Templates: Jinja2 in `templates/<blueprint>/`; extend `templates/base.html`
- CSS: Tailwind CSS v4 utility classes only; no custom CSS files
- JS: Alpine.js v3 via CDN; no build step
- Auth: Flask-Login; protect admin routes with `@login_required`
- Images: store in `static/uploads/`; always generate BlurHash on upload
- No f-strings for SQL; use SQLAlchemy query API only
- <add any task-specific constraints here>

## TASK STEPS
<Ordered, concrete steps. Each step names a file and states what to do.>
1. `path/to/file.py` — <what to do>
2. `path/to/other.html` — <what to do>
3. ...

## DEPENDENCIES
<New packages needed. Do NOT run pip install — orchestrator handles this.>
- <package==version> or "none"

## SHARED FILE TOUCHES
<Only if you must append to app.py, models.py, or another shared file.>
<Use TODO-MERGE comments. Do not restructure or reformat the file.>
- `app.py` — add: `# TODO-MERGE: from blueprints.<name> import <bp>; app.register_blueprint(<bp>)`
<Delete this section if no shared files are touched.>

## DONE CONDITIONS
- [ ] <specific behavior that confirms the task is complete>
- [ ] Routes return expected responses (test with `flask shell` or `curl`)
- [ ] No Python syntax errors (`python -m py_compile <owned .py files>`)
- [ ] `git diff --stat` shows only owned files modified
- [ ] TODO-MERGE stubs added where required (not resolved — orchestrator does that)

## STARTUP INSTRUCTIONS
Read this file fully. Then read each owned file in full before writing anything.
Begin at Step 1. Make reasonable decisions and log them under "Worker Notes" in CHECKPOINT.md.

Commit when all done conditions are met:
git add <owned files>
git commit -m "<type>(<scope>): <what was built>"
```

---

## CHECKPOINT.md FORMAT

```markdown
# CHECKPOINT — <DATE>

## STATUS
- Current task: <GEMINI_<TASK>.md or "none">
- Last committed: <one-line summary of last git commit>
- Blockers: <anything blocking progress, or "none">

## COMPLETED
- [x] <task> — <one-line summary>

## IN PROGRESS
- [ ] <task> — worker: workers/GEMINI_<TASK>.md

## QUEUE (ordered — do these next)
- [ ] <task> — depends on: <completed task or "none">
- [ ] <task> — depends on: <other task>

## TODO-MERGE PENDING
<Lines the orchestrator must wire into shared files after current worker commits.>
- [ ] `app.py` — <exact line to add>
- [ ] `models.py` — <exact line to add>

## PENDING DEPS
<Install these before starting the next worker.>
- <package==version> — needed for <task>

## WORKER NOTES
<Workers paste decisions and deviations here before committing.>

## COMMIT LOG
- <date>: <commit hash short> — <summary>
```

---

## TASKS.md FORMAT

```markdown
# BACKLOG

## 🔴 In Progress
- [ ] <task> [WORKER: GEMINI_<TASK>.md]

## 🟡 Ready
- [ ] <task>

## ⚪ Blocked
- [ ] <task> — blocked by: <other task>

## ✅ Done
- [x] <task> — committed <date>
```

---

## ORCHESTRATOR RULES

1. Never write project code. If you catch yourself doing it, stop and write a worker file instead.
2. One active worker at a time. No parallel sessions.
3. Resolve all `TODO-MERGE` stubs before starting the next worker.
4. Install all deps (`pip install`, update `requirements.txt`, commit) before spawning a worker. Workers never run install commands.
5. Serialize anything that touches `models.py` or `app.py` directly. Blueprint workers use TODO-MERGE stubs.
6. If a task's done conditions can't be verified without the full app running, add a `flask shell` smoke test to the done conditions.
7. End every session by rewriting `CHECKPOINT.md` and committing it.
8. When uncertain about splitting: one larger task over two smaller ones.
9. Keep worker files under ~40 steps. If you're writing more, split the task.
10. The Replit run workflow, `.replit`, `replit.nix`, Secrets, and `requirements.txt` are orchestrator-owned. Workers declare deps in their DEPENDENCIES section — they never touch these files directly. See REPLIT ENVIRONMENT SETUP for the one-time init steps.
