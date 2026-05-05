const express = require("express");
const {
  createEmergencyReport,
  listEmergencyReports,
  resolveEmergencyReport
} = require("../controllers/emergencyController");
const requireAuth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", listEmergencyReports);
router.post("/", createEmergencyReport);
router.put("/:id/resolve", requireAuth, requireRole("admin", "volunteer"), resolveEmergencyReport);

module.exports = router;
