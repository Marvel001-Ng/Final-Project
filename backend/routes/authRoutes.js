const express = require('express');
const { authRequired } = require('../middleware/authMiddleware');
const { signup, login, forgotPassword, getMe } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', authRequired, getMe);

module.exports = router;
