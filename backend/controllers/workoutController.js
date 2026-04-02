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

  const result = await WorkoutSession.aggregate([
    {
      $match: {
        createdBy: req.user._id
      }
    },
    {
      $unwind: "$exercises"
    },
    {
      $match: {
        "exercises.name": exercise
      }
    },
    {
      $unwind: "$exercises.progress"
    },

    // ✅ GROUP BY DATE (IMPORTANT)
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$exercises.progress.date"
          }
        },
        maxWeight: {
          $max: "$exercises.progress.weight"
        }
      }
    },

    // ✅ SORT BY DATE
    {
      $sort: { _id: 1 }
    },

    // ✅ FORMAT OUTPUT
    {
      $project: {
        date: "$_id",
        weight: "$maxWeight",
        _id: 0
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

exports.getUserExercises = asyncHandler(async (req, res) => {
  const result = await WorkoutSession.aggregate([
    {
      $match: {
        createdBy: req.user._id
      }
    },
    {
      $unwind: "$exercises"
    },
    {
      $group: {
        _id: "$exercises.name"
      }
    },
    {
      $project: {
        name: "$_id",
        _id: 0
      }
    },
    {
      $sort: { name: 1 }
    }
  ]);

  res.json(result);
});

exports.getVolumeProgress = asyncHandler(async (req, res) => {
  const result = await WorkoutSession.aggregate([
    {
      $match: {
        createdBy: req.user._id
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$updatedAt"
          }
        },
        totalVolume: { $sum: "$totalVolume" }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $project: {
        date: "$_id",
        totalVolume: 1,
        _id: 0
      }
    }
  ]);

  res.json(result);
});

exports.getExerciseInsights = asyncHandler(async (req, res) => {
  const { exercise } = req.params;

  const result = await WorkoutSession.aggregate([
    {
      $match: {
        createdBy: req.user._id
      }
    },
    {
      $unwind: "$exercises"
    },
    {
      $match: {
        "exercises.name": exercise
      }
    },
    {
      $unwind: "$exercises.progress"
    },

    // group by date
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$exercises.progress.date"
          }
        },
        maxWeight: {
          $max: "$exercises.progress.weight"
        }
      }
    },

    {
      $sort: { _id: 1 }
    }
  ]);

  if (result.length === 0) {
    return res.json(null);
  }

  // 🔥 calculate insights
  let best = result[0];

  result.forEach((day) => {
    if (day.maxWeight > best.maxWeight) {
      best = day;
    }
  });

  res.json({
    bestWeight: best.maxWeight,
    bestDay: best._id,
    totalDays: result.length
  });
});