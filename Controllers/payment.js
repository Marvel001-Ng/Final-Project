const axios = require("axios");
require("dotenv").config();
const Booking = require("../models/booking");

const PAYSTACK_BASE_URL = "https://api.paystack.co";
const paystackHeaders = {
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json",
};


// @access  Private (booking owner)
const initializePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ msg: "please enter required field" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ msg: "Not authorized to pay for this booking" });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ msg: "This booking has already been paid for" });
    }

    
    const amountInKobo = booking.totalPrice * 100;

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: req.user.email,
        amount: amountInKobo,
        metadata: {
          bookingId: booking._id.toString(),
          userId: req.user._id.toString(),
        },
        callback_url: process.env.PAYSTACK_CALLBACK_URL,
      },
      { headers: paystackHeaders }
    );

    booking.paymentReference = response.data.data.reference;
    await booking.save();

    res.status(200).json({
      msg: "Payment initialized successfully",
      authorizationUrl: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ msg: "Failed to initialize payment" });
  }
};


// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      { headers: paystackHeaders }
    );

    const { status, metadata } = response.data.data;

    const booking = await Booking.findById(metadata.bookingId);
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found for this payment" });
    }

    if (status === "success") {
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      await booking.save();

      return res.status(200).json({ msg: "Payment verified successfully", booking });
    } else {
      booking.paymentStatus = "failed";
      await booking.save();

      return res.status(400).json({ msg: "Payment was not successful", booking });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ msg: "Failed to verify payment" });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
};