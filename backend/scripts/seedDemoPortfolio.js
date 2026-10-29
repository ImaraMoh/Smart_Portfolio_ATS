require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Volunteer = require('../models/Volunteer');
const JobDescription = require('../models/JobDescription');
const ATSResult = require('../models/ATSResult');

const EMAIL = 'imarabiz02@gmail.com';

async function upsertOnce(Model, filter, value) {
  const result = await Model.updateOne(
    filter,
    { $setOnInsert: value },
    { upsert: true, setDefaultsOnInsert: true }
  );
  return result.upsertedCount || 0;
}

async function main() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set.');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });

  const user = await User.findOne({ email: EMAIL }).select('_id name email');
  if (!user) throw new Error(`No account found for ${EMAIL}.`);

  const inserted = {
    Education: 0,
    Experience: 0,
    Skill: 0,
    Project: 0,
    Volunteer: 0,
    JobDescription: 0,
    ATSResult: 0,
  };
  const uid = user._id;

  const education = [
    {
      institution: 'Sample University', degree: 'BSc', fieldOfStudy: 'Information Technology',
      startYear: 2021, endYear: 2025, grade: 'Demo record',
      description: 'Sample education entry for previewing the portfolio layout.', order: 0,
    },
    {
      institution: 'Sample Learning Institute', degree: 'Certificate', fieldOfStudy: 'User Experience Design',
      startYear: 2024, endYear: 2024, grade: 'Demo record',
      description: 'Sample certificate entry for preview purposes.', order: 1,
    },
  ];
  for (const item of education) {
    inserted.Education += await upsertOnce(Education, {
      userId: uid, institution: item.institution, degree: item.degree, fieldOfStudy: item.fieldOfStudy,
    }, { userId: uid, ...item });
  }

  const experiences = [
    {
      company: 'Sample Digital Studio', role: 'Full Stack Developer (Sample)', location: 'Colombo, Sri Lanka',
      employmentType: 'internship', startDate: new Date('2024-06-01'), endDate: new Date('2024-09-01'),
      isCurrent: false, description: 'Sample experience for portfolio preview. Built responsive web interfaces and REST API integrations as part of a demonstration project.',
      technologies: ['React', 'Node.js', 'MongoDB'], order: 0,
    },
    {
      company: 'Portfolio Lab (Sample)', role: 'UI Developer (Sample)', location: 'Remote',
      employmentType: 'part-time', startDate: new Date('2023-10-01'), endDate: new Date('2024-03-01'),
      isCurrent: false, description: 'Sample experience entry demonstrating how role details and achievements appear in the portfolio.',
      technologies: ['JavaScript', 'Tailwind CSS', 'Figma'], order: 1,
    },
  ];
  for (const item of experiences) {
    inserted.Experience += await upsertOnce(Experience, {
      userId: uid, company: item.company, role: item.role,
    }, { userId: uid, ...item });
  }

  const skills = [
    ['JavaScript', 'technical', 'advanced'], ['React', 'technical', 'advanced'],
    ['Node.js', 'technical', 'intermediate'], ['MongoDB', 'technical', 'intermediate'],
    ['REST API Design', 'technical', 'intermediate'], ['Figma', 'tool', 'intermediate'],
    ['Communication', 'soft', 'advanced'], ['English', 'language', 'advanced'],
  ];
  for (const [skillName, category, proficiencyLevel] of skills) {
    inserted.Skill += await upsertOnce(Skill, { userId: uid, skillName }, {
      userId: uid, skillName, category, proficiencyLevel,
    });
  }

  const projects = [
    {
      title: 'Sample Smart Portfolio', description: 'A sample portfolio project that brings profile data together in a responsive, recruiter-friendly experience. Demo content for preview only.',
      technologies: ['React', 'Node.js', 'MongoDB'], repoURL: '', liveURL: '', thumbnailURL: '',
      startDate: new Date('2024-07-01'), endDate: new Date('2024-10-01'), featured: true, order: 0,
    },
    {
      title: 'Sample Task Manager', description: 'A sample full-stack task manager showcasing CRUD workflows, clean UI states, and REST API integration.',
      technologies: ['React', 'Express', 'MongoDB'], repoURL: '', liveURL: '', thumbnailURL: '',
      startDate: new Date('2024-02-01'), endDate: new Date('2024-04-01'), featured: true, order: 1,
    },
    {
      title: 'Sample Design System', description: 'A small component library concept with reusable buttons, form controls, and responsive layouts.',
      technologies: ['Figma', 'Tailwind CSS'], repoURL: '', liveURL: '', thumbnailURL: '',
      startDate: new Date('2023-11-01'), endDate: new Date('2024-01-01'), featured: false, order: 2,
    },
  ];
  for (const item of projects) {
    inserted.Project += await upsertOnce(Project, { userId: uid, title: item.title }, { userId: uid, ...item });
  }

  const volunteer = {
    organization: 'Community Tech Initiative (Sample)', role: 'Volunteer Mentor (Sample)',
    startDate: new Date('2023-08-01'), endDate: new Date('2024-02-01'), isCurrent: false,
    description: 'Sample volunteering entry for previewing community impact and leadership sections.', order: 0,
  };
  inserted.Volunteer += await upsertOnce(Volunteer, {
    userId: uid, organization: volunteer.organization, role: volunteer.role,
  }, { userId: uid, ...volunteer });

  const jobTitle = 'Sample Frontend Engineer';
  const company = 'Example Technology Co. (Sample)';
  let jobDescription = await JobDescription.findOne({ userId: uid, jobTitle, company });
  if (!jobDescription) {
    jobDescription = await JobDescription.create({
      userId: uid, jobTitle, company,
      rawText: 'Sample job description for ATS preview. Seeking a frontend engineer with experience in JavaScript, React, responsive design, accessibility, REST APIs, testing, Git, and collaborative problem solving. This is demonstration content only.',
      submittedAt: new Date('2024-10-10'),
    });
    inserted.JobDescription = 1;
  }
  inserted.ATSResult += await upsertOnce(ATSResult, { userId: uid, jobDescriptionId: jobDescription._id }, {
    userId: uid,
    jobDescriptionId: jobDescription._id,
    score: 78,
    matchedKeywords: ['JavaScript', 'React', 'REST APIs', 'responsive design', 'Git'],
    missingKeywords: ['accessibility testing', 'automated testing'],
    suggestions: [
      'Add a sample accessibility project or accomplishment to strengthen this preview score.',
      'Include examples of automated testing experience where applicable.',
    ],
    resumeSnapshot: 'DEMO PREVIEW DATA. Sample frontend developer profile with React, JavaScript, REST API, responsive interface, and Git experience.',
    computedAt: new Date('2024-10-10'),
  });

  const counts = {};
  for (const [name, Model] of Object.entries({ Education, Experience, Skill, Project, Volunteer, JobDescription, ATSResult })) {
    counts[name] = await Model.countDocuments({ userId: uid });
  }
  console.log(JSON.stringify({ user: user.name, insertedThisRun: inserted, totalsForUser: counts }, null, 2));
}

main()
  .catch((error) => {
    console.error(`${error.name}: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
