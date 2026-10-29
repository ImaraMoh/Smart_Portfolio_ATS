const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(
      new Error('Only PDF resume files are allowed'),
      false
    );
  }
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const uploadAvatar = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error('Please choose a JPG, PNG, or WebP image'), false);
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = uploadResume;
module.exports.uploadAvatar = uploadAvatar;
