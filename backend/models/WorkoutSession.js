const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: Number,
  reps: Number,
  weight: Number,

  // ✅ NEW FIELD (IMPORTANT)
  progress: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      weight: Number,
      reps: Number,
      sets: Number
    }
  ]
});

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const workoutSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    exercises: [exerciseSchema],

    totalVolume: {
  type: Number,
  default: 0
},

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    comments: [commentSchema],

    visibility: {
      type: String,
      enum: ["private", "followers", "public"],
      default: "private"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutSession", workoutSessionSchema);