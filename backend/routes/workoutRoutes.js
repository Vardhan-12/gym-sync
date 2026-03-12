const express = require("express");
const router = express.Router();

const workoutController = require("../controllers/workoutController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, workoutController.createWorkout);

router.get("/", protect, workoutController.getWorkouts);

router.delete("/:id", protect, workoutController.deleteWorkout);

router.get(
  "/progress/:exercise",
  protect,
  workoutController.getExerciseProgress
);

router.get(
  "/latest",
  protect,
  workoutController.getLatestWorkout
);

module.exports = router;