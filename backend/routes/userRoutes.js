const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getUsersFromSessions,
  getProfile,
  updateProfile,
} = require("../controllers/userController");

// 🔹 Get users from sessions
router.get("/from-sessions", protect, getUsersFromSessions);

// 🔹 Profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;