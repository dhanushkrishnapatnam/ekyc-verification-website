const express = require('express');
const router = express.Router();
const { submitKyc, getKycStatus, getKycHistory, resubmitKyc } = require('../controllers/kycController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post(
  '/submit',
  protect,
  upload.fields([
    { name: 'aadhaarImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 }
  ]),
  submitKyc
);

router.get('/status', protect, getKycStatus);
router.get('/history', protect, getKycHistory);
router.put(
  '/resubmit/:id',
  protect,
  upload.fields([
    { name: 'aadhaarImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 }
  ]),
  resubmitKyc
);

module.exports = router;