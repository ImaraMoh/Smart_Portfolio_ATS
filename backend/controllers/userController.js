const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { syncUserOutputs } = require('../services/syncService');

// @desc    Update the logged-in user's profile fields
// @route   PUT /api/users/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    'name', 'headline', 'bio', 'location', 'phone', 'website',
    'socialLinks', 'templatePreference'
  ];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  });

  await syncUserOutputs(req.user.id);

  res.json({ success: true, message: 'Profile updated', data: user });
});

const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please choose a JPG, PNG, or WebP image');
  }

  const avatarUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const user = await User.findByIdAndUpdate(req.user.id, { avatarUrl }, {
    new: true,
    runValidators: true,
  });
  await syncUserOutputs(req.user.id);
  res.json({ success: true, message: 'Profile photo updated', data: user });
});

const removeAvatar = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { avatarUrl: '' }, { new: true });
  await syncUserOutputs(req.user.id);
  res.json({ success: true, message: 'Profile photo removed', data: user });
});

// @desc    Change the logged-in user's password
// @route   PUT /api/users/me/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+passwordHash');

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  const salt = await bcrypt.genSalt(12);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = { updateProfile, updateAvatar, removeAvatar, changePassword };
