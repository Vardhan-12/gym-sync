const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { askAI } = require("../controllers/aiController");

// POST /api/ai/ask
router.post("/ask", protect, askAI);

module.exports = router;