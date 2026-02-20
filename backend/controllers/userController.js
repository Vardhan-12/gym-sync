const User = require("../models/User");

// GET PROFILE
exports.getProfile = async (req, res) => {
  res.status(200).json({
    user: req.user
  });
};


// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { age, height, weight, gymName, preferredWorkoutTime } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.age = age || user.age;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    user.gymName = gymName || user.gymName;
    user.preferredWorkoutTime = preferredWorkoutTime || user.preferredWorkoutTime;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};