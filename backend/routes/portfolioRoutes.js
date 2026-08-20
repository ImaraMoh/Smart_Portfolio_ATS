const express = require('express');

const { protect } = require('../middleware/auth');

const {
  getMyPortfolio,
  regenerateMyPortfolio,
  setTemplate,
  setColorTheme,
  getPublicPortfolio,
} = require('../controllers/portfolioController');

const router = express.Router();

/* ============================================================
   PUBLIC PORTFOLIO
============================================================ */

router.get(
  '/p/:slug',
  getPublicPortfolio
);

/* ============================================================
   PROTECTED PORTFOLIO ROUTES
============================================================ */

router.use(protect);

/* Get current user's portfolio */
router.get(
  '/me',
  getMyPortfolio
);

/* Regenerate portfolio */
router.post(
  '/regenerate',
  regenerateMyPortfolio
);

/* Change template */
router.put(
  '/template',
  setTemplate
);

/* Change color theme */
router.put(
  '/color-theme',
  setColorTheme
);

module.exports = router;
