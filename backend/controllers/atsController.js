const asyncHandler = require('express-async-handler');
const JobDescription = require('../models/JobDescription');
const ATSResult = require('../models/ATSResult');
const { scoreAgainstJobDescription } = require('../services/atsService');

// @desc    Submit a job description and get a real-time ATS score against
//          the logged-in user's current resume/profile data.
// @route   POST /api/ats/score
// @access  Private
const scoreResume = asyncHandler(async (req, res) => {
  const { jobTitle, company, jobDescriptionText } = req.body;

  if (!jobDescriptionText || jobDescriptionText.trim().length < 30) {
    res.status(400);
    throw new Error('Please provide a job description of at least 30 characters');
  }

  const jobDescription = await JobDescription.create({
    userId: req.user.id,
    jobTitle: jobTitle || '',
    company: company || '',
    rawText: jobDescriptionText
  });

  const result = await scoreAgainstJobDescription(req.user.id, jobDescriptionText);

  const atsResult = await ATSResult.create({
    userId: req.user.id,
    jobDescriptionId: jobDescription._id,
    score: result.score,
    matchedKeywords: result.matchedKeywords,
    missingKeywords: result.missingKeywords,
    suggestions: result.suggestions,
    resumeSnapshot: result.resumeSnapshot
  });

  res.status(201).json({
    success: true,
    message: 'ATS score computed',
    data: {
      score: atsResult.score,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords,
      suggestions: atsResult.suggestions,
      jobDescriptionId: jobDescription._id,
      computedAt: atsResult.computedAt
    }
  });
});

// @desc    List the logged-in user's past ATS scoring results
// @route   GET /api/ats/history
// @access  Private
const getHistory = asyncHandler(async (req, res) => {
  const results = await ATSResult.find({ userId: req.user.id })
    .sort({ computedAt: -1 })
    .limit(25)
    .populate('jobDescriptionId', 'jobTitle company submittedAt');

  res.json({ success: true, count: results.length, data: results });
});

module.exports = { scoreResume, getHistory };
