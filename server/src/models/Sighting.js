const mongoose = require("mongoose");

const sightingSchema = new mongoose.Schema(
  {
    animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal", required: true, index: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reporterName: { type: String, default: "Anonymous Student", trim: true },
    imageUrl: { type: String, default: "" },
    blurhash: { type: String, default: "" },
    locationHint: { type: String, required: true, trim: true },
    notes: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

sightingSchema.index({ animal: 1, createdAt: -1 });

module.exports = mongoose.model("Sighting", sightingSchema);
