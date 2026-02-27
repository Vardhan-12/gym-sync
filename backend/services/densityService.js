const Session = require("../models/Session");

// Compute endTime
const getEndTime = (startTime, duration) => {
  return new Date(new Date(startTime).getTime() + duration * 60000);
};

// Overlap logic
const hasValidOverlap = (A, B) => {
  const Aend = getEndTime(A.startTime, A.duration);
  const Bend = getEndTime(B.startTime, B.duration);

  const overlapStart = new Date(Math.max(A.startTime, B.startTime));
  const overlapEnd = new Date(Math.min(Aend, Bend));

  const overlapMinutes = (overlapEnd - overlapStart) / 60000;

  return overlapMinutes >= 30;
};

// Density calculation
exports.calculateDensity = async (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  const sessions = await Session.find({
    startTime: { $gte: startOfDay, $lte: endOfDay },
  });

  const windows = [];
  const windowSize = 30; // minutes

  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += windowSize) {
      const windowStart = new Date(startOfDay);
      windowStart.setHours(hour, min, 0, 0);

      const windowEnd = new Date(windowStart.getTime() + windowSize * 60000);

      let count = 0;

      sessions.forEach((session) => {
        const sessionEnd = getEndTime(session.startTime, session.duration);

        if (
          session.startTime < windowEnd &&
          sessionEnd > windowStart
        ) {
          count++;
        }
      });

      windows.push({
        windowStart,
        count,
      });
    }
  }

  return windows;
};

exports.findOverlappingUsers = async (sessionId) => {
  const baseSession = await Session.findById(sessionId);

  if (!baseSession) {
    throw new AppError("Session not found", 404);
  }

  const sessions = await Session.find({
    _id: { $ne: sessionId },
    createdBy: { $ne: baseSession.createdBy },
  }).populate("createdBy", "name email");

  const overlapping = sessions.filter((session) =>
    hasValidOverlap(baseSession, session)
  );

  return overlapping.map((s) => s.createdBy);
};