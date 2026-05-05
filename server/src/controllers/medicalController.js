const MedicalLog = require("../models/MedicalLog");
const Animal = require("../models/Animal");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

async function fallbackVolunteer() {
  return User.findOne({ role: "volunteer" }).sort({ createdAt: 1 });
}

const listMedicalLogs = asyncHandler(async (req, res) => {
  const logs = await MedicalLog.find()
    .populate("animal", "name species sector imageUrl healthStatus")
    .populate("volunteer", "username role")
    .sort({ status: -1, openedAt: -1 });

  res.json(logs);
});

const createMedicalLog = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.body.animal || req.body.animalId);
  if (!animal) {
    res.status(404);
    throw new Error("Animal not found");
  }

  const volunteer = req.user || (await fallbackVolunteer());
  if (!volunteer) {
    res.status(400);
    throw new Error("Seed at least one volunteer before adding medical cases");
  }

  const log = await MedicalLog.create({
    animal: animal._id,
    volunteer: volunteer._id,
    description: req.body.description,
    status: "open"
  });

  animal.healthStatus = "Injured";
  await animal.save();

  res.status(201).json(
    await log.populate([
      { path: "animal", select: "name species sector imageUrl healthStatus" },
      { path: "volunteer", select: "username role" }
    ])
  );
});

const closeMedicalLog = asyncHandler(async (req, res) => {
  const log = await MedicalLog.findById(req.params.id);
  if (!log) {
    res.status(404);
    throw new Error("Medical log not found");
  }

  log.status = "closed";
  log.closedAt = new Date();
  log.cost = Number(req.body.cost || log.cost || 0);
  await log.save();

  const openCases = await MedicalLog.countDocuments({ animal: log.animal, status: "open" });
  if (openCases === 0) {
    await Animal.findByIdAndUpdate(log.animal, { healthStatus: "Healthy" });
  }

  res.json(await log.populate("animal", "name species sector imageUrl healthStatus"));
});

module.exports = {
  listMedicalLogs,
  createMedicalLog,
  closeMedicalLog
};
