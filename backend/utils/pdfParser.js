const pdfParseModule = require('pdf-parse');

/**
 * Supports different pdf-parse export styles.
 * This avoids:
 * "pdfParse is not a function"
 */
const getPdfParser = () => {
  if (typeof pdfParseModule === 'function') {
    return pdfParseModule;
  }

  if (typeof pdfParseModule.default === 'function') {
    return pdfParseModule.default;
  }

  if (typeof pdfParseModule.pdf === 'function') {
    return pdfParseModule.pdf;
  }

  throw new Error(
    'Unable to initialize PDF parser. Please check the installed pdf-parse version.'
  );
};

const parsePdf = async (buffer) => {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error('PDF input must be a Buffer.');
  }

  const parser = getPdfParser();

  const result = await parser(buffer);

  return {
    text: result?.text || '',
    pages: result?.numpages || result?.numPages || 0,
    info: result?.info || {},
  };
};

module.exports = {
  parsePdf,
};
