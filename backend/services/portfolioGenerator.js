/**
 * portfolioGenerator
 * -------------------
 * Generates a user's portfolio using:
 *
 * 1. Selected portfolio template
 * 2. Selected color theme
 * 3. Live career/profile data
 *
 * The generated HTML is cached as a static file.
 *
 * Available Templates:
 * - minimalist
 * - modern
 * - creative
 * - tech-dark
 * - executive
 * - neo-brutalist
 * - ai-studio
 *
 * Available Color Themes:
 * - midnight
 * - ocean
 * - emerald
 * - royal
 * - rose
 * - amber
 */

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const { getFullProfile } = require('./careerDataService');

/*
|--------------------------------------------------------------------------
| Directories
|--------------------------------------------------------------------------
*/

const TEMPLATE_DIR = path.join(
  __dirname,
  '..',
  'templates',
  'portfolio'
);

const OUTPUT_DIR = path.join(
  __dirname,
  '..',
  'generated',
  'portfolio'
);

/*
|--------------------------------------------------------------------------
| Portfolio Template Map
|--------------------------------------------------------------------------
*/

const TEMPLATE_MAP = {
  minimalist: 'minimalist.ejs',
  modern: 'modern.ejs',
  creative: 'creative.ejs',
  'tech-dark': 'tech-dark.ejs',
  executive: 'executive.ejs',
  'neo-brutalist': 'neo-brutalist.ejs',
  'ai-studio': 'ai-studio.ejs',
};

/*
|--------------------------------------------------------------------------
| Color Theme Configuration
|--------------------------------------------------------------------------
|
| IMPORTANT:
| These values are passed directly into every EJS template.
|
| Example inside an EJS template:
|
| --primary: <%= theme.primary %>;
| --accent: <%= theme.accent %>;
|
*/

const COLOR_THEMES = {
  midnight: {
    name: 'Midnight',
    primary: '#0B1220',
    accent: '#D4AF37',
    background: '#F8FAFC',
    text: '#111827',
    surface: '#FFFFFF',
    muted: '#64748B',
    border: '#E2E8F0',
    softAccent: '#F4F0E5',
  },

  ocean: {
    name: 'Ocean',
    primary: '#0F3D56',
    accent: '#20C4CB',
    background: '#F4FAFC',
    text: '#102A43',
    surface: '#FFFFFF',
    muted: '#547080',
    border: '#D8E7EC',
    softAccent: '#E7F6F6',
  },

  emerald: {
    name: 'Emerald',
    primary: '#123C35',
    accent: '#2BB673',
    background: '#F5FAF8',
    text: '#17201D',
    surface: '#FFFFFF',
    muted: '#5C7267',
    border: '#DCE8E1',
    softAccent: '#E6F3EC',
  },

  royal: {
    name: 'Royal',
    primary: '#24144D',
    accent: '#8B5CF6',
    background: '#FAF8FF',
    text: '#18122B',
    surface: '#FFFFFF',
    muted: '#6F6685',
    border: '#E6E0F2',
    softAccent: '#F0EAFE',
  },

  rose: {
    name: 'Rose',
    primary: '#4A1725',
    accent: '#F43F5E',
    background: '#FFF7F8',
    text: '#26151A',
    surface: '#FFFFFF',
    muted: '#80636B',
    border: '#EEDFE2',
    softAccent: '#FCEBED',
  },

  amber: {
    name: 'Amber',
    primary: '#3D2A0A',
    accent: '#F59E0B',
    background: '#FFFBF2',
    text: '#241A0A',
    surface: '#FFFFFF',
    muted: '#766A53',
    border: '#EAE2D2',
    softAccent: '#F8F0DD',
  },
};

/*
|--------------------------------------------------------------------------
| Defaults
|--------------------------------------------------------------------------
*/

const DEFAULT_TEMPLATE = 'modern';
const DEFAULT_THEME = 'midnight';
const DESIGN_VERSION = 'template-refresh-v28';
const PREMIUM_EFFECTS_CSS = fs.readFileSync(
  path.join(TEMPLATE_DIR, 'premium-effects.css'),
  'utf-8'
);


/*
|--------------------------------------------------------------------------
| Ensure Directory Exists
|--------------------------------------------------------------------------
*/

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Resolve Template
|--------------------------------------------------------------------------
*/

const resolveTemplate = (templatePreference) => {
  if (
    templatePreference &&
    Object.prototype.hasOwnProperty.call(
      TEMPLATE_MAP,
      templatePreference
    )
  ) {
    return templatePreference;
  }

  return DEFAULT_TEMPLATE;
};

/*
|--------------------------------------------------------------------------
| Resolve Color Theme
|--------------------------------------------------------------------------
*/

const resolveColorTheme = (colorTheme) => {
  if (
    colorTheme &&
    Object.prototype.hasOwnProperty.call(
      COLOR_THEMES,
      colorTheme
    )
  ) {
    return colorTheme;
  }

  return DEFAULT_THEME;
};

/*
|--------------------------------------------------------------------------
| Generate Portfolio
|--------------------------------------------------------------------------
*/

