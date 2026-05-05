const express = require("express");
const {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryItem,
  listInventory,
  updateInventoryItem
} = require("../controllers/inventoryController");
const requireAuth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", listInventory);
router.get("/:id", getInventoryItem);
router.post("/", requireAuth, requireRole("admin"), createInventoryItem);
router.put("/:id", requireAuth, requireRole("admin"), updateInventoryItem);
router.delete("/:id", requireAuth, requireRole("admin"), deleteInventoryItem);

module.exports = router;
