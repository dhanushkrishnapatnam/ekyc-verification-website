const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getSecurityQuestion,
  resetPassword
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/get-security-question', getSecurityQuestion);
router.post('/reset-password', resetPassword);

module.exports = router;