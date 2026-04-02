require("dotenv").config();

const mongoose = require("mongoose");
const WorkoutSession = require("./models/WorkoutSession");
const calculateWorkoutVolume = require("./utils/calculateWorkoutVolume");

// connect to DB (same as your db.js)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

async function fixVolume() {
  const workouts = await WorkoutSession.find();

  for (const workout of workouts) {
    if (!workout.totalVolume) {
      const volume = calculateWorkoutVolume(workout.exercises);

      workout.totalVolume = volume;
      await workout.save();

      console.log("Updated:", workout._id);
    }
  }

  console.log("All workouts updated");
  process.exit();
}

fixVolume();