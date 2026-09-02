const Hotel = require("../models/hotel");
const cloudinary = require("../config/cloudinary");

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "touredo" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const getHotels = async (req, res) => {
  try {
    const { minPrice, maxPrice, availability } = req.query;

    const filter = {};
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (availability !== undefined) filter.availability = availability === "true";

    const hotels = await Hotel.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      msg: "Hotels fetched successfully",
      count: hotels.length,
      hotels,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ msg: "Hotel not found" });
    }
    res.status(200).json({ msg: "Hotel fetched successfully", hotel });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

const createHotel = async (req, res) => {
  try {
    const { name, price, rooms, availability, image } = req.body;

    if (!name || !price || !rooms) {
      return res.status(400).json({ msg: "please enter required field" });
    }

    const hotel = await Hotel.create({
      name,
      price,
      rooms,
      availability,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({ msg: "Hotel created successfully", hotel });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hotel) {
      return res.status(404).json({ msg: "Hotel not found" });
    }

    res.status(200).json({ msg: "Hotel updated successfully", hotel });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ msg: "Hotel not found" });
    }
    res.status(200).json({ msg: "Hotel deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

const uploadHotelImage = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ msg: "Hotel not found" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "please upload an image" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer);
    hotel.image = result.secure_url;
    await hotel.save();

    res.status(200).json({ msg: "Image uploaded successfully", hotel });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  uploadHotelImage,
};