const express = require("express");
const { getFeedStatus, getSummary, getVolunteers } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/summary", getSummary);
router.get("/feed-status", getFeedStatus);
router.get("/volunteers", getVolunteers);

module.exports = router;
