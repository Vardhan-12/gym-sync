const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const { workoutValidator } = require("../validators/workoutValidator");

const {
  createWorkout,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
} = require("../controllers/workoutController");

// CREATE WORKOUT
router.post(
  "/",
  protect,
  workoutValidator,
  validate,
  createWorkout
);

// GET WORKOUTS (paginated)
router.get("/", protect, getWorkouts);

// DELETE WORKOUT
router.delete("/:id", protect, deleteWorkout);

// UPDATE WORKOUT (optional if exists)
router.put("/:id", protect, updateWorkout);

module.exports = router;