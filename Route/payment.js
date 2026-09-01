const express = require("express");
const router = express.Router();
const { initializePayment, verifyPayment } = require("../Controllers/payment");
const { auth } = require("../middleware/auth");

router.post("/initialize", auth, initializePayment);
router.get("/verify/:reference", auth, verifyPayment);

module.exports = router;