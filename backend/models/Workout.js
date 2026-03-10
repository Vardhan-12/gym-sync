const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
  weight: Number
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  muscleGroup: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },

  exercises: [exerciseSchema]

});

module.exports = mongoose.model("Workout", workoutSchema);