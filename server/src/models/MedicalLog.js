const mongoose = require("mongoose");

const medicalLogSchema = new mongoose.Schema(
  {
    animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal", required: true, index: true },
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["open", "closed"], default: "open", index: true },
    description: { type: String, required: true, trim: true },
    cost: { type: Number, default: 0 },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalLog", medicalLogSchema);
