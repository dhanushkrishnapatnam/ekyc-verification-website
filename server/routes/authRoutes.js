const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getSecurityQuestion,
  resetPassword,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/get-security-question', getSecurityQuestion);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;