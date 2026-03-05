const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  getAllUsers,
  deleteUser,
  getAllSessions
} = require("../controllers/adminController");

router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/sessions", getAllSessions);

module.exports = router;