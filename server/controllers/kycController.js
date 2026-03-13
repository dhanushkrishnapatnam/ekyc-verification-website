const KycApplication = require('../models/KycApplication');
const { validateAadhaar, validatePAN } = require('../utils/validators');

// @route POST /api/kyc/submit
const submitKyc = async (req, res) => {
  try {
    const { name, dob, aadhaarNumber, panNumber } = req.body;

    if (!name || !dob || !aadhaarNumber || !panNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validateAadhaar(aadhaarNumber)) {
      return res.status(400).json({ message: 'Aadhaar must be exactly 12 digits' });
    }

    if (!validatePAN(panNumber.toUpperCase())) {
      return res.status(400).json({ message: 'Invalid PAN format (e.g. ABCDE1234F)' });
    }

    if (!req.files || !req.files.aadhaarImage || !req.files.panImage) {
      return res.status(400).json({ message: 'Both Aadhaar and PAN images are required' });
    }

    // Block if there is already a pending application
    const pendingApplication = await KycApplication.findOne({
      userId: req.user._id,
      status: 'pending'
    });

    if (pendingApplication) {
      return res.status(400).json({
        message: 'You already have a pending application. Please wait for admin review.'
      });
    }

    // Block if user has reached 3 fresh submissions
    const totalApplications = await KycApplication.countDocuments({
      userId: req.user._id
    });

    if (totalApplications >= 3) {
      return res.status(400).json({
        message: 'You have reached the maximum of 3 KYC submissions. You can only resubmit a rejected application.'
      });
    }

    const aadhaarImageUrl = req.files.aadhaarImage[0].path;
    const panImageUrl = req.files.panImage[0].path;

    const application = await KycApplication.create({
      userId: req.user._id,
      name,
      dob,
      aadhaarNumber,
      panNumber: panNumber.toUpperCase(),
      aadhaarImageUrl,
      panImageUrl
    });

    res.status(201).json({ message: 'KYC submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/kyc/status
const getKycStatus = async (req, res) => {
  try {
    const application = await KycApplication.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (!application) {
      return res.status(404).json({ message: 'No KYC application found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/kyc/history
const getKycHistory = async (req, res) => {
  try {
    const applications = await KycApplication.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/kyc/resubmit/:id
const resubmitKyc = async (req, res) => {
  try {
    const application = await KycApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (application.status !== 'rejected') {
      return res.status(400).json({ message: 'Only rejected applications can be resubmitted' });
    }

    const { name, dob, aadhaarNumber, panNumber } = req.body;

    if (aadhaarNumber && !validateAadhaar(aadhaarNumber)) {
      return res.status(400).json({ message: 'Aadhaar must be exactly 12 digits' });
    }

    if (panNumber && !validatePAN(panNumber.toUpperCase())) {
      return res.status(400).json({ message: 'Invalid PAN format (e.g. ABCDE1234F)' });
    }

    application.name = name || application.name;
    application.dob = dob || application.dob;
    application.aadhaarNumber = aadhaarNumber || application.aadhaarNumber;
    application.panNumber = panNumber ? panNumber.toUpperCase() : application.panNumber;

    if (req.files && req.files.aadhaarImage) {
      application.aadhaarImageUrl = req.files.aadhaarImage[0].path;
    }
    if (req.files && req.files.panImage) {
      application.panImageUrl = req.files.panImage[0].path;
    }

    application.status = 'pending';
    application.adminComment = '';
    await application.save();

    res.json({ message: 'Application resubmitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitKyc, getKycStatus, getKycHistory, resubmitKyc };