const FeedingLog = require("../models/FeedingLog");
const Animal = require("../models/Animal");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

async function resolveVolunteer(req) {
  if (req.user) return req.user;

  const volunteer = await User.findOne({ role: "volunteer" }).sort({ createdAt: 1 });
  if (!volunteer) {
    const error = new Error("Seed at least one volunteer before logging feedings");
    error.statusCode = 400;
    throw error;
  }

  return volunteer;
}

const listFeedings = asyncHandler(async (req, res) => {
  const feedings = await FeedingLog.find()
    .populate("animal", "name species sector imageUrl")
    .populate("volunteer", "username role")
    .sort({ fedAt: -1 });

  res.json(feedings);
});

const createFeeding = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.body.animal || req.body.animalId);
  if (!animal) {
    res.status(404);
    throw new Error("Animal not found");
  }

  const volunteer = await resolveVolunteer(req);
  const fedAt = req.body.fedAt ? new Date(req.body.fedAt) : new Date();
  const feeding = await FeedingLog.create({
    animal: animal._id,
    volunteer: volunteer._id,
    fedAt,
    notes: req.body.notes || ""
  });

  animal.lastFedAt = fedAt;
  await animal.save();

  res.status(201).json(
    await feeding.populate([
      { path: "animal", select: "name species sector imageUrl" },
      { path: "volunteer", select: "username role" }
    ])
  );
});

module.exports = {
  listFeedings,
  createFeeding
};
