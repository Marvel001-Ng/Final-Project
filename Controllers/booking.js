const Booking = require("../models/booking");
const Attraction = require("../models/attractions");


const createBooking = async (req, res) => {
  try {
    const { attraction, date, guests } = req.body;

    if (!attraction || !date || !guests) {
      return res.status(400).json({ msg: "please enter required field" });
    }

    
    const foundAttraction = await Attraction.findById(attraction);
    if (!foundAttraction) {
      return res.status(404).json({ msg: "Attraction not found" });
    }

    const totalPrice = foundAttraction.price * guests;

    const booking = await Booking.create({
      user: req.user._id, 
      attraction,
      date,
      guests,
      totalPrice,
    });

    res.status(201).json({ msg: "Booking created successfully", booking });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("attraction", "name price location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      msg: "Bookings fetched successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "attraction",
      "name price location"
    );

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

  
    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to view this booking" });
    }

    res.status(200).json({ msg: "Booking fetched successfully", booking });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ msg: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ msg: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "username email")
      .populate("attraction", "name price location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      msg: "Bookings fetched successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ msg: "invalid status value" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    res.status(200).json({ msg: "Booking status updated successfully", booking });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
};