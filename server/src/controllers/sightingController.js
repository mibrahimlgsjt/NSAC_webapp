const Sighting = require("../models/Sighting");
const Animal = require("../models/Animal");
const asyncHandler = require("../middleware/asyncHandler");

const listSightings = asyncHandler(async (req, res) => {
  const sightings = await Sighting.find()
    .populate("animal", "name species sector imageUrl")
    .populate("reporter", "username role")
    .sort({ createdAt: -1 });

  res.json(sightings);
});

const createSighting = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.body.animal || req.body.animalId);
  if (!animal) {
    res.status(404);
    throw new Error("Animal not found");
  }

  const sighting = await Sighting.create({
    animal: animal._id,
    reporter: req.user?._id,
    reporterName: req.body.reporterName || req.body.reporter_name || "Anonymous Student",
    imageUrl: req.body.imageUrl || "",
    blurhash: req.body.blurhash || "",
    locationHint: req.body.locationHint || req.body.location || "",
    notes: req.body.notes || ""
  });

  res.status(201).json(await sighting.populate("animal", "name species sector imageUrl"));
});

module.exports = {
  listSightings,
  createSighting
};
