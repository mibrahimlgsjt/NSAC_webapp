---
phase: 02-mern-refactor
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [
  "server/src/controllers/animalController.js",
  "server/src/controllers/inventoryController.js",
  "client/src/pages/AdminInventory.jsx",
  "client/src/pages/AdminMedical.jsx"
]
autonomous: true
requirements: [MERN-01, MERN-02, MERN-03]
must_haves:
  truths:
    - "All 21 routes correctly fetch data from the Express backend"
    - "Inventory items trigger visual 'Low Stock' alerts when quantity <= threshold"
    - "Closing a medical case correctly updates the animal's health status to 'Healthy'"
    - "Emergency reports can be resolved and visually reflect that state"
  artifacts:
    - path: "server/.env.example"
      provides: "Environment configuration template"
    - path: "client/.env.example"
      provides: "Frontend API URL configuration"
  key_links:
    - from: "client/src/services/api.js"
      to: "server/src/app.js"
      via: "Axios requests"
---

<objective>
Verify and finalize the MERN refactor by ensuring full logic parity with the Flask prototype, verifying all 21 routes, and preparing for deployment.

Purpose: Transition from development to a production-ready MERN application.
Output: Verified 21-route system, parity logic (alerts/status), and final environment configurations.
</objective>

<execution_context>
@$HOME/.gemini/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/phases/02-mern-refactor/02-RESEARCH.md
@MERN_REFACTOR_PLAN.md
@server/src/app.js
@client/src/routes/AppRoutes.jsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Backend Logic Parity Audit & Fixes</name>
  <files>server/src/controllers/inventoryController.js, server/src/controllers/medicalController.js, server/src/controllers/emergencyController.js</files>
  <action>
    Review and verify the following business logic:
    1. Inventory: Ensure `quantity <= lowStockThreshold` logic is consistent across API responses (per D-02 in CONTEXT if applicable).
    2. Medical: Verify `closeMedicalLog` correctly sets `status: 'closed'` and updates `animal.healthStatus` to 'Healthy' only if no other open cases exist for that animal.
    3. Emergency: Verify `resolveEmergencyReport` correctly updates the `resolved` flag.
    4. Dashboard: Ensure `getSummary` counts reflect the correct logic for 'Fed Today' (last 24h or current calendar day parity with Flask).
  </action>
  <verify>
    <automated>npm --prefix server run check</automated>
  </verify>
  <done>Backend logic matches Flask prototype behavior exactly.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Full Route Verification (21 Routes)</name>
  <what-built>The 21 frontend routes and their corresponding API endpoints.</what-built>
  <how-to-verify>
    Start both server and client (npm run dev in both).
    Verify navigation and data loading for:
    1. Public: /, /animals, /animals/:id, /animals/species/:species, /animals/sector/:sector, /feed-status, /sightings, /sightings/new, /emergency, /volunteers.
    2. Auth: /login.
    3. Admin: /admin, /admin/animals, /admin/animals/new, /admin/animals/:id/edit, /admin/inventory, /admin/inventory/new, /admin/inventory/:id/edit, /admin/medical, /admin/reports, /admin/feedings.
  </how-to-verify>
  <resume-signal>approved</resume-signal>
</task>

<task type="auto">
  <name>Task 3: UI Polish & Environment Finalization</name>
  <files>client/src/styles/app.css, server/.env.example, client/.env.example</files>
  <action>
    1. Polish 'Low Stock' visual indicator in `AdminInventory.jsx` (ensure it uses Bootstrap 'table-warning' correctly).
    2. Finalize `.env.example` files with all necessary production keys (PORT, MONGO_URI, JWT_SECRET, CLIENT_URL, VITE_API_URL).
    3. Ensure all components use the standard 'Pawprint Studio' theme colors defined in `app.css`.
  </action>
  <verify>
    <automated>npm --prefix client run build</automated>
  </verify>
  <done>UI is visually consistent and environment templates are complete.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries
| Boundary | Description |
|----------|-------------|
| Client -> API | JWT token verification and role-based access control (AdminOnly) |

## STRIDE Threat Register
| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-02-01 | Tampering | /api/admin/* routes | mitigate | Protect all admin routes with `authMiddleware` and `roleMiddleware` (already implemented). |
| T-02-02 | Info Disclosure | JWT Payload | mitigate | Use environment variable for `JWT_SECRET`; do not store PII in token. |
</threat_model>

<success_criteria>
1. All 21 frontend routes load without 404s or uncaught errors.
2. The `npm run build` command passes for both client and server.
3. Admin functionality (inventory, medical, emergency) works with logic parity to Flask.
</success_criteria>

<output>
After completion, create `.planning/phases/02-mern-refactor/02-01-SUMMARY.md`
</output>
