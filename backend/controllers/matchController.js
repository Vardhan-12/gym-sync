const Match = require("../models/Match");

const sendMatchRequest = async (req, res) => {
  try {
    const requester = req.user._id;
    const { recipientId } = req.body;

    if (requester.toString() === recipientId) {
      return res.status(400).json({ message: "Cannot match yourself" });
    }

    // 🔴 Prevent duplicate requests
    const existing = await Match.findOne({
      $or: [
        { requester, recipient: recipientId },
        { requester: recipientId, recipient: requester },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const match = await Match.create({
      requester,
      recipient: recipientId,
    });

    res.status(201).json(match);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyMatches = async (req, res) => {
  try {
    const userId = req.user._id;

    const matches = await Match.find({
      $or: [
        { requester: userId },
        { recipient: userId },
      ],
    });

    res.json(matches);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Match.find({
      recipient: userId,
      status: "pending",
    }).populate("requester", "name email");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const { matchId, action } = req.body;

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    match.status = action; // "accepted" or "rejected"
    await match.save();

    res.json(match);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Message = require("../models/Message");

exports.getMyMatches = async (req, res) => {
  try {
    const userId = req.user._id;

    const matches = await Match.find({
      status: "accepted",
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    })
      .populate("requester", "name")
      .populate("recipient", "name");

    // ✅ attach last message
    const results = await Promise.all(
      matches.map(async (match) => {
        const lastMessage = await Message.findOne({ match: match._id })
          .sort({ createdAt: -1 })
          .select("text createdAt sender");

        return {
          ...match.toObject(),
          lastMessage,
        };
      })
    );

    res.json(results);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMatchRequest,
  getMyMatches,
  getIncomingRequests,
  respondToRequest,
  getMyMatches,
};