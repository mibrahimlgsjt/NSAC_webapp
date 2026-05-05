# EVAL-REVIEW-v2 — Phase 2: MERN Refactor Audit (Focus: Export & SOS)

**Audit Date:** 2025-05-15
**AI-SPEC Present:** No (Used MERN_REFACTOR_PLAN.md and README.md)
**Overall Score:** 72/100
**Verdict:** NEEDS WORK

## Dimension Coverage

| Dimension | Status | Measurement | Finding |
|-----------|--------|-------------|---------|
| CSV Export | **PARTIAL (BLOCKER)** | Code Audit | Backend controller contains `exportMedicalLogs` with correct CSV formatting. However, the route in `medicalRoutes.js` references the function without importing it, causing a `ReferenceError` in production. |
| SOS Links | **COVERED** | Code Audit | `EmergencyReport.jsx` includes "one-touch" links for Phone (`tel:`) and WhatsApp (`wa.me`) as requested in the project description. |
| SOS Visuals | **MISSING** | Code Audit | The pulsing `sos-ring` animation and specialized SOS button in the bottom navigation (present in Phase 1) are missing in the MERN refactor. The "Emergency" link is now a standard nav item. |
| Logic Parity | COVERED | Code Audit | Medical case transitions (Healthy/Injured) and inventory thresholds align with Flask prototype logic. |

**Coverage Score:** 2.5/4 (62.5%)

## Infrastructure Audit

| Component | Status | Finding |
|-----------|--------|---------|
| Eval tooling | Installed | Vite/Express stack. |
| Reference dataset | Present | `server/src/utils/seed.js` includes dummy medical logs for export testing. |
| CI/CD integration | Missing | No automated pipelines. |
| Online guardrails | Implemented | RBAC middleware protects admin export endpoints. |
| Tracing | Missing | No observability tools found. |

**Infrastructure Score:** 60/100

## Critical Gaps

- **BLOCKER**: `server/src/routes/medicalRoutes.js` is missing the import for `exportMedicalLogs`. The "Export CSV" feature is currently non-functional despite being "implemented" in the controller.
- **WARNING**: Loss of SOS pulsing animation reduces the "urgent" feel required by the original UI spec.

## Remediation Plan

### Must fix before production:
1.  **Fix CSV Route**: Update `server/src/routes/medicalRoutes.js` to include `exportMedicalLogs` in the destructuring require statement.
    ```javascript
    const { closeMedicalLog, createMedicalLog, listMedicalLogs, exportMedicalLogs } = require("../controllers/medicalController");
    ```

### Should fix soon:
1.  **SOS Animation**: Port the `sos-ring` keyframes and `.sos` class from `base.html` to `app.css` and apply it to the Emergency link/button.
2.  **Configurable SOS**: Move the hardcoded phone numbers in `EmergencyReport.jsx` to environment variables or a settings model.

### Nice to have:
1.  **Inventory Export**: Add CSV export for inventory items to match the medical reporting capability.

## Files Found
- `server/src/controllers/medicalController.js` (Logic for CSV)
- `server/src/routes/medicalRoutes.js` (Broken route)
- `client/src/pages/AdminMedical.jsx` (Export trigger)
- `client/src/pages/EmergencyReport.jsx` (SOS Links)
