/**
 * careerDataService
 * ------------------
 * Single source of truth for assembling a user's full career profile from
 * all collections. Both the portfolio generator and the resume generator
 * (and the ATS scoring flow, which needs resume plain text) call this so
 * there is exactly one place that defines "what a user's profile looks like".
 */
const User = require('../models/User');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Volunteer = require('../models/Volunteer');

const getFullProfile = async (userId) => {
  const [user, education, experience, skills, projects, volunteer] = await Promise.all([
    User.findById(userId),
    Education.find({ userId }).sort({ endYear: -1, startYear: -1 }),
    Experience.find({ userId }).sort({ isCurrent: -1, startDate: -1 }),
    Skill.find({ userId }).sort({ category: 1, order: 1 }),
    Project.find({ userId }).sort({ featured: -1, order: 1 }),
    Volunteer.find({ userId }).sort({ isCurrent: -1, startDate: -1 })
  ]);

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return { user, education, experience, skills, projects, volunteer };
};

/**
 * Flattens a full profile into plain text, used as (a) the text fed into the
 * Sentence-Transformer / cosine-similarity ATS scoring call, and (b) the
 * `resumeSnapshot` stored on ATSResult for auditability.
 */
const profileToPlainText = ({ user, education, experience, skills, projects, volunteer }) => {
  const lines = [];

  lines.push(user.name);
  if (user.headline) lines.push(user.headline);
  if (user.bio) lines.push(user.bio);

  if (experience.length) {
    lines.push('EXPERIENCE');
    experience.forEach((e) => {
      lines.push(`${e.role} at ${e.company}`);
      if (e.description) lines.push(e.description);
      if (e.technologies?.length) lines.push(`Technologies: ${e.technologies.join(', ')}`);
    });
  }

  if (projects.length) {
    lines.push('PROJECTS');
    projects.forEach((p) => {
      lines.push(p.title);
      if (p.description) lines.push(p.description);
      if (p.technologies?.length) lines.push(`Technologies: ${p.technologies.join(', ')}`);
    });
  }

  if (skills.length) {
    lines.push('SKILLS');
    lines.push(skills.map((s) => s.skillName).join(', '));
  }

  if (education.length) {
    lines.push('EDUCATION');
    education.forEach((ed) => {
      lines.push(`${ed.degree} in ${ed.fieldOfStudy || 'N/A'}, ${ed.institution}`);
    });
  }

  if (volunteer.length) {
    lines.push('VOLUNTEERING');
    volunteer.forEach((v) => {
      lines.push(`${v.role} at ${v.organization}`);
      if (v.description) lines.push(v.description);
    });
  }

  return lines.join('\n');
};

module.exports = { getFullProfile, profileToPlainText };
