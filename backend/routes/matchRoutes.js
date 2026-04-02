const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  sendMatchRequest,
  getMyMatches,
  getIncomingRequests,
  respondToRequest,
} = require("../controllers/matchController");

// Send match request
router.post("/request", protect, sendMatchRequest);

// Get all my matches (for button state)
router.get("/my", protect, getMyMatches);

// Get incoming requests
router.get("/incoming", protect, getIncomingRequests);

// Accept / Reject
router.post("/respond", protect, respondToRequest);

module.exports = router;