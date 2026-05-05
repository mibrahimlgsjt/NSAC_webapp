const Animal = require("../models/Animal");
const EmergencyReport = require("../models/EmergencyReport");
const FeedingLog = require("../models/FeedingLog");
const InventoryItem = require("../models/InventoryItem");
const MedicalLog = require("../models/MedicalLog");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

const getSummary = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [animals, openCases, fedToday, lowStock, reports, volunteers] = await Promise.all([
    Animal.countDocuments(),
    MedicalLog.countDocuments({ status: "open" }),
    FeedingLog.countDocuments({ fedAt: { $gte: startOfDay } }),
    InventoryItem.countDocuments({ $expr: { $lte: ["$quantity", "$lowStockThreshold"] } }),
    EmergencyReport.countDocuments({ resolved: false }),
    User.countDocuments({ role: "volunteer" })
  ]);

  res.json({ animals, openCases, fedToday, lowStock, reports, volunteers });
});

const getFeedStatus = asyncHandler(async (req, res) => {
  const sectors = await Animal.distinct("sector");
  const results = await Promise.all(
    sectors.map(async (sector) => {
      const animals = await Animal.find({ sector }).sort({ lastFedAt: 1 });
      const lastFedAt = animals
        .map((animal) => animal.lastFedAt)
        .filter(Boolean)
        .sort((a, b) => b - a)[0];
      const hoursSinceFed = lastFedAt ? Math.round((Date.now() - lastFedAt.getTime()) / 3600000) : null;

      return {
        sector,
        animalCount: animals.length,
        lastFedAt,
        hoursSinceFed,
        status: hoursSinceFed === null ? "unknown" : hoursSinceFed <= 8 ? "fed" : hoursSinceFed <= 18 ? "watch" : "hungry"
      };
    })
  );

  res.json(results.sort((a, b) => a.sector.localeCompare(b.sector)));
});

const getVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await User.find().select("username role createdAt").sort({ username: 1 });
  const withStats = await Promise.all(
    volunteers.map(async (volunteer) => {
      const [feedings, medicalCases] = await Promise.all([
        FeedingLog.countDocuments({ volunteer: volunteer._id }),
        MedicalLog.countDocuments({ volunteer: volunteer._id })
      ]);

      return {
        id: volunteer._id,
        username: volunteer.username,
        role: volunteer.role,
        createdAt: volunteer.createdAt,
        feedings,
        medicalCases
      };
    })
  );

  res.json(withStats);
});

module.exports = {
  getSummary,
  getFeedStatus,
  getVolunteers
};
