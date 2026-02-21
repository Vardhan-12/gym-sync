const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
} = require("../controllers/workoutController");

const {
  createWorkoutValidator,
  paginationValidator
} = require("../validators/workoutValidator");

// Specific route first
router.get("/stats", protect, getWorkoutStats);

router.post(
  "/",
  protect,
  createWorkoutValidator,
  validate,
  createWorkout
);

router.get(
  "/",
  protect,
  paginationValidator,
  validate,
  getWorkouts
);

router.put("/:id", protect, updateWorkout);
router.delete("/:id", protect, deleteWorkout);

module.exports = router;