import React from 'react';
import { Link } from 'react-router-dom';
import FolioBrand from '../components/common/FolioBrand.jsx';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, ChevronRight,
  Code2, FileCheck2, FileText, Globe2, GraduationCap, Layers3, LockKeyhole,
  Sparkles, Target, WandSparkles,
} from 'lucide-react';

const features = [
  { icon: Layers3, number: '01', title: 'One career profile', description: 'Bring your experience, education, projects, skills, and volunteering together in one organized dashboard.', color: 'gold' },
  { icon: Globe2, number: '02', title: 'A portfolio that stays fresh', description: 'Turn your profile into a polished, shareable website. Updates to your career details flow through automatically.', color: 'blue' },
  { icon: FileCheck2, number: '03', title: 'A resume, ready to send', description: 'Create a clean, single-column PDF designed to be readable by applicant tracking systems and hiring teams.', color: 'green' },
  { icon: Target, number: '04', title: 'A clearer job match', description: 'Compare your resume to a job description and see a semantic match score, matched skills, and areas to improve.', color: 'violet' },
];

const steps = [
  { n: '01', title: 'Build your profile', description: 'Add the details that tell your career story, from education and work to projects and skills.' },
  { n: '02', title: 'Get your materials', description: 'Generate a personal portfolio and ATS-friendly resume from the same up-to-date profile.' },
  { n: '03', title: 'Tailor with confidence', description: 'Check your match against a role and use practical feedback to make your application stronger.' },
];

function DashboardPreview() {
  return (
    <div className="lp-preview-wrap" aria-label="Illustration of the Folio dashboard">
      <div className="lp-orbit lp-orbit-one" />
      <div className="lp-orbit lp-orbit-two" />
      <div className="lp-float-card lp-float-top"><span className="lp-float-icon"><Globe2 size={16} /></span><span><b>Portfolio published</b><small>Ready to share</small></span><span className="lp-live-dot" /></div>
      <div className="lp-dashboard">
        <div className="lp-dash-sidebar"><div className="lp-mini-brand"><span>sp</span><i>studio</i></div><div className="lp-avatar">AM</div><div className="lp-dash-name">Alex Morgan</div><div className="lp-dash-role">Product designer</div><div className="lp-dash-divider" />{['Overview', 'Profile', 'Experience', 'Education', 'Skills', 'Projects'].map((item, index) => <div key={item} className={`lp-side-item ${index === 0 ? 'active' : ''}`}><span className="lp-side-dot" />{item}</div>)}<div className="lp-dash-plan"><Sparkles size={14} /><span>Everything in sync</span></div></div>
        <div className="lp-dash-main"><div className="lp-dash-header"><div><small>MONDAY, 9:41 AM</small><h3>Your career, in one place.</h3></div><span className="lp-dash-avatar">AM</span></div><div className="lp-profile-banner"><div><span className="lp-banner-label"><span /> PROFILE COMPLETENESS</span><div className="lp-progress"><i /></div><small>Looking good — add one more project to reach 100%</small></div><div className="lp-progress-ring"><b>82</b><small>%</small></div></div><div className="lp-output-title">YOUR CAREER TOOLKIT <span>Synced just now</span></div><div className="lp-output-grid"><div className="lp-output-card"><div className="lp-output-icon portfolio"><Globe2 size={16} /></div><span className="lp-output-type">PERSONAL WEBSITE</span><b>Your portfolio</b><small>alexmorgan.design</small><span className="lp-output-link">View site <ArrowUpRight size={12} /></span></div><div className="lp-output-card"><div className="lp-output-icon resume"><FileText size={16} /></div><span className="lp-output-type">ATS-FRIENDLY PDF</span><b>Product designer</b><small>Resume · Updated today</small><span className="lp-output-link">Download PDF <ArrowDown size={12} /></span></div></div><div className="lp-match-card"><div className="lp-match-icon"><Target size={15} /></div><div className="lp-match-text"><b>Product Designer at Northstar</b><small>Strong match · 3 skills to highlight</small></div><div className="lp-match-score"><b>86</b><small>%</small></div></div></div>
      </div>
      <div className="lp-float-card lp-float-bottom"><span className="lp-score-badge"><Check size={15} /></span><span><b>Resume is ready</b><small>ATS-friendly PDF</small></span></div>
    </div>
  );
}

