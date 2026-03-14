const asyncHandler = require("../utils/asyncHandler");
const workoutService = require("../services/workoutService");
const WorkoutSession = require("../models/WorkoutSession");

// Create workout
exports.createWorkoutSession = asyncHandler(async (req, res) => {

  const session = await workoutService.createWorkoutSession(
    req.body,
    req.user._id
  );

  res.status(201).json(session);

});

// Get workouts
exports.getWorkoutSessions = asyncHandler(async (req, res) => {

  const sessions = await workoutService.getWorkoutSessions(req.user._id);

  res.json(sessions);

});

// Delete workout
exports.deleteWorkoutSession = asyncHandler(async (req, res) => {

  const result = await workoutService.deleteWorkoutSession(
    req.params.id,
    req.user._id
  );

  res.json(result);

});


//Get Exercise Progress
exports.getExerciseProgress = asyncHandler(async (req, res) => {

  const { exercise } = req.params;

  const result = await Workout.aggregate([
    {
      $match: {
        createdBy: req.user._id,
        exercise: exercise
      }
    },
    {
      $sort: { createdAt: 1 }
    },
    {
      $project: {
        date: "$createdAt",
        weight: "$weight"
      }
    }
  ]);

  res.json(result);

});

//get latest workout
exports.getLatestWorkout = asyncHandler(async (req, res) => {

  const workout = await WorkoutSession.findOne({
    createdBy: req.user._id
  }).sort({ createdAt: -1 });

  res.json(workout);

});

exports.toggleLikeWorkout = asyncHandler(async (req, res) => {

  const likeCount = await workoutService.toggleLikeWorkout(
    req.params.id,
    req.user._id
  );

  res.json({
    message: "Like updated",
    likes: likeCount
  });

});


exports.addComment = asyncHandler(async (req, res) => {

  const comments = await workoutService.addComment(
    req.params.id,
    req.user._id,
    req.body.text
  );

  res.json({
    message: "Comment added",
    comments
  });

});

exports.updateWorkoutSession = asyncHandler(async (req, res) => {

  const updated = await workoutService.updateWorkoutSession(
    req.params.id,
    req.user._id,
    req.body
  );

  res.json(updated);

});