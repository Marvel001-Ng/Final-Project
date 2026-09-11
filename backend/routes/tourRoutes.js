const express = require('express');
const { authRequired, roleRequired } = require('../middleware/authMiddleware');
const {
  getAttractions,
  getAttractionById,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  getHotels,
  getHotelById,
  getEvents,
  getEventById,
  createBooking,
  getUserBookings,
  cancelBooking,
  submitReview,
  getReviews,
  getRecommendations,
  getAdminAttractions
} = require('../controllers/tourController');

const router = express.Router();

router.get('/attractions', getAttractions);
router.get('/attractions/:id', getAttractionById);
router.post('/attractions', authRequired, roleRequired('admin'), createAttraction);
router.put('/attractions/:id', authRequired, roleRequired('admin'), updateAttraction);
router.delete('/attractions/:id', authRequired, roleRequired('admin'), deleteAttraction);

router.get('/hotels', getHotels);
router.get('/hotels/:id', getHotelById);

router.get('/events', getEvents);
router.get('/events/:id', getEventById);

router.post('/bookings', authRequired, createBooking);
router.get('/bookings', authRequired, getUserBookings);
router.patch('/bookings/:id/cancel', authRequired, cancelBooking);

router.post('/reviews', authRequired, submitReview);
router.get('/reviews', getReviews);

router.post('/recommendations', authRequired, getRecommendations);
router.get('/admin/attractions', authRequired, roleRequired('admin'), getAdminAttractions);

module.exports = router;
