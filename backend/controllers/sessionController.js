const Session = require("../models/Session");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// Helper to compute end time
const getEndTime = (startTime, duration) => {
  return new Date(new Date(startTime).getTime() + duration * 60000);
};

// Create Session
exports.createSession = asyncHandler(async (req, res) => {
  const { startTime, duration } = req.body;

  const session = await Session.create({
    startTime,
    duration,
    createdBy: req.user.id,
  });

  res.status(201).json(session);
});

// Get Sessions (paginated)
exports.getSessions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.date) {
    const selectedDate = new Date(req.query.date);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    filter.startTime = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  const sessions = await Session.find(filter)
    .populate("createdBy", "name email")
    .sort({ startTime: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Session.countDocuments(filter);

  res.json({
    sessions,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
});

// Delete Session
exports.deleteSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  if (session.createdBy.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await session.deleteOne();

  res.json({ message: "Session deleted" });
});

// Get Density by Date (30-min windows)
exports.getDensityByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;

  const selectedDate = new Date(date);

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch sessions that overlap the day at all
  const sessions = await Session.find({
    startTime: { $lte: endOfDay },
  });

  const density = [];

  const getEndTime = (startTime, duration) => {
    return new Date(new Date(startTime).getTime() + duration * 60000);
  };

  for (let hour = 0; hour < 24; hour++) {
    for (let half = 0; half < 2; half++) {
      const windowStart = new Date(startOfDay);
      windowStart.setHours(hour, half * 30, 0, 0);

      const windowEnd = new Date(windowStart.getTime() + 30 * 60000);

      let count = 0;

      sessions.forEach((s) => {
        const sessionStart = new Date(s.startTime);
        const sessionEnd = getEndTime(s.startTime, s.duration);

        const overlap =
          Math.min(sessionEnd, windowEnd) -
          Math.max(sessionStart, windowStart);

        if (overlap >= 1) {
          count++;
        }
      });

      density.push({
        windowStart,
        count,
      });
    }
  }

  res.json(density);
});

// Get Overlapping Users (>=30 mins overlap)
exports.getOverlappingUsers = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const baseSession = await Session.findById(sessionId);

  if (!baseSession) {
    res.status(404);
    throw new Error("Session not found");
  }

  const baseStart = new Date(baseSession.startTime);
  const baseEnd = getEndTime(baseSession.startTime, baseSession.duration);

  const sessions = await Session.find({
    _id: { $ne: sessionId },
  }).populate("createdBy", "name email");

  const overlappingUsers = [];

  sessions.forEach((s) => {
    const start = new Date(s.startTime);
    const end = getEndTime(s.startTime, s.duration);

    const overlap =
      Math.min(baseEnd, end) - Math.max(baseStart, start);

    if (overlap >= 30 * 60000) {
      overlappingUsers.push(s.createdBy);
    }
  });

  res.json(overlappingUsers);
});