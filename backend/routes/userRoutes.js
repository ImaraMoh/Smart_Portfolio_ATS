const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfile, changePassword } = require('../controllers/userController');

const router = express.Router();
router.use(protect);

router.put('/me', updateProfile);

router.put(
  '/me/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
  ],
  validate,
  changePassword
);

module.exports = router;
