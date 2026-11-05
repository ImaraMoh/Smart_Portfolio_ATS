import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FolioBrand from '../components/common/FolioBrand.jsx';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Layers3, LockKeyhole } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      <section className="auth-story">
        <FolioBrand className="lp-brand auth-brand" iconSize={17} />
        <div className="auth-story-copy"><span className="auth-kicker"><span /> YOUR CAREER, IN SYNC</span><h1>One profile.<br />A stronger way<br />to show your work.</h1><p>Keep your career details in one place and turn them into a portfolio, an ATS-friendly resume, and clearer job match insights.</p><div className="auth-story-points"><span><Layers3 /> One organized career profile</span><span><LockKeyhole /> Your portfolio, shared on your terms</span></div></div>
        <span className="auth-story-footer">FOLIO · CAREER STUDIO</span>
        <div className="auth-story-orbit auth-orbit-a" /><div className="auth-story-orbit auth-orbit-b" />
      </section>
      <section className="auth-panel">
        <Link to="/" className="auth-back"><ArrowLeft size={15} /> <span>Back to home</span></Link>
        <div className="auth-form-wrap">
          <FolioBrand className="lp-brand auth-brand auth-mobile-brand" iconSize={16} />
          <div className="auth-heading-mark"><LockKeyhole size={17} /></div>
          <span className="auth-form-kicker">WELCOME BACK</span>
          <h2>Sign in to your studio.</h2>
          <p className="auth-intro">Pick up where you left off and keep your career moving.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-label" htmlFor="login-email">Email address</label>
            <input className="auth-input" id="login-email" type="email" autoComplete="email" placeholder="you@example.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div className="auth-password-label"><label className="auth-label" htmlFor="login-password">Password</label><Link to="/forgot-password">Forgot password?</Link></div>
            <div className="auth-password-wrap"><input className="auth-input" id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button type="button" className="auth-eye" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}</button>
          </form>
          <p className="auth-switch">New to the studio? <Link to="/register">Create your account <ArrowRight size={14} /></Link></p>
          <p className="auth-privacy"><LockKeyhole size={12} /> Your account details stay private and secure.</p>
        </div>
        <div className="auth-panel-footer"><span>© {new Date().getFullYear()} Folio Career Studio</span><Link to="/register">Create an account</Link></div>
      </section>
    </main>
  );
};

export default Login;
