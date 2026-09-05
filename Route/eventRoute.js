const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../Controllers/events");
const { auth, adminOnly } = require("../Middleware/Auth");

router.route("/")
  .get(getEvents)
  .post(auth, adminOnly, createEvent);

router.route("/:id")
  .get(getEventById)
  .put(auth, adminOnly, updateEvent)
  .delete(auth, adminOnly, deleteEvent);

module.exports = router;