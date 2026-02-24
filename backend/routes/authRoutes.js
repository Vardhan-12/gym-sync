const express = require("express");
const router = express.Router();

const { loginLimiter } = require("../middleware/rateLimitMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
} = require("../validators/userValidator");

// AUTH ROUTES
router.post("/register", registerValidator, validate, registerUser);

router.post("/login", loginLimiter, loginValidator, validate, loginUser);

router.post("/refresh-token", refreshToken);

router.post("/logout", logoutUser);

module.exports = router;