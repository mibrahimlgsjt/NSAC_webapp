# EVAL-REVIEW — Phase 2: MERN Refactor (Re-audit v3)

**Audit Date:** 2025-05-16
**AI-SPEC Present:** No (Used MERN_REFACTOR_PLAN.md and .planning/phases/02-mern-refactor/02-PLAN.md)
**Overall Score:** 65/100
**Verdict:** NEEDS WORK

## Dimension Coverage

| Dimension | Status | Measurement | Finding |
|-----------|--------|-------------|---------|
| CSV Export | **PARTIAL (BLOCKER)** | Code Audit | ReferenceError in `medicalRoutes.js` is fixed. The export logic in `medicalController.js` is functional. However, the route `/api/medical/export` is **unsecured** (public GET), exposing sensitive medical logs without authentication. |
| SOS Links | **COVERED** | Code Audit | `EmergencyReport.jsx` successfully implements one-touch `tel:` and `wa.me:` links for rapid response. |
| SOS Visuals | **MISSING** | Code Audit | The pulsing `sos-ring` animation and specialized SOS button styling in the navigation (a key requirement from Phase 1) are still missing in the MERN implementation. |
| Logic Parity | **COVERED** | Code Audit | Business logic for inventory low-stock (virtual property) and medical status transitions (Healthy/Injured) correctly matches the Flask prototype. |
| Route Health | **COVERED** | Manual Check | All 21 frontend routes are defined in `AppRoutes.jsx` and properly mapped to backend controllers. |
| Env Config | **COVERED** | File Audit | Both `server/.env.example` and `client/.env.example` are present and contain the required production keys. |

**Coverage Score:** 4.5/6 (75%)

## Infrastructure Audit

| Component | Status | Finding |
|-----------|--------|---------|
| Eval tooling (Vite/Express) | Installed | Standard MERN stack setup. |
| Reference dataset | Present | `server/src/utils/seed.js` provided for testing. |
| CI/CD integration | Missing | No automated testing or deployment pipelines found. |
| Online guardrails | **PARTIAL** | RBAC is implemented for mutations (POST/PUT/DELETE) but missing for the sensitive data export endpoint. |
| Tracing | Missing | No observability or logging infrastructure (e.g. LangSmith, Winston, or Sentry) found. |

**Infrastructure Score:** 50/100

## Critical Gaps

- **BLOCKER**: **Data Exposure**. The `/api/medical/export` route lacks `requireAuth` and `requireRole` middleware. Anyone with the URL can download the full database of animal medical cases.
- **WARNING**: **Visual Regression**. The "Emergency" link in the floating navigation lacks the urgent pulsing animation required by the Pawprint Studio design spec, reducing its effectiveness as an SOS feature.

## Remediation Plan

### Must fix before production:
1.  **Secure Export Route**: 
    - Update `server/src/routes/medicalRoutes.js` to protect the export endpoint:
      ```javascript
      router.get("/export", requireAuth, requireRole("admin"), exportMedicalLogs);
      ```
    - Refactor `AdminMedical.jsx` to fetch CSV data via axios with headers instead of using `window.open`, ensuring the JWT token is sent.

### Should fix soon:
1.  **Restore SOS Animation**: 
    - Port the `.sos-ring` keyframes from the original Flask implementation to `client/src/styles/app.css`.
    - Apply the animation class to the SOS link in `client/src/components/Navbar.jsx`.
2.  **Input Validation**: Ensure the `cost` field in `closeMedicalLog` is validated on the backend to prevent negative values.

### Nice to have:
1.  **Unified Export**: Extend the export capability to Inventory and Feeding logs for full administrative parity.

## Files Found
- `server/src/routes/medicalRoutes.js` (Fixed import)
- `server/src/controllers/medicalController.js` (Export logic)
- `client/src/pages/EmergencyReport.jsx` (One-touch links)
- `client/src/pages/AdminInventory.jsx` (Low stock visuals)
- `server/src/models/InventoryItem.js` (Virtual properties)
