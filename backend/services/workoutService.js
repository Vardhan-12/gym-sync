const Workout = require("../models/Workout");
const AppError = require("../utils/AppError");

// Create workout
exports.createWorkout = async (data, userId) => {

  const { exercise, muscleGroup, sets, reps, weight } = data;

  if (!exercise || !muscleGroup) {
    throw new AppError("Exercise and muscle group required");
  }

  const workout = await Workout.create({
    exercise,
    muscleGroup,
    sets,
    reps,
    weight,
    createdBy: userId
  });

  return workout;
};

// Get workouts
exports.getWorkouts = async (userId) => {

  return await Workout.find({ createdBy: userId })
    .sort({ createdAt: -1 });

};

// Delete workout
exports.deleteWorkout = async (id, userId) => {

  const workout = await Workout.findById(id);

  if (!workout) {
    throw new AppError("Workout not found", 404);
  }

  if (workout.createdBy.toString() !== userId.toString()) {
    throw new AppError("Not authorized", 403);
  }

  await workout.deleteOne();

  return { message: "Workout deleted" };

};