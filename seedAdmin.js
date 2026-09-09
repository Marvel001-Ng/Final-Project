// seedAdmin.js
// Run this once with: node seedAdmin.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/user"); // matches your models/user.js file

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({ email: "admin@touredo.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("changeThisPassword123", 10);

    const admin = await User.create({
      username: "TourEdoAdmin",
      email: "admin@touredo.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created:", admin.email);
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();