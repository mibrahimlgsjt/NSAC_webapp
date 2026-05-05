const express = require("express");
const { createFeeding, listFeedings } = require("../controllers/feedingController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", listFeedings);
router.post("/", requireAuth, createFeeding);

module.exports = router;
