/**
 * atsService
 * ----------
 * Talks to the Python/Flask ML microservice which performs Sentence-
 * Transformer embedding + cosine similarity scoring. Keeps the HTTP
 * integration and error handling in one place.
 */
const axios = require('axios');
const { getFullProfile, profileToPlainText } = require('./careerDataService');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';

const scoreAgainstJobDescription = async (userId, jobDescriptionText) => {
  const profile = await getFullProfile(userId);
  const resumeText = profileToPlainText(profile);

  try {
    const { data } = await axios.post(
      `${ML_SERVICE_URL}/api/score`,
      { resume_text: resumeText, job_description: jobDescriptionText },
      { timeout: 15000 }
    );

    return {
      score: data.score,
      matchedKeywords: data.matched_keywords || [],
      missingKeywords: data.missing_keywords || [],
      suggestions: data.suggestions || [],
      resumeSnapshot: resumeText
    };
  } catch (err) {
    const reason = err.response?.data?.message || err.message;
    const wrapped = new Error(`ATS scoring service unavailable: ${reason}`);
    wrapped.statusCode = 503;
    throw wrapped;
  }
};

module.exports = { scoreAgainstJobDescription };
