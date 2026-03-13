const KycApplication = require('../models/KycApplication');
const User = require('../models/User');

// @route GET /api/admin/applications
const getAllApplications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    if (search) {
      const users = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      const userIds = users.map(u => u._id);
      query.$or = [
        { userId: { $in: userIds } },
        { aadhaarNumber: { $regex: search } },
        { panNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await KycApplication.countDocuments(query);
    const applications = await KycApplication.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      applications,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/application/:id
const getApplicationById = async (req, res) => {
  try {
    const application = await KycApplication.findById(req.params.id)
      .populate('userId', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/approve/:id
// Admin can approve regardless of current status
const approveApplication = async (req, res) => {
  try {
    const application = await KycApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'approved';
    application.adminComment = '';
    await application.save();

    res.json({ message: 'Application approved successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/reject/:id
// Admin can reject regardless of current status
const rejectApplication = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ message: 'Rejection comment is required' });
    }

    const application = await KycApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'rejected';
    application.adminComment = comment;
    await application.save();

    res.json({ message: 'Application rejected', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/admin/application/:id
const deleteApplication = async (req, res) => {
  try {
    const application = await KycApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await KycApplication.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const total = await KycApplication.countDocuments();
    const pending = await KycApplication.countDocuments({ status: 'pending' });
    const approved = await KycApplication.countDocuments({ status: 'approved' });
    const rejected = await KycApplication.countDocuments({ status: 'rejected' });

    res.json({ total, pending, approved, rejected });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  deleteApplication,
  getDashboardStats
};