# WORKER: AUTH_BP
> Scoped session. Implement only what's listed. Do not touch files outside OWNED FILES.

## CONTEXT
Implement the authentication system for Campus Companions. This allows volunteers and admins to log in and access protected dashboard features.

## OWNED FILES
- blueprints/auth.py
- templates/auth/login.html

## CONTRACT
- Routes: `/login` (GET/POST), `/logout` (GET)
- Design: Gummy UI (Glassmorphism, soft tactile elements)

## CONSTRAINTS
- Use Flask-Login for session management.
- Use `check_password_hash` for credential validation.
- Redirect to `admin.panel` on successful login (even if not built yet).
- Login page must use Tailwind CSS v4 and Alpine.js for basic reactivity (e.g., show/hide password).
- Extend `templates/base.html`.

## TASK STEPS
1. `blueprints/auth.py` — Create the blueprint and implement `login` and `logout` routes.
   - `login`: Fetch user by username, verify password hash, use `login_user`.
   - `logout`: Use `logout_user` and redirect to home.
2. `templates/auth/login.html` — Build the login form with Gummy UI aesthetics.
   - Add "Glass Card" styling: `bg-white/10 backdrop-blur-md border border-white/20`.
   - Use soft rounded corners and "Gummy" buttons.
   - Use Alpine.js to handle simple state like "Remember Me" toggle or password visibility.

## DEPENDENCIES
- none

## SHARED FILE TOUCHES
- `app.py` — add: `# TODO-MERGE: from blueprints.auth import auth_bp; app.register_blueprint(auth_bp)`

## DONE CONDITIONS
- [ ] `/login` route renders the login form.
- [ ] Successful login redirects to `/admin/panel` (can be a 404 for now).
- [ ] Logout works and redirects to `/`.
- [ ] No Python syntax errors.
- [ ] UI matches "Gummy UI" description in design2.md.

## STARTUP INSTRUCTIONS
Read this file fully. Read `models.py` to understand the `User` fields.
Begin at Step 1. Log decisions in CHECKPOINT.md.

Commit when all done conditions are met.
