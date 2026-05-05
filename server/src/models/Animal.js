const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, required: true, default: "Cat", trim: true },
    sector: { type: String, required: true, index: true, trim: true },
    healthStatus: {
      type: String,
      enum: ["Healthy", "Sick", "Injured", "Recovering"],
      default: "Healthy"
    },
    mood: { type: String, default: "Friendly", trim: true },
    imageUrl: { type: String, default: "" },
    blurhash: { type: String, default: "" },
    likes: { type: Number, default: 0, min: 0 },
    personalityTags: [{ type: String, trim: true }],
    lastFedAt: { type: Date }
  },
  { timestamps: true }
);

animalSchema.index({ sector: 1, lastFedAt: -1 });

animalSchema.virtual("hungerScore").get(function hungerScore() {
  if (!this.lastFedAt) return 0;
  const hours = (Date.now() - this.lastFedAt.getTime()) / 3600000;
  return Math.max(0, Math.round(100 - hours * 4));
});

animalSchema.set("toJSON", { virtuals: true });
animalSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Animal", animalSchema);
