const User = require("../models/User");
const Session = require("../models/Session");

exports.getAllUsers = async (req, res) => {

  const users = await User.find().select("-password");

  res.json({
    success: true,
    users
  });

};

exports.deleteUser = async (req, res) => {

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "User deleted"
  });

};

exports.getAllSessions = async (req, res) => {

  const sessions = await Session.find()
    .populate("createdBy", "name email");

  res.json({
    success: true,
    sessions
  });

};