const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const animalRoutes = require("./routes/animalRoutes");
const sightingRoutes = require("./routes/sightingRoutes");
const feedingRoutes = require("./routes/feedingRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "nsac-campus-companions-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/sightings", sightingRoutes);
app.use("/api/feedings", feedingRoutes);
app.use("/api/medical", medicalRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorMiddleware);

module.exports = app;
