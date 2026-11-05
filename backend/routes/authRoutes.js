const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  refreshToken,
  getMe,
  requestPasswordReset,
  verifyPasswordResetOtp,
  resetPassword
} = require('../controllers/authController');

const router = express.Router();
const resetRequestLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many reset requests. Try again in 15 minutes.' } });
const resetVerifyLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many code attempts. Try again later.' } });

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
  ],
  validate,
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  loginUser
);

router.post('/refresh', refreshToken);
router.post('/forgot-password', resetRequestLimiter, [body('email').isEmail().withMessage('A valid email is required').normalizeEmail()], validate, requestPasswordReset);
router.post('/verify-reset-otp', resetVerifyLimiter, [body('email').isEmail().normalizeEmail(), body('otp').matches(/^\d{6}$/).withMessage('Enter the six-digit code')], validate, verifyPasswordResetOtp);
router.post('/reset-password', resetVerifyLimiter, [body('email').isEmail().normalizeEmail(), body('resetToken').notEmpty(), body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').matches(/\d/).withMessage('Password must contain at least one number')], validate, resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
