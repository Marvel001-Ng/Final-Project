const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  hours: { type: String, default: '9:00 AM - 5:00 PM' },
  images: [{ type: String }],
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Attraction', attractionSchema);
