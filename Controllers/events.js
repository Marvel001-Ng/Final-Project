const Event = require("../models/Event");


const getEvents = async (req, res) => {
  try {
    const { state, category, upcoming } = req.query;

    const filter = {};
    if (state) filter["location.state"] = state;
    if (category) filter.category = category;
    if (upcoming === "true") filter.startDate = { $gte: new Date() };

    const events = await Event.find(filter).sort({ startDate: 1 });

    res.status(200).json({
      msg: "Events fetched successfully",
      count: events.length,
      events,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    res.status(200).json({ msg: "Event fetched successfully", event });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const createEvent = async (req, res) => {
  try {
    const { title, description, category, location, startDate, endDate, price } = req.body;

    if (!title || !description || !category || !location || !startDate || !endDate) {
      return res.status(400).json({ msg: "please enter required field" });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ msg: "endDate cannot be before startDate" });
    }

    const event = await Event.create({
      title,
      description,
      category,
      location,
      startDate,
      endDate,
      price,
      createdBy: req.user._id, 
    });

    res.status(201).json({ msg: "Event created successfully", event });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    res.status(200).json({ msg: "Event updated successfully", event });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    res.status(200).json({ msg: "Event deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};