const Landing = () => (
  <main className="landing-page">
    <nav className="lp-nav">
      <FolioBrand />
      <div className="lp-nav-links"><a href="#how-it-works">How it works</a><a href="#features">Features</a></div>
      <div className="lp-nav-actions"><Link to="/login" className="lp-login">Sign in</Link><Link to="/register" className="lp-nav-cta">Get started <ArrowRight size={15} /></Link></div>
    </nav>

    <section className="lp-hero">
      <div className="lp-hero-copy lp-enter">
        <div className="lp-eyebrow"><span className="lp-eyebrow-pulse" /> YOUR CAREER, WELL PRESENTED</div>
        <h1>One profile.<br /><span>More ways</span> to get noticed.</h1>
        <p className="lp-hero-lede">Build your career story once. Get a portfolio to share, an ATS-friendly resume to send, and useful feedback for the jobs you want.</p>
        <div className="lp-hero-actions"><Link to="/register" className="lp-primary-cta">Create your free profile <ArrowRight size={17} /></Link><a href="#how-it-works" className="lp-secondary-cta">See how it works <ChevronRight size={16} /></a></div>
        <div className="lp-hero-trust"><div className="lp-trust-icon"><LockKeyhole size={13} /></div><span>Your profile is private until you choose to share your portfolio.</span></div>
      </div>
      <div className="lp-hero-visual lp-enter lp-enter-delay"><DashboardPreview /></div>
      <div className="lp-hero-footnote"><span className="lp-footnote-line" /> A more connected way to show your work <ArrowDown size={13} /></div>
    </section>

    <section className="lp-ribbon" aria-label="Included tools"><div className="lp-ribbon-inner"><span className="lp-ribbon-label">YOUR CAREER TOOLKIT</span><span><Globe2 /> Portfolio website</span><i /><span><FileText /> ATS-ready resume</span><i /><span><Target /> Job match insights</span><i /><span><WandSparkles /> One profile, kept in sync</span></div></section>

    <section className="lp-section lp-features" id="features"><div className="lp-section-heading"><div><span className="lp-section-kicker">THE WHOLE PICTURE</span><h2>Your career story,<br />working together.</h2></div><p>Good applications take more than a resume. Keep your experience organized and turn it into the materials you need for your next opportunity.</p></div><div className="lp-feature-grid">{features.map(({ icon: Icon, number, title, description, color }) => <article className="lp-feature-card" key={number}><div className={`lp-feature-icon ${color}`}><Icon size={20} /></div><span className="lp-feature-number">{number}</span><h3>{title}</h3><p>{description}</p><div className="lp-feature-bottom"><span>EXPLORE FEATURE</span><ArrowUpRight size={15} /></div></article>)}</div></section>

    <section className="lp-process" id="how-it-works"><div className="lp-process-inner"><div className="lp-process-heading"><span className="lp-section-kicker">THREE STEPS TO YOUR NEXT MOVE</span><h2>Less busywork.<br /><span>More momentum.</span></h2><p>From your first profile detail to a tailored application, everything starts in one place.</p><Link to="/register" className="lp-process-link">Start building your profile <ArrowRight size={16} /></Link></div><div className="lp-steps">{steps.map((step, index) => <article className="lp-step" key={step.n}><div className="lp-step-marker"><span>{step.n}</span>{index < steps.length - 1 && <i />}</div><div className="lp-step-copy"><h3>{step.title}</h3><p>{step.description}</p></div></article>)}</div><div className="lp-process-stamp"><BriefcaseBusiness size={17} /><span>YOUR NEXT<br />CHAPTER</span><ArrowUpRight size={15} /></div></div></section>

    <section className="lp-cta-section"><div className="lp-cta-decoration lp-cta-decoration-one" /><div className="lp-cta-decoration lp-cta-decoration-two" /><div className="lp-cta-content"><div className="lp-cta-icon"><Code2 size={20} /></div><span className="lp-section-kicker">MAKE YOUR NEXT MOVE</span><h2>Ready for your experience<br />to do more for you?</h2><p>Start with your career profile. Your next opportunity can take it from there.</p><Link to="/register" className="lp-cta-button">Build your career profile <ArrowRight size={17} /></Link><small>No credit card required <span>·</span> Set up at your own pace</small></div></section>

    <footer className="lp-footer"><Link to="/" className="lp-footer-brand"><span className="lp-brand-mark"><Layers3 size={15} /></span> folio<span className="lp-brand-dot">.</span></Link><span className="lp-footer-note">Your career, in a better light.</span><div><Link to="/login">Sign in</Link><Link to="/register">Create an account</Link></div><span className="lp-footer-copy">© {new Date().getFullYear()} Folio Career Studio</span></footer>
  </main>
);

export default Landing;
