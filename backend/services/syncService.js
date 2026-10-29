/**
 * syncService
 * -----------
 * Called after any create/update/delete on a user's career data (education,
 * experience, skills, projects, volunteering) or profile. It invalidates the
 * cached portfolio HTML and resume PDF so the next request regenerates them,
 * and eagerly (fire-and-forget) triggers regeneration so both outputs are
 * "warm" almost immediately after an edit. This is what satisfies the
 * project's "automatic synchronization" requirement.
 */
const fs = require('fs');
const path = require('path');

const PORTFOLIO_DIR = path.join(__dirname, '..', 'generated', 'portfolio');
const RESUME_DIR = path.join(__dirname, '..', 'generated', 'resume');

const invalidateCache = async (userId) => {
  try {
    const resumeFile = path.join(RESUME_DIR, `${userId}.pdf`);
    if (fs.existsSync(PORTFOLIO_DIR)) {
      for (const file of fs.readdirSync(PORTFOLIO_DIR)) {
        if (file.startsWith(`${userId}-`) && file.endsWith('.html')) {
          fs.unlinkSync(path.join(PORTFOLIO_DIR, file));
        }
      }
    }
    const legacyPortfolioFile = path.join(PORTFOLIO_DIR, `${userId}.html`);
    if (fs.existsSync(legacyPortfolioFile)) fs.unlinkSync(legacyPortfolioFile);
    if (fs.existsSync(resumeFile)) fs.unlinkSync(resumeFile);
  } catch (err) {
    console.error(`Cache invalidation failed for user ${userId}:`, err.message);
  }
};

// Fire-and-forget regeneration; failures are logged, never thrown back to the
// original CRUD request so an edit never fails because rendering hiccuped.
const triggerRegeneration = (userId) => {
  setImmediate(async () => {
    try {
      const { generatePortfolio } = require('./portfolioGenerator');
      const { generateResumePDF } = require('./pdfGenerator');
      await generatePortfolio(userId);
      await generateResumePDF(userId);
    } catch (err) {
      console.error(`Background regeneration failed for user ${userId}:`, err.message);
    }
  });
};

// Single entry point CRUD routes call after mutating a user's data.
const syncUserOutputs = async (userId) => {
  await invalidateCache(userId);
  triggerRegeneration(userId);
};

module.exports = { syncUserOutputs, invalidateCache, triggerRegeneration };
