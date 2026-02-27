const Session = require("../models/Session");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const densityService = require("../services/densityService");
const sessionService = require("../services/sessionService");

// Helper to compute end time
const getEndTime = (startTime, duration) => {
  return new Date(new Date(startTime).getTime() + duration * 60000);
};

// Create Session
exports.createSession = asyncHandler(async (req, res) => {
  const session = await sessionService.createSession(
    req.body,
    req.user._id
  );

  res.status(201).json(session);
});

// Get Sessions (paginated)
exports.getSessions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;

  const result = await sessionService.getSessions(
    req.user._id,
    page
  );

  res.json(result);
});

// Delete Session
exports.deleteSession = asyncHandler(async (req, res) => {
  const result = await sessionService.deleteSession(
    req.params.id,
    req.user._id
  );

  res.json(result);
});

// Get Density by Date (30-min windows)
exports.getDensityByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  const density = await densityService.calculateDensity(date);

  res.json(density);
});

// Get Overlapping Users (>=30 mins overlap)
exports.getOverlappingUsers = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const users = await densityService.findOverlappingUsers(sessionId);

  res.json(users);
});

exports.getSessionSummary = asyncHandler(async (req, res) => {
  const now = new Date();

  const startOfWeek = new Date();
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const totalSessions = await Session.countDocuments();

  const weeklySessions = await Session.countDocuments({
    startTime: { $gte: startOfWeek },
  });

  const todaySessions = await Session.countDocuments({
    startTime: { $gte: startOfToday },
  });

  res.json({
    totalSessions,
    weeklySessions,
    todaySessions,
  });
});

exports.getWeeklySummary = asyncHandler(async (req, res) => {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const result = await Session.aggregate([
    {
      $match: {
        startTime: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$startTime",
          },
        },
        totalSessions: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(
    result.map((r) => ({
      date: r._id,
      totalSessions: r.totalSessions,
    }))
  );
});

exports.getAdminAnalytics = asyncHandler(async (req, res) => {
  const totalSessions = await Session.countDocuments();
  const totalUsers = await User.countDocuments();

  const busiestDay = await Session.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$startTime",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  res.json({
    totalSessions,
    totalUsers,
    busiestDay: busiestDay[0] || null,
  });
});