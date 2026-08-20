const asyncHandler = require('express-async-handler');

const {
  syncUserOutputs,
} = require('../services/syncService');

const User = require('../models/User');

const {
  generatePortfolio,
  COLOR_THEMES,
  TEMPLATE_MAP,
} = require('../services/portfolioGenerator');


/* ============================================================
   CONSTANTS
============================================================ */

const ALLOWED_TEMPLATES = [
  'minimalist',
  'modern',
  'creative',
  'tech-dark',
  'executive',
  'neo-brutalist',
];

const ALLOWED_COLOR_THEMES = [
  'midnight',
  'ocean',
  'emerald',
  'royal',
  'rose',
  'amber',
];


/* ============================================================
   GET MY PORTFOLIO
============================================================ */

const getMyPortfolio = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    'templatePreference colorTheme portfolioSlug'
  );

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  /*
   * Protect against old/invalid database values.
   */

  let colorTheme = user.colorTheme;

  if (!ALLOWED_COLOR_THEMES.includes(colorTheme)) {
    colorTheme = 'midnight';

    await User.findByIdAndUpdate(
      user._id,
      {
        colorTheme: 'midnight',
      }
    );
  }

  let templatePreference = user.templatePreference;

  if (!ALLOWED_TEMPLATES.includes(templatePreference)) {
    templatePreference = 'modern';

    await User.findByIdAndUpdate(
      user._id,
      {
        templatePreference: 'modern',
      }
    );
  }

  /*
   * Generate portfolio using validated values.
   */

  const {
    html,
    fromCache,
  } = await generatePortfolio(user._id);

  res.json({
    success: true,

    data: {
      html,
      fromCache,

      publicUrl:
        `${process.env.PORTFOLIO_BASE_URL || '/p'}/${user.portfolioSlug}`,

      templatePreference,
      colorTheme,
    },
  });
});


/* ============================================================
   REGENERATE MY PORTFOLIO
============================================================ */

const regenerateMyPortfolio = asyncHandler(async (req, res) => {
  const {
    html,
    templatePreference,
    colorTheme,
  } = await generatePortfolio(
    req.user.id,
    {
      force: true,
    }
  );

  res.json({
    success: true,

    message: 'Portfolio regenerated',

    data: {
      html,
      templatePreference,
      colorTheme,
    },
  });
});


/* ============================================================
   SET TEMPLATE
============================================================ */

const setTemplate = asyncHandler(async (req, res) => {
  const {
    templatePreference,
  } = req.body;

  if (!ALLOWED_TEMPLATES.includes(templatePreference)) {
    res.status(400);

    throw new Error(
      `templatePreference must be one of: ${ALLOWED_TEMPLATES.join(', ')}`
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      templatePreference,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select(
    'templatePreference colorTheme portfolioSlug'
  );

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  /*
   * Regenerate after changing template.
   */

  const portfolio = await generatePortfolio(
    user._id,
    {
      force: true,
    }
  );

  res.json({
    success: true,

    message: 'Template updated successfully',

    data: {
      templatePreference:
        user.templatePreference,

      colorTheme:
        user.colorTheme,

      html:
        portfolio.html,

      publicUrl:
        `/api/portfolio/public/${user.portfolioSlug}`,
    },
  });
});


/* ============================================================
   SET COLOR THEME
============================================================ */

const setColorTheme = asyncHandler(async (req, res) => {
  const {
    colorTheme,
  } = req.body;

  if (!colorTheme) {
    res.status(400);

    throw new Error(
      'Color theme is required'
    );
  }

  if (!ALLOWED_COLOR_THEMES.includes(colorTheme)) {
    res.status(400);

    throw new Error(
      `Invalid color theme. Available themes: ${ALLOWED_COLOR_THEMES.join(', ')}`
    );
  }

  /*
   * Extra protection:
   * make sure the generator actually contains
   * the requested theme.
   */

  if (!COLOR_THEMES[colorTheme]) {
    res.status(400);

    throw new Error(
      `Color theme "${colorTheme}" is not configured in portfolioGenerator`
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      colorTheme,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select(
    'templatePreference colorTheme portfolioSlug'
  );

  if (!user) {
    res.status(404);

    throw new Error(
      'User not found'
    );
  }

  /*
   * Force regeneration so the new colors
   * immediately appear in the portfolio.
   */

  const portfolio =
    await generatePortfolio(
      user._id,
      {
        force: true,
      }
    );

  res.json({
    success: true,

    message:
      'Color theme updated successfully',

    data: {
      colorTheme:
        user.colorTheme,

      templatePreference:
        user.templatePreference,

      html:
        portfolio.html,

      publicUrl:
        `/api/portfolio/public/${user.portfolioSlug}`,
    },
  });
});


/* ============================================================
   GET PUBLIC PORTFOLIO
============================================================ */

const getPublicPortfolio = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    portfolioSlug: req.params.slug,
  });

  if (!user) {
    res.status(404);

    throw new Error(
      'Portfolio not found'
    );
  }

  /*
   * Validate old database values before generation.
   */

  if (!ALLOWED_COLOR_THEMES.includes(user.colorTheme)) {
    user.colorTheme = 'midnight';
    await user.save();
  }

  if (!ALLOWED_TEMPLATES.includes(user.templatePreference)) {
    user.templatePreference = 'modern';
    await user.save();
  }

  const {
    html,
  } = await generatePortfolio(
    user._id
  );

  res.set(
    'Content-Type',
    'text/html'
  );

  res.send(html);
});


/* ============================================================
   EXPORT
============================================================ */

module.exports = {
  getMyPortfolio,
  regenerateMyPortfolio,
  setTemplate,
  setColorTheme,
  getPublicPortfolio,
};
