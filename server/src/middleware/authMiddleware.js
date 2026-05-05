const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    const error = new Error("Authentication token is required");
    error.statusCode = 401;
    throw error;
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_nsac");
  const user = await User.findById(payload.id).select("-passwordHash");

  if (!user) {
    const error = new Error("User no longer exists");
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});

module.exports = requireAuth;
