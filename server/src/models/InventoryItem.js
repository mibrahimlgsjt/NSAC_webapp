const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ["A", "B", "C"], default: "C" },
    vedCategory: { type: String, enum: ["V", "E", "D"], default: "D" },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: "kg", trim: true },
    lowStockThreshold: { type: Number, default: 5 }
  },
  { timestamps: true }
);

inventoryItemSchema.virtual("isLowStock").get(function isLowStock() {
  return this.quantity <= this.lowStockThreshold;
});

inventoryItemSchema.set("toJSON", { virtuals: true });
inventoryItemSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
