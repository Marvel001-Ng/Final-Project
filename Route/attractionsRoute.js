const express = require("express");
const router = express.Router();
const {
  getAttractions,
  getAttractionById,
  createAttraction,
  updateAttraction,
  deleteAttraction,
  uploadAttractionImage,
} = require("../Controllers/attractions");
const { auth, adminOnly } = require("../Middleware/Auth");
const upload = require("../middleware/uploadmiddleware");

router.route("/")
  .get(getAttractions)
  .post(auth, adminOnly, createAttraction);

router.route("/:id")
  .get(getAttractionById)
  .put(auth, adminOnly, updateAttraction)
  .delete(auth, adminOnly, deleteAttraction);

router.post("/:id/image", auth, adminOnly, upload.single("image"), uploadAttractionImage);

module.exports = router;