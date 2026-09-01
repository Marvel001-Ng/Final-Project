const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require("../Controllers/booking");
const { auth} = require("../Middleware/Auth");

// Logged-in users
router.post("/", auth, createBooking);
router.get("/mybookings", auth, getMyBookings);
router.get("/:id", auth, getBookingById);
router.put("/:id/cancel", auth, cancelBooking);

// Admin only
router.get("/", auth,  getAllBookings);
router.put("/:id/status", auth,  updateBookingStatus);

module.exports = router;