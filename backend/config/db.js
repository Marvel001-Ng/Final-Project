const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('MongoDB not configured; running with in-memory store for local development.');
    return null;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('MongoDB connected.');
    return mongoose.connection;
  } catch (error) {
    console.warn(`MongoDB unavailable: ${error.message}`);
    console.warn('Starting with the in-memory development store.');
    return null;
  }
}

module.exports = { connectDB };
