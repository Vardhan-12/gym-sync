const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const { loginLimiter } = require("../middleware/rateLimitMiddleware");

const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getProfile,
  updateProfile
} = require("../controllers/userController");

const {
  registerValidator,
  loginValidator
} = require("../validators/userValidator");

router.post("/register", registerValidator, validate, registerUser);

router.post("/login", loginLimiter, loginValidator, validate, loginUser);

router.post("/refresh-token", refreshToken);

router.post("/logout", logoutUser);

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

module.exports = router;