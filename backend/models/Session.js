const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true,
      index: true, // Index for date filtering
    },
    duration: {
      type: Number,
      required: true,
      max: 180,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for better density queries
sessionSchema.index({ startTime: 1, createdBy: 1 });

module.exports = mongoose.model("Session", sessionSchema);