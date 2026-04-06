const Message = require("../models/Message");
const Match = require("../models/Match");

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { matchId, text } = req.body;
    const userId = req.user._id;

    // check match exists and accepted
    const match = await Match.findById(matchId);

    if (!match || match.status !== "accepted") {
      return res.status(403).json({ message: "Not allowed" });
    }

    // check user belongs to match
    if (
      match.requester.toString() !== userId.toString() &&
      match.recipient.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const message = await Message.create({
      match: matchId,
      sender: userId,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages
exports.getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user._id;

    const match = await Match.findById(matchId);

    if (!match || match.status !== "accepted") {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (
      match.requester.toString() !== userId.toString() &&
      match.recipient.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const messages = await Message.find({ match: matchId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};