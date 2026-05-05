const express = require("express");
const { createSighting, listSightings } = require("../controllers/sightingController");

const router = express.Router();

router.get("/", listSightings);
router.post("/", createSighting);

module.exports = router;
