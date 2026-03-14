const express = require("express");
const router = express.Router();

const workoutController = require("../controllers/workoutController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, workoutController.createWorkoutSession);

router.get("/", protect, workoutController.getWorkoutSessions);

router.delete("/:id", protect, workoutController.deleteWorkoutSession);

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

router.post(
  "/:id/like",
  protect,
  workoutController.toggleLikeWorkout
);

router.post(
  "/:id/comment",
  protect,
  workoutController.addComment
);

router.put(
  "/:id",
  protect,
  workoutController.updateWorkoutSession
);

module.exports = router;