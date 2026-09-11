const crypto = require('node:crypto');
const { store, findById } = require('../data/store');

function getAttractions(req, res) {
  const { category, location, search } = req.query;

  const result = store.attractions.filter((item) => {
    const matchesCategory = !category || item.category === category;
    const matchesLocation = !location || item.location.toLowerCase().includes(String(location).toLowerCase());
    const matchesSearch = !search || `${item.name} ${item.description}`.toLowerCase().includes(String(search).toLowerCase());
    return matchesCategory && matchesLocation && matchesSearch;
  });

  return res.json(result);
}

function getAttractionById(req, res) {
  const attraction = findById('attractions', req.params.id);
  if (!attraction) {
    return res.status(404).json({ message: 'Attraction not found.' });
  }

  return res.json({
    ...attraction,
    reviews: store.reviews.filter((review) => review.attractionId === attraction.id)
  });
}

function createAttraction(req, res) {
  const attraction = { id: req.body.id || crypto.randomUUID(), ...req.body };
  store.attractions.push(attraction);
  return res.status(201).json(attraction);
}

function updateAttraction(req, res) {
  const index = store.attractions.findIndex((item) => item.id === req.params.id);
  if (index < 0) {
    return res.status(404).json({ message: 'Attraction not found.' });
  }

  store.attractions[index] = { ...store.attractions[index], ...req.body, id: req.params.id };
  return res.json(store.attractions[index]);
}

function deleteAttraction(req, res) {
  const index = store.attractions.findIndex((item) => item.id === req.params.id);
  if (index < 0) {
    return res.status(404).json({ message: 'Attraction not found.' });
  }

  return res.json(store.attractions.splice(index, 1)[0]);
}

function getHotels(req, res) {
  const { type, location, maxPrice } = req.query;
  const result = store.hotels.filter((hotel) => {
    const matchesType = !type || hotel.type === type;
    const matchesLocation = !location || hotel.location.toLowerCase().includes(String(location).toLowerCase());
    const matchesPrice = !maxPrice || hotel.price <= Number(maxPrice);
    return matchesType && matchesLocation && matchesPrice;
  });

  return res.json(result);
}

function getHotelById(req, res) {
  const hotel = findById('hotels', req.params.id);
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found.' });
  }

  return res.json(hotel);
}

function getEvents(req, res) {
  const { month, search } = req.query;
  const result = store.events.filter((event) => {
    const matchesMonth = !month || event.month === month;
    const matchesSearch = !search || `${event.name} ${event.location} ${event.category}`.toLowerCase().includes(String(search).toLowerCase());
    return matchesMonth && matchesSearch;
  });

  return res.json(result);
}

function getEventById(req, res) {
  const event = findById('events', req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found.' });
  }

  return res.json(event);
}

function createBooking(req, res) {
  const { type, itemId, startDate, guests = 1 } = req.body;
  if (!type || !itemId || !startDate) {
    return res.status(400).json({ message: 'Type, itemId, and startDate are required.' });
  }

  if (type === 'attraction' && !findById('attractions', itemId)) {
    return res.status(404).json({ message: 'Attraction not found.' });
  }

  if (type === 'hotel' && !findById('hotels', itemId)) {
    return res.status(404).json({ message: 'Hotel not found.' });
  }

  const booking = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    type,
    itemId,
    startDate,
    guests,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  store.bookings.push(booking);
  return res.status(201).json(booking);
}

function getUserBookings(req, res) {
  return res.json(store.bookings.filter((booking) => booking.userId === req.user.id));
}

function cancelBooking(req, res) {
  const booking = findById('bookings', req.params.id);
  if (!booking || booking.userId !== req.user.id) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  booking.status = 'cancelled';
  return res.json(booking);
}

function submitReview(req, res) {
  const { attractionId, rating, text } = req.body;
  if (!findById('attractions', attractionId) || !rating || !text) {
    return res.status(400).json({ message: 'Attraction, rating, and review text are required.' });
  }

  const review = {
    id: crypto.randomUUID(),
    attractionId,
    userId: req.user.id,
    user: req.user.name,
    rating: Number(rating),
    text,
    createdAt: new Date().toISOString()
  };

  store.reviews.push(review);
  return res.status(201).json(review);
}

function getReviews(req, res) {
  return res.json(store.reviews.filter((review) => !req.query.attractionId || review.attractionId === req.query.attractionId));
}

function getRecommendations(req, res) {
  const { budget, days, interest, location } = req.body;
  const matches = store.attractions.filter((item) => (!interest || item.category === interest) && (!location || item.location.toLowerCase().includes(String(location).toLowerCase()))).slice(0, 3);
  const hotel = store.hotels.filter((item) => !budget || item.price <= Number(budget)).sort((a, b) => b.rating - a.rating)[0] || null;

  return res.json({
    input: { budget, days, interest, location },
    suggestions: {
      hotel,
      attractions: matches,
      estimatedBudget: hotel && matches.length ? hotel.price + matches.reduce((total, item) => total + item.price, 0) : null
    }
  });
}

function getAdminAttractions(req, res) {
  return res.json(store.attractions);
}

module.exports = {
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
};
