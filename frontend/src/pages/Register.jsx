import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FolioBrand from '../components/common/FolioBrand.jsx';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Layers3, Sparkles, UserRoundPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try { await register(form.name, form.email, form.password); navigate('/dashboard'); }
    catch (error) { toast.error(error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <main className="auth-page auth-register-page">
      <section className="auth-story">
        <FolioBrand className="lp-brand auth-brand" iconSize={17} />
        <div className="auth-story-copy"><span className="auth-kicker"><span /> START YOUR NEXT CHAPTER</span><h1>Make your<br />experience<br />go further.</h1><p>Create one career profile and shape it into the portfolio, resume, and job insights you need for your next opportunity.</p><div className="auth-story-points"><span><Layers3 /> Your career details, organized</span><span><Sparkles /> Portfolio and resume, in sync</span></div></div>
        <span className="auth-story-footer">FOLIO · CAREER STUDIO</span>
        <div className="auth-story-orbit auth-orbit-a" /><div className="auth-story-orbit auth-orbit-b" />
      </section>
      <section className="auth-panel">
        <Link to="/" className="auth-back"><ArrowLeft size={15} /><span>Back to home</span></Link>
        <div className="auth-form-wrap">
          <FolioBrand className="lp-brand auth-brand auth-mobile-brand" iconSize={16} />
          <div className="auth-heading-mark"><UserRoundPlus size={17} /></div>
          <span className="auth-form-kicker">YOUR CAREER STUDIO</span>
          <h2>Create your account.</h2>
          <p className="auth-intro">Set up your profile and start bringing your career story together.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label" htmlFor="register-name">Full name</label>
            <input className="auth-input" id="register-name" type="text" autoComplete="name" placeholder="Your name" required maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <label className="auth-label auth-register-spaced" htmlFor="register-email">Email address</label>
            <input className="auth-input" id="register-email" type="email" autoComplete="email" placeholder="you@example.com" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <label className="auth-label auth-register-spaced" htmlFor="register-password">Password</label>
            <div className="auth-password-wrap"><input className="auth-input" id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button type="button" className="auth-eye" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            <p className="auth-help">Use at least 8 characters and include a number.</p>
            <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Creating account…' : <>Create account <ArrowRight size={16} /></>}</button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in <ArrowRight size={14} /></Link></p>
          <p className="auth-privacy">By creating an account, your portfolio remains private until you choose to share it.</p>
        </div>
        <div className="auth-panel-footer"><span>© {new Date().getFullYear()} Folio Career Studio</span><Link to="/login">Sign in</Link></div>
      </section>
    </main>
  );
};

export default Register;
