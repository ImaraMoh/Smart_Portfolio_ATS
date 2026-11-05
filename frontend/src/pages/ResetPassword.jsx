import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FolioBrand from '../components/common/FolioBrand.jsx';
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService.js';

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const verified = Boolean(state?.email && state?.resetToken);
  const submit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) { toast.error('The passwords do not match.'); return; }
    setLoading(true);
    try { await authService.resetPassword({ email: state.email, resetToken: state.resetToken, password }); toast.success('Password updated. Sign in with your new password.'); navigate('/login', { replace: true }); }
    catch (error) { toast.error(error.response?.data?.message || 'Could not reset password. Request a new code.'); }
    finally { setLoading(false); }
  };
  return <main className="auth-page"><section className="auth-story"><FolioBrand className="lp-brand auth-brand" iconSize={17} /><div className="auth-story-copy"><span className="auth-kicker"><span /> SECURE YOUR ACCOUNT</span><h1>A fresh start<br />for your next<br />career move.</h1><p>Choose a strong password you haven’t used here before. Your update is saved securely to your account.</p><div className="auth-story-points"><span><KeyRound /> At least 8 characters</span><span><KeyRound /> Include at least one number</span></div></div><span className="auth-story-footer">FOLIO · CAREER STUDIO</span><div className="auth-story-orbit auth-orbit-a" /><div className="auth-story-orbit auth-orbit-b" /></section><section className="auth-panel"><Link to={verified ? '/forgot-password' : '/login'} className="auth-back"><ArrowLeft size={15} /><span>{verified ? 'Back to verification' : 'Back to sign in'}</span></Link><div className="auth-form-wrap"><FolioBrand className="lp-brand auth-brand auth-mobile-brand" iconSize={16} /><div className="auth-heading-mark"><KeyRound size={17} /></div><span className="auth-form-kicker">NEW PASSWORD</span><h2>Choose a new password.</h2>{verified ? <><p className="auth-intro">Create a new password for <strong>{state.email}</strong>.</p><form className="auth-form" onSubmit={submit}><label className="auth-label" htmlFor="new-password">New password</label><div className="auth-password-wrap"><input className="auth-input" id="new-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" className="auth-eye" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><p className="auth-help">Use at least 8 characters and include a number.</p><label className="auth-label" htmlFor="confirm-password">Confirm new password</label><input className="auth-input" id="confirm-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required placeholder="Enter the new password again" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /><button className="auth-submit" disabled={loading}>{loading ? 'Updating password…' : <>Update password <ArrowRight size={16} /></>}</button></form></> : <><p className="auth-intro">Verify your email code before setting a new password.</p><Link className="auth-submit auth-link-button" to="/forgot-password">Verify email code <ArrowRight size={16} /></Link></>}<p className="auth-switch">Already reset it? <Link to="/login">Sign in <ArrowRight size={14} /></Link></p></div><div className="auth-panel-footer"><span>© {new Date().getFullYear()} Folio Career Studio</span><Link to="/">Home</Link></div></section></main>;
}
