const express = require("express");
const router = express.Router();
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  uploadHotelImage,
} = require("../Controllers/hotel");
const { auth, adminOnly } = require("../Middleware/Auth");
const upload = require("../Middleware/uploadmiddleware");

router.route("/")
  .get(getHotels)
  .post(auth, adminOnly, createHotel);

router.route("/:id")
  .get(getHotelById)
  .put(auth, adminOnly, updateHotel)
  .delete(auth, adminOnly, deleteHotel);

router.post("/:id/image", auth, adminOnly, upload.single("image"), uploadHotelImage);

module.exports = router;