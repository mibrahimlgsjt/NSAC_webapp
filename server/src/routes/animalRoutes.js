const express = require("express");
const {
  animalsBySector,
  animalsBySpecies,
  createAnimal,
  deleteAnimal,
  getAnimal,
  likeAnimal,
  listAnimals,
  trendingAnimals,
  updateAnimal
} = require("../controllers/animalController");
const requireAuth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", listAnimals);
router.get("/trending", trendingAnimals);
router.get("/sector/:sector", animalsBySector);
router.get("/species/:species", animalsBySpecies);
router.post("/", requireAuth, requireRole("admin", "volunteer"), createAnimal);
router.get("/:id", getAnimal);
router.put("/:id", requireAuth, requireRole("admin", "volunteer"), updateAnimal);
router.delete("/:id", requireAuth, requireRole("admin"), deleteAnimal);
router.post("/:id/like", likeAnimal);

module.exports = router;
