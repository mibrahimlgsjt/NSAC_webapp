const express = require("express");
const { closeMedicalLog, createMedicalLog, listMedicalLogs, exportMedicalLogs } = require("../controllers/medicalController");
const requireAuth = require("../middleware/authMiddleware");

const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", listMedicalLogs);
router.get("/export", requireAuth, requireRole("admin"), exportMedicalLogs);
router.post("/", requireAuth, createMedicalLog);
router.put("/:id/close", requireAuth, closeMedicalLog);

module.exports = router;
