const Attraction = require("../models/attractions");
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


const getAttractions = async (req, res) => {
  try {
    const { state, category, minPrice, maxPrice } = req.query;

    const filter = {};
    if (state) filter["location.state"] = state;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const attractions = await Attraction.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      msg: "Attractions fetched successfully",
      count: attractions.length,
      attractions,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const getAttractionById = async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);

    if (!attraction) {
      return res.status(404).json({ msg: "Attraction not found" });
    }

    res.status(200).json({ msg: "Attraction fetched successfully", attraction });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const createAttraction = async (req, res) => {
  try {
    const { name, description, category, location, price, openingHours, image } = req.body;

    if (!name || !description || !category || !location) {
      return res.status(400).json({ msg: "please enter required field" });
    }

    const attraction = await Attraction.create({
      name,
      description,
      category,
      location,
      price,
      openingHours,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({ msg: "Attraction created successfully", attraction });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

const updateAttraction = async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!attraction) {
      return res.status(404).json({ msg: "Attraction not found" });
    }

    res.status(200).json({ msg: "Attraction updated successfully", attraction });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};


const deleteAttraction = async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndDelete(req.params.id);

    if (!attraction) {
      return res.status(404).json({ msg: "Attraction not found" });
    }

    res.status(200).json({ msg: "Attraction deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

const uploadAttractionImage = async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id);
    if (!attraction) {
      return res.status(404).json({ msg: "Attraction not found" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "please upload an image" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer);
    attraction.image = result.secure_url;
    await attraction.save();

    res.status(200).json({ msg: "Image uploaded successfully", attraction });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "server error" });
  }
};

module.exports = {
  getAttractions,
  getAttractionById,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  uploadAttractionImage,
};
