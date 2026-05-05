# MERN Refactor Plan

## Objective

Convert the NSAC Campus Companions prototype into a MERN-stack submission that can compile and demonstrate the project requirements:

- React frontend
- Express backend
- MongoDB Atlas database
- Mongoose models
- Bootstrap responsive layout
- MVC-style backend organization
- 20+ dynamic frontend routes
- Backend-driven content through API calls

The Flask app remains in place as the legacy reference implementation. The MERN implementation lives beside it in `client/` and `server/`.

## Two-Day Build Strategy

### Day 1: MERN Foundation

1. Create `server/` Express app.
2. Convert SQLAlchemy entities into Mongoose models:
   - `User`
   - `Animal`
   - `Sighting`
   - `FeedingLog`
   - `MedicalLog`
   - `EmergencyReport`
   - `InventoryItem`
3. Add MVC backend files:
   - models
   - controllers
   - routes
   - middleware
   - database config
4. Add MongoDB Atlas configuration through `.env`.
5. Add seed data for animals, sightings, feedings, medical cases, inventory, emergency reports, and users.
6. Create `client/` React app with Vite, React Router, Axios, and Bootstrap.
7. Add shared frontend infrastructure:
   - API service
   - auth context
   - protected routes
   - reusable cards, forms, loading, error states

Compile gate:

```bash
npm --prefix server run check
npm --prefix client run build
```

### Day 2: Page Completion And Polish

1. Implement 20+ React routes:
   - `/`
   - `/animals`
   - `/animals/:id`
   - `/animals/species/:species`
   - `/animals/sector/:sector`
   - `/feed-status`
   - `/sightings`
   - `/sightings/new`
   - `/emergency`
   - `/volunteers`
   - `/login`
   - `/admin`
   - `/admin/animals`
   - `/admin/animals/new`
   - `/admin/animals/:id/edit`
   - `/admin/inventory`
   - `/admin/inventory/new`
   - `/admin/inventory/:id/edit`
   - `/admin/medical`
   - `/admin/reports`
   - `/admin/feedings`
2. Make every page fetch backend data through Axios.
3. Add Bootstrap-based responsive layouts.
4. Verify protected admin routes with seeded login:
   - username: `admin`
   - password: `NSAC2026`
5. Prepare deployment environment files:
   - `server/.env.example`
   - `client/.env.example`

Final compile gate:

```bash
npm run build
```

## Runbook

Install dependencies:

```bash
npm run install:all
```

Create backend environment:

```bash
copy server\.env.example server\.env
```

Update `server/.env` with a real MongoDB Atlas URI.

Seed MongoDB:

```bash
npm --prefix server run seed
```

Start backend:

```bash
npm --prefix server run dev
```

Start frontend:

```bash
npm --prefix client run dev
```

Build check:

```bash
npm run build
```

## Remaining Submission Tasks

- Add screenshots of all main pages to the report.
- Deploy React on Vercel or Netlify.
- Deploy Express API on Render or Railway.
- Use MongoDB Atlas in production.
- Add deployed frontend and backend URLs to the final report.
