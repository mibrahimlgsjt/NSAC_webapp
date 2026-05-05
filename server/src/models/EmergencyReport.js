const mongoose = require("mongoose");

const emergencyReportSchema = new mongoose.Schema(
  {
    animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal" },
    reporterName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: ["minor_injury", "sickness", "urgent", "other"],
      default: "other"
    },
    description: { type: String, default: "", trim: true },
    resolved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmergencyReport", emergencyReportSchema);
