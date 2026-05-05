const InventoryItem = require("../models/InventoryItem");
const asyncHandler = require("../middleware/asyncHandler");

function payload(body) {
  return {
    name: body.name,
    category: body.category || "C",
    vedCategory: body.vedCategory || body.ved_category || "D",
    quantity: Number(body.quantity || 0),
    unit: body.unit || "kg",
    lowStockThreshold: Number(body.lowStockThreshold || body.low_stock_threshold || body.threshold || 5)
  };
}

const listInventory = asyncHandler(async (req, res) => {
  const items = await InventoryItem.find().sort({ category: 1, name: 1 });
  res.json(items);
});

const getInventoryItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Inventory item not found");
  }

  res.json(item);
});

const createInventoryItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.create(payload(req.body));
  res.status(201).json(item);
});

const updateInventoryItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.findByIdAndUpdate(
    req.params.id,
    payload(req.body),
    { new: true, runValidators: true }
  );

  if (!item) {
    res.status(404);
    throw new Error("Inventory item not found");
  }

  res.json(item);
});

const deleteInventoryItem = asyncHandler(async (req, res) => {
  const item = await InventoryItem.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Inventory item not found");
  }

  res.json({ message: "Inventory item deleted" });
});

module.exports = {
  listInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
};
