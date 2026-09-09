const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../Controllers/recommendation");

// Public — no login required to get suggestions
router.post("/", getRecommendations);

module.exports = router;