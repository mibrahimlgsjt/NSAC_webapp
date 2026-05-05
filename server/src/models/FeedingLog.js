const mongoose = require("mongoose");

const feedingLogSchema = new mongoose.Schema(
  {
    animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal", required: true, index: true },
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fedAt: { type: Date, default: Date.now, index: true },
    notes: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

feedingLogSchema.index({ animal: 1, fedAt: -1 });

module.exports = mongoose.model("FeedingLog", feedingLogSchema);
