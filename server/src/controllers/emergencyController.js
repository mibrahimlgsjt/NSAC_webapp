const EmergencyReport = require("../models/EmergencyReport");
const asyncHandler = require("../middleware/asyncHandler");

const listEmergencyReports = asyncHandler(async (req, res) => {
  const reports = await EmergencyReport.find()
    .populate("animal", "name species sector imageUrl")
    .sort({ createdAt: -1 });

  res.json(reports);
});

const createEmergencyReport = asyncHandler(async (req, res) => {
  const report = await EmergencyReport.create({
    animal: req.body.animal || req.body.animalId || undefined,
    reporterName: req.body.reporterName || req.body.reporter_name || "Anonymous Student",
    location: req.body.location,
    severity: req.body.severity || "other",
    description: req.body.description || ""
  });

  res.status(201).json(await report.populate("animal", "name species sector imageUrl"));
});

const resolveEmergencyReport = asyncHandler(async (req, res) => {
  const report = await EmergencyReport.findByIdAndUpdate(
    req.params.id,
    { resolved: true },
    { new: true }
  ).populate("animal", "name species sector imageUrl");

  if (!report) {
    res.status(404);
    throw new Error("Emergency report not found");
  }

  res.json(report);
});

module.exports = {
  listEmergencyReports,
  createEmergencyReport,
  resolveEmergencyReport
};
