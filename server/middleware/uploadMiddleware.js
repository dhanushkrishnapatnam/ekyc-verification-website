const { upload } = require('../config/cloudinary');

const uploadDocs = upload.fields([
  { name: 'aadhaarImage', maxCount: 1 },
  { name: 'panImage', maxCount: 1 }
]);

module.exports = { uploadDocs };