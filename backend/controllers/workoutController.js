const Workout = require("../models/Workout");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// Create Workout
exports.createWorkout = asyncHandler(async (req, res) => {
  const { exercise, sets, reps, weight } = req.body;

  const workout = await Workout.create({
    user: req.user._id,
    exercise,
    sets,
    reps,
    weight,
  });

  res.status(201).json(workout);
});

// Get Workouts (Pagination + Sorting)
exports.getWorkouts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const sortField = req.query.sort || "createdAt";

  const skip = (page - 1) * limit;

  const total = await Workout.countDocuments({ user: req.user._id });

  const workouts = await Workout.find({ user: req.user._id })
    .sort({ [sortField]: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    total,
    page,
    pages: Math.ceil(total / limit),
    results: workouts.length,
    workouts,
  });
});

// Update Workout
exports.updateWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid workout ID");
  }

  const workout = await Workout.findById(id);

  if (!workout) {
    res.status(404);
    throw new Error("Workout not found");
  }

  if (workout.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedWorkout = await Workout.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedWorkout);
});

// Delete Workout
exports.deleteWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid workout ID");
  }

  const workout = await Workout.findById(id);

  if (!workout) {
    res.status(404);
    throw new Error("Workout not found");
  }

  if (workout.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await workout.deleteOne();

  res.status(200).json({ message: "Workout deleted successfully" });
});

// Workout Stats
exports.getWorkoutStats = asyncHandler(async (req, res) => {
  const stats = await Workout.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: null,
        totalWorkouts: { $sum: 1 },
        totalSets: { $sum: "$sets" },
        totalReps: { $sum: "$reps" },
        totalWeightLifted: {
          $sum: { $multiply: ["$sets", "$reps", "$weight"] },
        },
        averageWeight: { $avg: "$weight" },
      },
    },
  ]);

  if (stats.length === 0) {
    return res.status(200).json({
      totalWorkouts: 0,
      totalSets: 0,
      totalReps: 0,
      totalWeightLifted: 0,
      averageWeight: 0,
    });
  }

  const {
    totalWorkouts,
    totalSets,
    totalReps,
    totalWeightLifted,
    averageWeight,
  } = stats[0];

  res.status(200).json({
    totalWorkouts,
    totalSets,
    totalReps,
    totalWeightLifted,
    averageWeight,
  });
});