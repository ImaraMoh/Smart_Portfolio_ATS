const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { scoreResume, getHistory } = require('../controllers/atsController');

const router = express.Router();
router.use(protect);

router.post(
  '/score',
  [body('jobDescriptionText').trim().notEmpty().withMessage('Job description text is required')],
  validate,
  scoreResume
);
router.get('/history', getHistory);

module.exports = router;
