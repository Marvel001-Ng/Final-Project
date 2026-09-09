const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    attraction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attraction",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent the same user from reviewing the same attraction twice
reviewSchema.index({ user: 1, attraction: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);