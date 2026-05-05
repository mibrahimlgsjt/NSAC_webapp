const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "dev_secret_nsac",
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    username: user.username,
    role: user.role
  };
}

const register = asyncHandler(async (req, res) => {
  const { username, password, role = "volunteer" } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Username and password are required");
  }

  const existing = await User.findOne({ username });
  if (existing) {
    res.status(409);
    throw new Error("Username already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, passwordHash, role });

  res.status(201).json({
    token: signToken(user),
    user: publicUser(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401);
    throw new Error("Invalid username or password");
  }

  res.json({
    token: signToken(user),
    user: publicUser(user)
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = {
  register,
  login,
  me
};
