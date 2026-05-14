/*
========================================================
 AI CONTROLLER (HYBRID + COACH MODE + MEMORY)

 Features:
 ✔ Intent detection (flexible)
 ✔ Context memory (why → works)
 ✔ Coach mode (workout suggestions)
 ✔ Progress analysis
 ✔ Safe error handling

========================================================
*/

const densityService = require("../services/densityService");
const WorkoutSession = require("../models/WorkoutSession");

// 🔥 simple in-memory user context
const userMemory = new Map();

exports.askAI = async (req, res) => {
  try {
    const { question } = req.body;

    // 🔒 safe user extraction
    const userId = req.user?._id?.toString();

    // normalize input
    const q = question.toLowerCase();

    /*
    ========================================================
    HELPER: intent matcher (clean + scalable)
    ========================================================
    */
    const hasIntent = (keywords) =>
      keywords.some((word) => q.includes(word));

    /*
    ========================================================
    GREETING
    ========================================================
    */
    if (hasIntent(["hi", "hello"])) {
      return res.json({
        answer:
          "Hey! I'm your AI Gym Coach 💪\nAsk me about workouts, progress, or best time!",
      });
    }

    /*
    ========================================================
    WHAT CAN YOU DO
    ========================================================
    */
    if (hasIntent(["what can you do", "help"])) {
      return res.json({
        answer:
          "I can help you with:\n\n" +
          "• Best time to go to gym\n" +
          "• Workout suggestions\n" +
          "• Analyze your progress\n" +
          "• Act as your personal coach 💪",
      });
    }

    /*
    ========================================================
    BEST TIME
    ========================================================
    */
    if (hasIntent(["best time", "least crowded"])) {
      const result = await densityService.getPeakHours();

      if (!result || result.length === 0) {
        return res.json({
          answer: "Not enough data to predict best time yet.",
        });
      }

      const bestHour = result[result.length - 1]._id;

      // 🔥 save context
      userMemory.set(userId, {
        intent: "bestTime",
        data: { bestHour },
      });

      return res.json({
        answer: `Best time to go is around ${bestHour}:00 when the gym is least crowded.`,
      });
    }

    /*
    ========================================================
    WHY (context-aware)
    ========================================================
    */
    if (hasIntent(["why"])) {
      const memory = userMemory.get(userId);

      if (!memory) {
        return res.json({
          answer: "Can you tell me what you're referring to?",
        });
      }

      if (memory.intent === "bestTime") {
        return res.json({
          answer:
            `Because ${memory.data.bestHour}:00 has the lowest gym activity based on real session data.`,
        });
      }

      return res.json({
        answer: "I need more context to explain that.",
      });
    }

    /*
    ========================================================
    PROGRESS ANALYSIS
    ========================================================
    */
    if (hasIntent(["progress", "improve"])) {
      if (!userId) {
        return res.json({
          answer: "Please login to view your progress.",
        });
      }

      const workouts = await WorkoutSession.find({
        createdBy: userId,
      });

      if (!workouts || workouts.length === 0) {
        return res.json({
          answer: "You haven't logged any workouts yet.",
        });
      }

      const totalVolume = workouts.reduce(
        (sum, w) => sum + (w.totalVolume || 0),
        0
      );

      // 🔥 save context
      userMemory.set(userId, {
        intent: "progress",
        data: { totalVolume },
      });

      return res.json({
        answer:
          `You're doing great 💪\n` +
          `Total training volume: ${totalVolume}\n` +
          `Keep pushing consistently!`,
      });
    }

    /*
    ========================================================
    COACH MODE TRIGGER
    ========================================================
    */
    if (hasIntent(["coach"])) {
      return res.json({
        answer:
          "Coach mode activated 💪\n\n" +
          "I can:\n" +
          "• Suggest workouts\n" +
          "• Analyze your training\n" +
          "• Help improve progress\n\n" +
          "Try:\n" +
          "“chest workout” or “suggest plan”",
      });
    }

    /*
    ========================================================
    WORKOUT / PLAN / SUGGEST
    ========================================================
    */
    const isWorkoutQuery = hasIntent([
      "workout",
      "workouts",
      "plan",
      "suggest",
    ]);

    if (isWorkoutQuery) {
      return res.json({
        answer:
          "Alright, coach mode ON 💪\n\n" +
          "Tell me what you want:\n" +
          "• chest workout\n" +
          "• back workout\n" +
          "• full plan\n",
      });
    }

    /*
    ========================================================
    SPECIFIC WORKOUTS
    ========================================================
    */

    if (q.includes("chest")) {
      return res.json({
        answer:
          "Chest Workout 💪\n\n" +
          "• Bench Press – 4x8\n" +
          "• Incline DB Press – 3x10\n" +
          "• Chest Fly – 3x12\n" +
          "• Pushups – 3 sets\n",
      });
    }

    if (q.includes("back")) {
      return res.json({
        answer:
          "Back Workout 💪\n\n" +
          "• Pull-ups – 4x8\n" +
          "• Lat Pulldown – 3x10\n" +
          "• Barbell Row – 3x8\n" +
          "• Deadlift – 3x5\n",
      });
    }

    if (q.includes("legs")) {
      return res.json({
        answer:
          "Leg Workout 🦵\n\n" +
          "• Squats – 4x8\n" +
          "• Leg Press – 3x10\n" +
          "• Lunges – 3x12\n" +
          "• Calf Raises – 4x15\n",
      });
    }

    /*
    ========================================================
    DEFAULT FALLBACK
    ========================================================
    */
    return res.json({
      answer:
        "I didn’t fully understand 🤔\n\n" +
        "Try asking:\n" +
        "• best time to go\n" +
        "• show my progress\n" +
        "• suggest workout",
    });

  } catch (error) {
    console.error("AI ERROR:", error); // 🔥 debug line
    res.status(500).json({
      message: "Something went wrong in AI",
    });
  }
};