const generatePortfolio = async (
  userId,
  { force = false } = {}
) => {
  ensureDir(OUTPUT_DIR);

  /*
  |--------------------------------------------------------------------------
  | Load Complete Profile
  |--------------------------------------------------------------------------
  */

  const profile = await getFullProfile(userId);

  if (!profile || !profile.user) {
    throw new Error(
      'Unable to generate portfolio: user profile not found'
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Resolve Template
  |--------------------------------------------------------------------------
  */

  const selectedTemplate = resolveTemplate(
    profile.user.templatePreference
  );

  /*
  |--------------------------------------------------------------------------
  | Resolve Theme
  |--------------------------------------------------------------------------
  */

  const selectedTheme = resolveColorTheme(
    profile.user.colorTheme
  );

  const theme = COLOR_THEMES[selectedTheme];

  /*
  |--------------------------------------------------------------------------
  | Resolve Template File
  |--------------------------------------------------------------------------
  */

  const templateFile =
    TEMPLATE_MAP[selectedTemplate];

  const templatePath = path.join(
    TEMPLATE_DIR,
    templateFile
  );

  /*
  |--------------------------------------------------------------------------
  | Validate Template
  |--------------------------------------------------------------------------
  */

  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Portfolio template not found: ${templateFile}`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Cache
  |--------------------------------------------------------------------------
  |
  | Cache is separated by:
  |
  | user + template + theme
  |
  | Example:
  |
  | 123-modern-midnight.html
  | 123-modern-ocean.html
  | 123-tech-dark-royal.html
  |
  */

  const cacheKey =
    `${userId}-${selectedTemplate}-${selectedTheme}-${DESIGN_VERSION}`;

  const cachedPath = path.join(
    OUTPUT_DIR,
    `${cacheKey}.html`
  );

  /*
  |--------------------------------------------------------------------------
  | Return Cached HTML
  |--------------------------------------------------------------------------
  */

  if (
    !force &&
    fs.existsSync(cachedPath)
  ) {
    return {
      html: fs.readFileSync(
        cachedPath,
        'utf-8'
      ),

      fromCache: true,

      templatePreference:
        selectedTemplate,

      colorTheme:
        selectedTheme,

      theme,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Render Template
  |--------------------------------------------------------------------------
  */

  let html = await ejs.renderFile(
    templatePath,
    {
      /*
      |----------------------------------------------------------------------
      | Complete Profile
      |----------------------------------------------------------------------
      */

      ...profile,

      /*
      |----------------------------------------------------------------------
      | Template
      |----------------------------------------------------------------------
      */

      templatePreference:
        selectedTemplate,

      /*
      |----------------------------------------------------------------------
      | Theme
      |----------------------------------------------------------------------
      */

      colorTheme:
        selectedTheme,

      theme,

      /*
      |----------------------------------------------------------------------
      | Convenient Color Variables
      |----------------------------------------------------------------------
      */

      primaryColor:
        theme.primary,

      accentColor:
        theme.accent,

      backgroundColor:
        theme.background,

      surfaceColor:
        theme.surface,

      textColor:
        theme.text,

      mutedColor:
        theme.muted,

      borderColor:
        theme.border,

      softAccentColor:
        theme.softAccent,

      /*
      |----------------------------------------------------------------------
      | Portfolio Metadata
      |----------------------------------------------------------------------
      */

      updatedAt:
        new Date().toLocaleString(
          'en-US',
          {
            dateStyle: 'medium',
            timeStyle: 'short',
          }
        ),
    }
  );

  html = html
    .replace('</head>', `  <style>${PREMIUM_EFFECTS_CSS}</style>\n</head>`)
    .replace(/<body([^>]*)>/i, `<body$1 data-portfolio-template="${selectedTemplate}">`)
    .replace('</body>', '  <script src="/portfolio-effects.js" defer></script>\n</body>');


  if (profile.user.avatarUrl) {
    const safeAvatarUrl = String(profile.user.avatarUrl).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char]);
    html = html.replace('</body>', `  <style>.portfolio-profile-photo{position:absolute;z-index:20;top:82px;right:clamp(22px,7vw,100px);width:clamp(74px,10vw,124px);height:clamp(74px,10vw,124px);object-fit:cover;border-radius:50%;border:3px solid var(--accent,#d4af37);box-shadow:0 12px 36px #0003;background:var(--surface,#fff)}@media(max-width:600px){.portfolio-profile-photo{top:76px;right:20px;width:64px;height:64px}}</style>\n  <img class="portfolio-profile-photo" src="${safeAvatarUrl}" alt="${String(profile.user.name).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])} profile photo">\n</body>`);
  }

  /*
  |--------------------------------------------------------------------------
  | Save Generated Portfolio
  |--------------------------------------------------------------------------
  */

  fs.writeFileSync(
    cachedPath,
    html,
    'utf-8'
  );

  /*
  |--------------------------------------------------------------------------
  | Return
  |--------------------------------------------------------------------------
  */

  return {
    html,

    fromCache: false,

    templatePreference:
      selectedTemplate,

    colorTheme:
      selectedTheme,

    theme,
  };
};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  generatePortfolio,
  TEMPLATE_MAP,
  COLOR_THEMES,
  DEFAULT_TEMPLATE,
  DEFAULT_THEME,
};

