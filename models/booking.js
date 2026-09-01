const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentReference: {
      type: String, // Paystack transaction reference
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);