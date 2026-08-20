const asyncHandler = require('express-async-handler');
const { generateResumePDF } = require('../services/pdfGenerator');
const { PDFParse } = require('pdf-parse');

/* ============================================================
   DOWNLOAD GENERATED RESUME
   GET /api/resume/download
   Private
============================================================ */

const downloadResume = asyncHandler(async (req, res) => {
  const { filePath } = await generateResumePDF(req.user.id);

  const safeName = (req.user.name || 'User')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '');

  res.download(
    filePath,
    `${safeName}_Resume.pdf`
  );
});

/* ============================================================
   FORCE REGENERATE RESUME
   POST /api/resume/regenerate
   Private
============================================================ */

const regenerateResume = asyncHandler(async (req, res) => {
  const { filePath } = await generateResumePDF(
    req.user.id,
    { force: true }
  );

  res.json({
    success: true,
    message: 'Resume regenerated successfully',
    data: {
      filePath: `/cache/resumes/${req.user.id}.pdf`,
    },
  });
});

/* ============================================================
   ANALYZE UPLOADED RESUME
   POST /api/resume/analyze
   Private

   Uses pdf-parse v2 API.
============================================================ */

const analyzeResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a PDF resume',
    });
  }

  /* ----------------------------------------------------------
     Validate file type
  ---------------------------------------------------------- */

  const isPDF =
    req.file.mimetype === 'application/pdf' ||
    req.file.originalname
      ?.toLowerCase()
      .endsWith('.pdf');

  if (!isPDF) {
    return res.status(400).json({
      success: false,
      message: 'Only PDF files are supported',
    });
  }

  /* ----------------------------------------------------------
     Parse PDF using pdf-parse v2
  ---------------------------------------------------------- */

  let parser;

  try {
    parser = new PDFParse({
      data: req.file.buffer,
    });

    const pdf = await parser.getText();

    const text = pdf.text || '';

    const normalizedText = text
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    /* ========================================================
       DETECT RESUME SECTIONS
    ======================================================== */

    const sectionPatterns = [
      {
        name: 'Contact Information',
        patterns: [
          'email',
          'phone',
          'mobile',
          'linkedin',
          'github',
          'contact',
        ],
      },

      {
        name: 'Professional Summary',
        patterns: [
          'summary',
          'professional summary',
          'profile',
          'objective',
          'career objective',
          'about me',
        ],
      },

      {
        name: 'Education',
        patterns: [
          'education',
          'academic',
          'academic background',
          'university',
          'college',
          'degree',
          'bachelor',
          'master',
        ],
      },

      {
        name: 'Experience',
        patterns: [
          'experience',
          'work experience',
          'professional experience',
          'employment',
          'employment history',
          'work history',
          'internship',
        ],
      },

      {
        name: 'Skills',
        patterns: [
          'skills',
          'technical skills',
          'core skills',
          'technologies',
          'technical expertise',
          'competencies',
        ],
      },

      {
        name: 'Projects',
        patterns: [
          'projects',
          'project experience',
          'academic projects',
          'personal projects',
        ],
      },

      {
        name: 'Certifications',
        patterns: [
          'certifications',
          'certificates',
          'professional certifications',
          'courses',
        ],
      },

      {
        name: 'Volunteering',
        patterns: [
          'volunteer',
          'volunteering',
          'community',
          'community service',
          'leadership',
        ],
      },

      {
        name: 'Achievements',
        patterns: [
          'achievements',
          'awards',
          'honors',
          'accomplishments',
        ],
      },

      {
        name: 'Languages',
        patterns: [
          'languages',
          'language proficiency',
        ],
      },

      {
        name: 'References',
        patterns: [
          'references',
          'referees',
        ],
      },
    ];

    const detectedSections = sectionPatterns
      .map((section) => {
        const matchedPattern = section.patterns.find(
          (pattern) =>
            normalizedText.includes(pattern)
        );

        return {
          name: section.name,
          detected: Boolean(matchedPattern),
          matchedKeyword: matchedPattern || null,
        };
      });

    /* ========================================================
       BASIC ATS CHECKS
    ======================================================== */

    const emailRegex =
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

    const phoneRegex =
      /(?:\+?\d[\d\s().-]{7,}\d)/;

    const checks = {
      hasEmail: emailRegex.test(text),

      hasPhone: phoneRegex.test(text),

      hasLinkedIn:
        normalizedText.includes('linkedin.com') ||
        normalizedText.includes('linkedin'),

      hasGithub:
        normalizedText.includes('github.com') ||
        normalizedText.includes('github'),

      hasExperience:
        sectionPatterns
          .find((s) => s.name === 'Experience')
          .patterns.some((p) =>
            normalizedText.includes(p)
          ),

      hasEducation:
        sectionPatterns
          .find((s) => s.name === 'Education')
          .patterns.some((p) =>
            normalizedText.includes(p)
          ),

      hasSkills:
        sectionPatterns
          .find((s) => s.name === 'Skills')
          .patterns.some((p) =>
            normalizedText.includes(p)
          ),

      hasProjects:
        sectionPatterns
          .find((s) => s.name === 'Projects')
          .patterns.some((p) =>
            normalizedText.includes(p)
          ),

      hasSummary:
        sectionPatterns
          .find((s) => s.name === 'Professional Summary')
          .patterns.some((p) =>
            normalizedText.includes(p)
          ),

      hasCertifications:
        sectionPatterns
          .find((s) => s.name === 'Certifications')
          .patterns.some((p) =>
            normalizedText.includes(p)
          ),
    };

    /* ========================================================
       ATS SCORE
    ======================================================== */

    const totalChecks = Object.keys(checks).length;

    const passedChecks =
      Object.values(checks).filter(Boolean).length;

    const score = Math.round(
      (passedChecks / totalChecks) * 100
    );

    /* ========================================================
       CONTENT QUALITY ANALYSIS
    ======================================================== */

    const words = text
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const wordCount = words.length;

    const characterCount = text.length;

    const hasEnoughContent = wordCount >= 150;

    const hasStrongStructure =
      detectedSections.filter(
        (section) => section.detected
      ).length >= 5;

    /* ========================================================
       ATS RECOMMENDATIONS
    ======================================================== */

    const recommendations = [];

    if (!checks.hasEmail) {
      recommendations.push(
        'Add a professional email address.'
      );
    }

    if (!checks.hasPhone) {
      recommendations.push(
        'Add a reachable phone number.'
      );
    }

    if (!checks.hasLinkedIn) {
      recommendations.push(
        'Add your LinkedIn profile URL.'
      );
    }

    if (!checks.hasGithub) {
      recommendations.push(
        'Consider adding your GitHub profile if relevant to your target role.'
      );
    }

    if (!checks.hasSummary) {
      recommendations.push(
        'Add a concise professional summary tailored to your target role.'
      );
    }

    if (!checks.hasExperience) {
      recommendations.push(
        'Add relevant professional or internship experience.'
      );
    }

    if (!checks.hasEducation) {
      recommendations.push(
        'Add your education details.'
      );
    }

    if (!checks.hasSkills) {
      recommendations.push(
        'Add a clearly labelled skills section with relevant technical skills.'
      );
    }

    if (!checks.hasProjects) {
      recommendations.push(
        'Add relevant projects with technologies and measurable outcomes.'
      );
    }

    if (!checks.hasCertifications) {
      recommendations.push(
        'Consider adding relevant certifications or professional courses.'
      );
    }

    if (!hasEnoughContent) {
      recommendations.push(
        'Your resume appears to contain limited content. Add more relevant achievements and experience.'
      );
    }

    /* ========================================================
       KEYWORD DETECTION
    ======================================================== */

    const technicalKeywords = [
      'javascript',
      'typescript',
      'react',
      'react native',
      'node.js',
      'node',
      'python',
      'java',
      'c++',
      'sql',
      'mysql',
      'postgresql',
      'mongodb',
      'firebase',
      'aws',
      'docker',
      'git',
      'github',
      'figma',
      'flutter',
      'laravel',
      'php',
      'tailwind',
    ];

    const detectedKeywords =
      technicalKeywords.filter((keyword) =>
        normalizedText.includes(keyword)
      );

    /* ========================================================
       FINAL RESPONSE
    ======================================================== */

    return res.json({
      success: true,

      data: {
        fileName: req.file.originalname,

        fileSize: req.file.size,

        pages: pdf.total
          ? pdf.total
          : pdf.numpages || null,

        characters: characterCount,

        words: wordCount,

        score,

        atsScore: score,

        checks,

        detectedSections,

        detectedKeywords,

        recommendations,

        quality: {
          hasEnoughContent,
          hasStrongStructure,
        },

        textPreview: text
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 1500),
      },
    });
  } finally {
    /*
      pdf-parse v2 creates parser resources.
      Always destroy the parser after processing.
    */

    if (parser) {
      try {
        await parser.destroy();
      } catch (destroyError) {
        console.error(
          'PDF parser cleanup error:',
          destroyError.message
        );
      }
    }
  }
});

/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  downloadResume,
  regenerateResume,
  analyzeResume,
};
