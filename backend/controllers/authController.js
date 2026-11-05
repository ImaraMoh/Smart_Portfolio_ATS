const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { generateUniqueSlug } = require('../utils/slugify');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const hashSecret = (value) => crypto.createHmac('sha256', process.env.JWT_SECRET || 'folio-reset-code').update(value).digest('hex');

const sendResetOtpEmail = async (email, otp) => {
  const smtpHost = process.env.SMTP_HOST || '';
  const hasSmtpUser = Boolean(process.env.SMTP_USER);
  const hasSmtpPass = Boolean(process.env.SMTP_PASS);
  if (!smtpHost || !process.env.FROM_EMAIL || hasSmtpUser !== hasSmtpPass) {
    const error = new Error('Password reset email is not configured. Set SMTP_HOST and FROM_EMAIL, and provide both SMTP_USER and SMTP_PASS when authentication is required.');
    error.status = 503;
    throw error;
  }
  if (/gmail\.com$/i.test(smtpHost) && !hasSmtpUser) {
    const error = new Error('Gmail SMTP requires SMTP_USER and SMTP_PASS. Use the Gmail address and an App Password; a regular Gmail password will not work.');
    error.status = 503;
    throw error;
  }
  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    ...(process.env.SMTP_USER && process.env.SMTP_PASS
      ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }
      : {})
  });
  const html = `<!doctype html><html><body style="margin:0;padding:32px 12px;background:#f5f6fa;font-family:Arial,Helvetica,sans-serif;color:#171b24"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#fff;border:1px solid #e6e8ef;border-radius:14px;overflow:hidden"><tr><td style="padding:22px 28px;background:#101a35;color:#fff"><span style="font-size:19px;font-weight:700;letter-spacing:1px">FOLIO</span><span style="padding-left:9px;color:#d4a24e;font-size:10px;letter-spacing:1px">CAREER STUDIO</span></td></tr><tr><td style="padding:32px 28px 12px"><p style="margin:0 0 10px;color:#7b8495;font-size:11px;font-weight:700;letter-spacing:1.4px">PASSWORD RECOVERY</p><h1 style="margin:0 0 14px;font-size:23px;line-height:1.3">Your verification code</h1><p style="margin:0;color:#626b7b;font-size:14px;line-height:1.7">Use the code below to verify your email and choose a new password.</p><div style="margin:25px 0;padding:18px;text-align:center;border:1px solid #e5e9f6;border-radius:10px;background:#f5f7fd;color:#101a35;font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:700;letter-spacing:10px">${otp}</div><p style="margin:0;color:#626b7b;font-size:13px;line-height:1.7"><strong>This code expires in 10 minutes.</strong><br>If you didn’t request a password reset, you can safely ignore this email.</p></td></tr><tr><td style="padding:20px 28px 26px;color:#9299a6;font-size:11px;border-top:1px solid #edf0f5">Folio Career Studio · Secure account recovery</td></tr></table></td></tr></table></body></html>`;
  try {
    await transporter.sendMail({
      from: { name: 'Folio Career Studio', address: process.env.FROM_EMAIL },
      to: email,
      subject: 'Your Folio password reset code',
      text: `Your Folio password reset code is ${otp}.\n\nEnter this six-digit code on the password recovery page. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
      html
    });
  } catch (smtpError) {
    console.error('Folio password reset email delivery failed', {
      code: smtpError.code,
      responseCode: smtpError.responseCode,
      command: smtpError.command,
      host: smtpHost,
      message: smtpError.message
    });
    const errorCode = smtpError.code || smtpError.responseCode || 'SMTP_ERROR';
    const error = new Error(`Unable to send the reset code (${errorCode}). Check SMTP credentials and sender permissions.`);
    error.status = 502;
    throw error;
  }
};

const requestPasswordReset = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({ email }).select('+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpAttempts');
  if (!user) return res.json({ success: true, message: 'If an account exists for that email, a reset code has been sent.' });

  const otp = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  user.passwordResetOtpHash = hashSecret(otp);
  user.passwordResetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.passwordResetOtpAttempts = 0;
  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpiresAt = undefined;
  await user.save();
  try {
    await sendResetOtpEmail(user.email, otp);
  } catch (error) {
    user.passwordResetOtpHash = undefined;
    user.passwordResetOtpExpiresAt = undefined;
    await user.save();
    res.status(error.status || 502);
    throw error;
  }
  res.json({ success: true, message: 'If an account exists for that email, a reset code has been sent.' });
});

const verifyPasswordResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpAttempts');
  if (!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt || user.passwordResetOtpExpiresAt < Date.now() || user.passwordResetOtpAttempts >= 5) {
    res.status(400);
    throw new Error('That code is invalid or expired. Request a new code and try again.');
  }
  if (hashSecret(otp) !== user.passwordResetOtpHash) {
    user.passwordResetOtpAttempts += 1;
    await user.save();
    res.status(400);
    throw new Error('That code is invalid or expired. Request a new code and try again.');
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetTokenHash = hashSecret(resetToken);
  user.passwordResetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.passwordResetOtpHash = undefined;
  user.passwordResetOtpExpiresAt = undefined;
  user.passwordResetOtpAttempts = 0;
  await user.save();
  res.json({ success: true, data: { resetToken } });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetToken, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash +passwordResetTokenHash +passwordResetTokenExpiresAt');
  if (!user || !user.passwordResetTokenHash || !user.passwordResetTokenExpiresAt || user.passwordResetTokenExpiresAt < Date.now() || hashSecret(resetToken) !== user.passwordResetTokenHash) {
    res.status(400);
    throw new Error('Your reset session expired. Please verify your email code again.');
  }
  user.passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(12));
  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpiresAt = undefined;
  await user.save();
  res.json({ success: true, message: 'Password updated. You can now sign in with your new password.' });
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  const portfolioSlug = await generateUniqueSlug(User, name);

  const user = await User.create({ name, email, passwordHash, portfolioSlug });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
        website: user.website,
        socialLinks: user.socialLinks,
        avatarUrl: user.avatarUrl,
        portfolioSlug: user.portfolioSlug,
        templatePreference: user.templatePreference
      },
      accessToken,
      refreshToken
    }
  });
});

// @desc    Authenticate user & return tokens
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  user.lastLogin = new Date();
  await user.save();

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
        website: user.website,
        socialLinks: user.socialLinks,
        avatarUrl: user.avatarUrl,
        portfolioSlug: user.portfolioSlug,
        templatePreference: user.templatePreference
      },
      accessToken,
      refreshToken
    }
  });
});

// @desc    Exchange a valid refresh token for a new access token
// @route   POST /api/auth/refresh
// @access  Public (requires valid refresh token)
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) {
    res.status(400);
    throw new Error('Refresh token is required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select(
      'name email headline bio location phone website socialLinks avatarUrl portfolioSlug templatePreference colorTheme'
    );
    if (!user) {
      res.status(401);
      throw new Error('User no longer exists');
    }
    const accessToken = generateAccessToken(user._id);
    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          headline: user.headline,
          bio: user.bio,
          location: user.location,
          phone: user.phone,
          website: user.website,
          socialLinks: user.socialLinks,
          avatarUrl: user.avatarUrl,
          portfolioSlug: user.portfolioSlug,
          templatePreference: user.templatePreference,
          colorTheme: user.colorTheme,
        },
      },
    });
  } catch (err) {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }
});

// @desc    Get the currently authenticated user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = { registerUser, loginUser, refreshToken, getMe, requestPasswordReset, verifyPasswordResetOtp, resetPassword };
