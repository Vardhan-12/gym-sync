const Session = require("../models/Session");

exports.getBestGymTime = async () => {

  const result = await Session.aggregate([
    {
      $project: {
        hour: {
  $hour: {
    date: "$startTime",
    timezone: "Asia/Kolkata"
  }
}
      }
    },
    {
      $group: {
        _id: "$hour",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: 1 }
    },
    {
      $limit: 1
    }
  ]);

  return result[0];

};