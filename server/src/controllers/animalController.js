const Animal = require("../models/Animal");
const FeedingLog = require("../models/FeedingLog");
const Sighting = require("../models/Sighting");
const MedicalLog = require("../models/MedicalLog");
const asyncHandler = require("../middleware/asyncHandler");

function normalizeAnimalPayload(body) {
  return {
    name: body.name,
    species: body.species || "Cat",
    sector: body.sector,
    healthStatus: body.healthStatus || body.health_status || "Healthy",
    mood: body.mood || "Friendly",
    imageUrl: body.imageUrl || body.image_url || "",
    blurhash: body.blurhash || "",
    likes: Number(body.likes || 0),
    personalityTags: Array.isArray(body.personalityTags)
      ? body.personalityTags
      : String(body.personalityTags || body.personality_tags || "Friendly,Sleepy")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
  };
}

const listAnimals = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.search) {
    query.name = new RegExp(req.query.search, "i");
  }
  if (req.query.healthStatus) {
    query.healthStatus = req.query.healthStatus;
  }

  const animals = await Animal.find(query).sort({ name: 1 });
  res.json(animals);
});

const trendingAnimals = asyncHandler(async (req, res) => {
  const animals = await Animal.find().sort({ likes: -1, updatedAt: -1 }).limit(10);
  res.json(animals);
});

const animalsBySector = asyncHandler(async (req, res) => {
  const animals = await Animal.find({ sector: req.params.sector }).sort({ name: 1 });
  res.json(animals);
});

const animalsBySpecies = asyncHandler(async (req, res) => {
  const animals = await Animal.find({ species: req.params.species }).sort({ name: 1 });
  res.json(animals);
});

const getAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  if (!animal) {
    res.status(404);
    throw new Error("Animal not found");
  }

  const [sightings, feedings, medicalLogs] = await Promise.all([
    Sighting.find({ animal: animal._id }).sort({ createdAt: -1 }).limit(8),
    FeedingLog.find({ animal: animal._id }).populate("volunteer", "username role").sort({ fedAt: -1 }).limit(8),
    MedicalLog.find({ animal: animal._id }).populate("volunteer", "username role").sort({ openedAt: -1 }).limit(8)
  ]);

  res.json({ animal, sightings, feedings, medicalLogs });
});

const createAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.create(normalizeAnimalPayload(req.body));
  res.status(201).json(animal);
});

const updateAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findByIdAndUpdate(
    req.params.id,
    normalizeAnimalPayload(req.body),
    { new: true, runValidators: true }
  );

  if (!animal) {
    res.status(404);
    throw new Error("Animal not found");
  }

  res.json(animal);
});

const deleteAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findByIdAndDelete(req.params.id);
  if (!animal) {
    res.status(404);
    throw new Error("Animal not found");
  }

  await Promise.all([
    Sighting.deleteMany({ animal: animal._id }),
    FeedingLog.deleteMany({ animal: animal._id }),
    MedicalLog.deleteMany({ animal: animal._id })
  ]);

  res.json({ message: "Animal deleted" });
});

const likeAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );

  if (!animal) {
    res.status(404);
    throw new Error("Animal not found");
  }

  res.json({ likes: animal.likes });
});

module.exports = {
  listAnimals,
  trendingAnimals,
  animalsBySector,
  animalsBySpecies,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  likeAnimal
};
