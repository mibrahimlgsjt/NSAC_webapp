require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Animal = require("../models/Animal");
const EmergencyReport = require("../models/EmergencyReport");
const FeedingLog = require("../models/FeedingLog");
const InventoryItem = require("../models/InventoryItem");
const MedicalLog = require("../models/MedicalLog");
const Sighting = require("../models/Sighting");
const User = require("../models/User");

const animalSeeds = [
  ["Mochi", "Cat", "SEECS", "Healthy", "Friendly", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80", ["Friendly", "Sleepy", "Lap Cat"]],
  ["Noodle", "Cat", "C1", "Recovering", "Shy", "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80", ["Gentle", "Quiet", "Food Motivated"]],
  ["Bravo", "Dog", "NBS", "Healthy", "Playful", "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80", ["Protector", "Energetic", "Loyal"]],
  ["Pebbles", "Cat", "SADA", "Healthy", "Curious", "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80", ["Explorer", "Curious", "Chatty"]],
  ["Biscuit", "Dog", "SMME", "Injured", "Calm", "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80", ["Calm", "Patient", "Trusting"]],
  ["Shadow", "Cat", "Retro", "Healthy", "Independent", "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=900&q=80", ["Independent", "Night Patrol", "Smart"]],
  ["Luna", "Cat", "Margalla", "Healthy", "Affectionate", "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=900&q=80", ["Affectionate", "Tiny", "Brave"]],
  ["Sultan", "Dog", "C2", "Healthy", "Confident", "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80", ["Confident", "Gentle", "Guardian"]],
  ["Chai", "Cat", "Library", "Sick", "Low Energy", "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=80", ["Soft", "Quiet", "Needs Care"]],
  ["Maple", "Cat", "Concordia", "Healthy", "Social", "https://images.unsplash.com/photo-1501820488136-72669149e0d4?auto=format&fit=crop&w=900&q=80", ["Social", "Bold", "Snack Hunter"]],
  ["Rusty", "Dog", "NSTP", "Healthy", "Playful", "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80", ["Playful", "Fast", "Friendly"]],
  ["Nova", "Cat", "SEECS", "Healthy", "Watchful", "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=900&q=80", ["Watchful", "Elegant", "Patient"]]
];

const inventorySeeds = [
  ["Dry food", "A", "V", 22, "kg", 8],
  ["Wet food pouches", "A", "E", 36, "packs", 12],
  ["Antiseptic spray", "A", "V", 3, "bottles", 5],
  ["Bandage rolls", "B", "E", 18, "rolls", 6],
  ["Deworming tablets", "A", "V", 9, "strips", 8],
  ["Feeding bowls", "C", "D", 14, "pcs", 5],
  ["Disposable gloves", "B", "E", 48, "pairs", 20],
  ["Oral syringes", "B", "E", 11, "pcs", 6],
  ["Pet carrier liners", "C", "D", 7, "pcs", 5],
  ["Recovery blankets", "C", "D", 4, "pcs", 5]
];

async function clearDatabase() {
  await Promise.all([
    Animal.deleteMany({}),
    EmergencyReport.deleteMany({}),
    FeedingLog.deleteMany({}),
    InventoryItem.deleteMany({}),
    MedicalLog.deleteMany({}),
    Sighting.deleteMany({}),
    User.deleteMany({})
  ]);
}

async function seedDatabase() {
  await clearDatabase();

  const passwordHash = await bcrypt.hash("NSAC2026", 10);
  const [admin, volunteerA, volunteerB] = await User.create([
    { username: "admin", passwordHash, role: "admin" },
    { username: "zara", passwordHash, role: "volunteer" },
    { username: "hamza", passwordHash, role: "volunteer" }
  ]);

  const animals = await Animal.create(
    animalSeeds.map(([name, species, sector, healthStatus, mood, imageUrl, personalityTags], index) => ({
      name,
      species,
      sector,
      healthStatus,
      mood,
      imageUrl,
      personalityTags,
      likes: 12 - index,
      lastFedAt: new Date(Date.now() - (index + 2) * 60 * 60 * 1000)
    }))
  );

  await InventoryItem.create(
    inventorySeeds.map(([name, category, vedCategory, quantity, unit, lowStockThreshold]) => ({
      name,
      category,
      vedCategory,
      quantity,
      unit,
      lowStockThreshold
    }))
  );

  await Sighting.create(
    animals.slice(0, 10).map((animal, index) => ({
      animal: animal._id,
      reporter: index % 2 === 0 ? volunteerA._id : volunteerB._id,
      reporterName: index % 2 === 0 ? "Zara" : "Hamza",
      imageUrl: animal.imageUrl,
      locationHint: `${animal.sector} courtyard`,
      notes: `${animal.name} was seen near the regular feeding spot.`
    }))
  );

  await FeedingLog.create(
    animals.map((animal, index) => ({
      animal: animal._id,
      volunteer: index % 2 === 0 ? volunteerA._id : volunteerB._id,
      fedAt: new Date(Date.now() - (index + 1) * 90 * 60 * 1000),
      notes: index % 3 === 0 ? "Ate well and stayed nearby." : "Food and water refreshed."
    }))
  );

  await MedicalLog.create([
    {
      animal: animals[1]._id,
      volunteer: volunteerA._id,
      status: "open",
      description: "Mild limp observed near C1 stairs."
    },
    {
      animal: animals[4]._id,
      volunteer: volunteerB._id,
      status: "open",
      description: "Surface wound cleaned; monitor daily."
    },
    {
      animal: animals[8]._id,
      volunteer: admin._id,
      status: "open",
      description: "Low appetite reported by students."
    },
    {
      animal: animals[2]._id,
      volunteer: volunteerA._id,
      status: "closed",
      description: "Vaccination follow-up completed.",
      cost: 1500,
      closedAt: new Date()
    }
  ]);

  await EmergencyReport.create([
    {
      animal: animals[4]._id,
      reporterName: "Ayesha",
      location: "SMME parking",
      severity: "urgent",
      description: "Dog is limping and avoiding food."
    },
    {
      animal: animals[8]._id,
      reporterName: "Bilal",
      location: "Library entrance",
      severity: "sickness",
      description: "Cat looks lethargic and has not moved much."
    },
    {
      reporterName: "Anonymous Student",
      location: "SEECS gate",
      severity: "other",
      description: "New kitten spotted under a bench."
    }
  ]);

  console.log("Database seeded successfully");
  console.log("Login: admin / NSAC2026");
}

async function runSeed() {
  await connectDB();
  await seedDatabase();
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = {
  seedDatabase
};
