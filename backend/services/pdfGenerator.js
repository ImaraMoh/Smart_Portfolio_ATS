/**
 * pdfGenerator
 * ------------
 * Renders the ATS-friendly resume EJS template with the user's live career
 * data, then uses Puppeteer (headless Chromium) to export a pixel-accurate,
 * text-selectable PDF. Result is cached on disk and invalidated by
 * syncService on any data change.
 */
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const { getFullProfile } = require('./careerDataService');

const TEMPLATE_PATH = path.join(__dirname, '..', 'templates', 'resume', 'ats-resume.ejs');
const OUTPUT_DIR = path.join(__dirname, '..', 'generated', 'resume');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

let sharedBrowser = null;
const getBrowser = async () => {
  if (!sharedBrowser) {
    sharedBrowser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return sharedBrowser;
};

const generateResumePDF = async (userId, { force = false } = {}) => {
  ensureDir(OUTPUT_DIR);
  const cachedPath = path.join(OUTPUT_DIR, `${userId}.pdf`);

  if (!force && fs.existsSync(cachedPath)) {
    return { filePath: cachedPath, fromCache: true };
  }

  const profile = await getFullProfile(userId);
  const html = await ejs.renderFile(TEMPLATE_PATH, profile);

  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: cachedPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
  } finally {
    await page.close();
  }

  return { filePath: cachedPath, fromCache: false };
};

const closeBrowser = async () => {
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
};

module.exports = { generateResumePDF, closeBrowser };
