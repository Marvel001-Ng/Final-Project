
const express = require("express");
const router = express.Router();
const {
  addReview,
  getReviewsForAttraction,
  updateReview,
  deleteReview,
  getMyReviews,
} = require("../Controllers/review");
const { auth} = require("../Middleware/Auth");

// Create a review (must be logged in)
router.post("/", auth, addReview);

// Get all reviews for a specific attraction (public)
router.get("/attraction/:attractionId", getReviewsForAttraction);

// Get the logged-in user's own reviews
router.get("/myreviews", auth, getMyReviews);

// Update or delete your own review
router.put("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);

module.exports = router;