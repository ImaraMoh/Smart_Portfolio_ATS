import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="min-h-screen bg-ink text-white">
    <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-6">
      <div className="font-mono text-xs tracking-widest text-gold uppercase">SP/ATS Studio</div>
      <div className="flex gap-3">
        <Link to="/login" className="text-sm text-white/70 hover:text-white px-4 py-2">Sign in</Link>
        <Link to="/register" className="text-sm bg-white text-ink px-4 py-2 rounded-xl font-medium">Get started</Link>
      </div>
    </nav>

    <div className="max-w-4xl mx-auto px-8 pt-20 pb-28 text-center">
      <div className="inline-block font-mono text-[11px] tracking-widest text-gold uppercase border border-gold/30 rounded-full px-3 py-1 mb-8">
        Portfolio · Resume · ATS Score — one dashboard
      </div>
      <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-[1.05] mb-6">
        Stop copy-pasting your<br/>career into five different tools.
      </h1>
      <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
        Enter your career data once. Get an auto-updating portfolio website, an ATS-optimized
        PDF resume, and a real-time semantic match score against any job description.
      </p>
      <Link to="/register" className="inline-block bg-gold text-ink font-medium px-7 py-3.5 rounded-xl">
        Build your dashboard →
      </Link>
    </div>

    <div className="max-w-5xl mx-auto px-8 pb-24 grid sm:grid-cols-3 gap-6">
      {[
        { n: '01', t: 'Centralized dashboard', d: 'Education, experience, skills, projects, volunteering — one place, always current.' },
        { n: '02', t: 'Dual auto-output', d: 'A live portfolio site and a downloadable ATS-friendly PDF resume, generated together.' },
        { n: '03', t: 'Semantic ATS scoring', d: 'Sentence-Transformer embeddings + cosine similarity, not just keyword counting.' }
      ].map((f) => (
        <div key={f.n} className="border border-white/10 rounded-xl2 p-6">
          <div className="font-mono text-xs text-gold mb-3">{f.n}</div>
          <div className="font-display font-semibold mb-2">{f.t}</div>
          <div className="text-sm text-white/50">{f.d}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Landing;
