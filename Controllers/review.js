const Review = require("../models/review");
const Attraction = require("../models/attractions");


// @access  Private (logged-in users)
const addReview = async (req, res) => {
  try {
    const { attraction, rating, comment } = req.body;

    if (!attraction || !rating || !comment) {
      return res.status(400).json({ msg: "please enter required field" });
    }

    // Confirm the attraction actually exists
    const foundAttraction = await Attraction.findById(attraction);
    if (!foundAttraction) {
      return res.status(404).json({ msg: "Attraction not found" });
    }

    
    const existingReview = await Review.findOne({
      user: req.user._id,
      attraction,
    });
    if (existingReview) {
      return res.status(400).json({ msg: "You already reviewed this attraction" });
    }

    const review = await Review.create({
      user: req.user._id, 
      attraction,
      rating,
      comment,
    });

    res.status(201).json({ msg: "Review added successfully", review });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


// @access  Public
const getReviewsForAttraction = async (req, res) => {
  try {
    const reviews = await Review.find({
      attraction: req.params.attractionId,
    })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      msg: "Reviews fetched successfully",
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ msg: "Not authorized to edit this review" });
    }

    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    res.status(200).json({ msg: "Review updated successfully", review });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    res.status(200).json({ msg: "Review deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("attraction", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      msg: "Reviews fetched successfully",
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

module.exports = {
  addReview,
  getReviewsForAttraction,
  updateReview,
  deleteReview,
  getMyReviews,
};