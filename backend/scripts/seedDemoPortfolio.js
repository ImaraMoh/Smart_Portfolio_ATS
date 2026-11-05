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

  await User.updateOne({ _id: user._id }, {
    $set: {
      headline: 'Full-stack developer building thoughtful digital products',
      bio: 'A product-minded developer who enjoys turning complex problems into clear, useful experiences. I work across the stack, collaborate closely with designers and teams, and keep learning through hands-on projects.',
      location: 'Colombo, Sri Lanka',
      phone: '+94 77 000 0000',
      website: 'https://example.com',
      socialLinks: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://www.linkedin.com/in/your-profile/',
        twitter: 'https://x.com/yourusername',
      },
      templatePreference: 'modern',
      colorTheme: 'midnight',
    }
  });

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
    {
      institution: 'Open Learning Academy', degree: 'Professional Certificate', fieldOfStudy: 'Cloud Application Development',
      startYear: 2023, endYear: 2023, grade: 'Demo record',
      description: 'Completed a practical program covering cloud fundamentals, deployment workflows, and secure application delivery.', order: 2,
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
    {
      company: 'Northstar Labs (Sample)', role: 'Software Engineering Intern (Sample)', location: 'Colombo, Sri Lanka',
      employmentType: 'internship', startDate: new Date('2023-05-01'), endDate: new Date('2023-08-01'),
      isCurrent: false, description: 'Contributed to internal tools, wrote reusable interface components, and worked with a small team to review and ship improvements in short development cycles.',
      technologies: ['TypeScript', 'React', 'Git', 'Jest'], order: 2,
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
    ['Git', 'tool', 'advanced'], ['SQL', 'technical', 'intermediate'],
    ['Problem Solving', 'soft', 'advanced'], ['Sinhala', 'language', 'advanced'],
  ];
  for (const [skillName, category, proficiencyLevel] of skills) {
    inserted.Skill += await upsertOnce(Skill, { userId: uid, skillName }, {
      userId: uid, skillName, category, proficiencyLevel,
    });
  }

  const projects = [
    {
      title: 'Folio Demo Portfolio', description: 'A sample portfolio project that brings profile data together in a responsive, recruiter-friendly experience. Demo content for preview only.',
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

  const volunteer = [
    {
      organization: 'Community Tech Initiative (Sample)', role: 'Volunteer Mentor (Sample)',
      startDate: new Date('2024-01-01'), endDate: new Date('2024-08-01'), isCurrent: false,
      description: 'Mentored students through introductory web projects, helped them break tasks into manageable steps, and reviewed their project presentations.', order: 0,
    },
    {
      organization: 'Colombo Digital Literacy Network (Sample)', role: 'Digital Skills Volunteer (Sample)',
      startDate: new Date('2023-03-01'), endDate: new Date('2023-11-01'), isCurrent: false,
      description: 'Supported community workshops covering online safety, productivity tools, and practical digital skills for first-time technology users.', order: 1,
    },
    {
      organization: 'Open Source Sri Lanka (Sample)', role: 'Community Contributor (Sample)',
      startDate: new Date('2022-09-01'), endDate: new Date('2023-02-01'), isCurrent: false,
      description: 'Helped organize beginner-friendly contribution sessions and documentation sprints for local open-source projects.', order: 2,
    },
    {
      organization: 'Code for Community Colombo (Sample)', role: 'Web Workshop Facilitator (Sample)',
      startDate: new Date('2022-04-01'), endDate: new Date('2022-10-01'), isCurrent: false,
      description: 'Prepared and led introductory web development sessions, guiding participants through HTML, CSS, and JavaScript exercises.', order: 3,
    },
    {
      organization: 'Island Green Initiative (Sample)', role: 'Digital Outreach Volunteer (Sample)',
      startDate: new Date('2021-09-01'), endDate: new Date('2022-03-01'), isCurrent: false,
      description: 'Created digital campaign materials and helped coordinate community events focused on local environmental projects.', order: 4,
    },
    {
      organization: 'University Peer Learning Society (Sample)', role: 'Peer Tutor (Sample)',
      startDate: new Date('2021-02-01'), endDate: new Date('2021-08-01'), isCurrent: false,
      description: 'Supported first-year students with programming fundamentals, study planning, and collaborative problem-solving sessions.', order: 5,
    },
  ];
  for (const item of volunteer) {
    inserted.Volunteer += await upsertOnce(Volunteer, {
      userId: uid, organization: item.organization, role: item.role,
    }, { userId: uid, ...item });
  }

  const atsPreviews = [
    {
      jobTitle: 'Frontend Engineer (Sample)', company: 'Example Technology Co. (Sample)', submittedAt: new Date('2026-10-10'), score: 78,
      rawText: 'Sample frontend engineer role. Build accessible responsive web experiences using JavaScript, TypeScript, React, REST APIs, testing, Git, and collaborative problem solving. Work with product and design partners to ship reliable user-facing features.',
      matchedKeywords: ['JavaScript', 'React', 'REST APIs', 'responsive design', 'Git'], missingKeywords: ['accessibility testing', 'automated testing'],
      suggestions: ['Add a concrete accessibility improvement to a project description.', 'Include examples of automated tests and the tools used.'],
      resumeSnapshot: 'DEMO PREVIEW DATA. Sample frontend developer profile with React, JavaScript, REST API, responsive interface, and Git experience.',
    },
    {
      jobTitle: 'Full-stack Developer (Sample)', company: 'Harbor Digital (Sample)', submittedAt: new Date('2026-09-18'), score: 84,
      rawText: 'Sample full-stack developer position. Develop and maintain web applications with React, Node.js, Express, MongoDB, REST APIs, SQL, automated testing, and cloud deployment. Collaborate in an Agile team and take features from planning through production.',
      matchedKeywords: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Agile'], missingKeywords: ['cloud deployment', 'automated testing'],
      suggestions: ['Highlight a deployment workflow or cloud platform in your experience.', 'Add a testing example that demonstrates reliability and regression prevention.'],
      resumeSnapshot: 'DEMO PREVIEW DATA. Sample full-stack profile with React, Node.js, Express, MongoDB, REST APIs, SQL, and collaborative delivery experience.',
    },
    {
      jobTitle: 'Product UI Engineer (Sample)', company: 'Northstar Labs (Sample)', submittedAt: new Date('2026-08-22'), score: 72,
      rawText: 'Sample product UI engineer role. Partner with design to build polished interfaces using TypeScript, React, CSS, accessibility standards, design systems, Figma handoff, component testing, and performance optimization.',
      matchedKeywords: ['TypeScript', 'React', 'CSS', 'Figma', 'design systems'], missingKeywords: ['accessibility standards', 'performance optimization'],
      suggestions: ['Describe how you use semantic HTML, keyboard navigation, or accessibility checks.', 'Add a measurable interface performance improvement if you have one.'],
      resumeSnapshot: 'DEMO PREVIEW DATA. Sample UI-focused developer profile with React, TypeScript, JavaScript, Figma, reusable components, and responsive layouts.',
    },
  ];

  for (const preview of atsPreviews) {
    let jobDescription = await JobDescription.findOne({
      userId: uid, jobTitle: preview.jobTitle, company: preview.company,
    });
    if (!jobDescription) {
      jobDescription = await JobDescription.create({
        userId: uid,
        jobTitle: preview.jobTitle,
        company: preview.company,
        rawText: preview.rawText,
        submittedAt: preview.submittedAt,
      });
      inserted.JobDescription += 1;
    }
    inserted.ATSResult += await upsertOnce(ATSResult, { userId: uid, jobDescriptionId: jobDescription._id }, {
      userId: uid,
      jobDescriptionId: jobDescription._id,
      score: preview.score,
      matchedKeywords: preview.matchedKeywords,
      missingKeywords: preview.missingKeywords,
      suggestions: preview.suggestions,
      resumeSnapshot: preview.resumeSnapshot,
      computedAt: preview.submittedAt,
    });
  }

  const { invalidateCache } = require('../services/syncService');
  await invalidateCache(uid);

  const counts = {};
  for (const [name, Model] of Object.entries({ Education, Experience, Skill, Project, Volunteer, JobDescription, ATSResult })) {
    counts[name] = await Model.countDocuments({ userId: uid });
  }
  console.log(JSON.stringify({ user: user.name, profileSettingsUpdated: true, insertedThisRun: inserted, totalsForUser: counts }, null, 2));
}

main()
  .catch((error) => {
    console.error(`${error.name}: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
