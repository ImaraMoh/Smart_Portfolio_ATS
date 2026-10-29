const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { generateUniqueSlug } = require('../utils/slugify');

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
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error('User no longer exists');
    }
    const accessToken = generateAccessToken(user._id);
    res.json({ success: true, data: { accessToken } });
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

module.exports = { registerUser, loginUser, refreshToken, getMe };
