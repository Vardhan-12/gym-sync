const asyncHandler = require("../utils/asyncHandler");
const Workout = require("../models/Workout");

// Create workout
exports.createWorkout = asyncHandler(async (req, res) => {

  const workout = await workoutService.createWorkout(
    req.body,
    req.user._id
  );

  res.status(201).json(workout);

});

// Get workouts
exports.getWorkouts = asyncHandler(async (req, res) => {

  const workouts = await workoutService.getWorkouts(req.user._id);

  res.json(workouts);

});

// Delete workout
exports.deleteWorkout = asyncHandler(async (req, res) => {

  const result = await workoutService.deleteWorkout(
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

  const workout = await Workout.findOne({
    createdBy: req.user._id
  }).sort({ createdAt: -1 });

  res.json(workout);

});