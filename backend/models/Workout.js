const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    exercise: {
      type: String,
      required: true,
      trim: true
    },

    muscleGroup: {
      type: String,
      required: true
    },

    sets: {
      type: Number,
      required: true
    },

    reps: {
      type: Number,
      required: true
    },

    weight: {
      type: Number,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);