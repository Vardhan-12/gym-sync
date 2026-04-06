const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessages,
} = require("../controllers/chatController");

router.post("/send", protect, sendMessage);
router.get("/:matchId", protect, getMessages);

module.exports = router;