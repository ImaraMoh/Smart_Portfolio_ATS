const express = require('express');
const { protect } = require('../middleware/auth');
const uploadResume = require('../middleware/uploadResume');

const {
  downloadResume,
  regenerateResume,
  analyzeResume,
} = require('../controllers/resumeController');

const router = express.Router();

router.use(protect);

router.get(
  '/download',
  downloadResume
);

router.post(
  '/regenerate',
  regenerateResume
);

router.post(
  '/analyze',
  uploadResume.single('resume'),
  analyzeResume
);

module.exports = router;
