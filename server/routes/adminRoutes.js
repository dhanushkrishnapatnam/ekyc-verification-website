const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  deleteApplication,
  getDashboardStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(protect, adminOnly);

router.get('/applications', getAllApplications);
router.get('/application/:id', getApplicationById);
router.put('/approve/:id', approveApplication);
router.put('/reject/:id', rejectApplication);
router.delete('/application/:id', deleteApplication);
router.get('/stats', getDashboardStats);

module.exports = router;