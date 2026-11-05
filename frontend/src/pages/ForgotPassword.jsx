import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FolioBrand from '../components/common/FolioBrand.jsx';
import { ArrowLeft, ArrowRight, KeyRound, MailCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService.js';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('email');
  const [loading, setLoading] = useState(false);
  const submitEmail = async (event) => {
    event.preventDefault(); setLoading(true);
    try { await authService.requestPasswordReset(email); setStage('otp'); toast.success('If that address has an account, a code is on its way.'); }
    catch (error) { toast.error(error.response?.data?.message || 'Could not send a reset code.'); }
    finally { setLoading(false); }
  };
  const submitOtp = async (event) => {
    event.preventDefault(); setLoading(true);
    try { const { resetToken } = await authService.verifyPasswordResetOtp(email, otp); navigate('/reset-password', { state: { email, resetToken } }); }
    catch (error) { toast.error(error.response?.data?.message || 'That code could not be verified.'); }
    finally { setLoading(false); }
  };
  return <main className="auth-page"><section className="auth-story"><FolioBrand className="lp-brand auth-brand" iconSize={17} /><div className="auth-story-copy"><span className="auth-kicker"><span /> ACCOUNT RECOVERY</span><h1>A secure reset,<br />step by step.</h1><p>Verify your email with a one-time code, then choose a new password for your account.</p><div className="auth-story-points"><span><MailCheck /> One-time email verification</span><span><KeyRound /> Private password reset</span></div></div><span className="auth-story-footer">FOLIO · CAREER STUDIO</span><div className="auth-story-orbit auth-orbit-a" /><div className="auth-story-orbit auth-orbit-b" /></section><section className="auth-panel"><Link to="/login" className="auth-back"><ArrowLeft size={15} /><span>Back to sign in</span></Link><div className="auth-form-wrap"><FolioBrand className="lp-brand auth-brand auth-mobile-brand" iconSize={16} /><div className="auth-heading-mark">{stage === 'email' ? <MailCheck size={17} /> : <KeyRound size={17} />}</div><span className="auth-form-kicker">{stage === 'email' ? 'ACCOUNT RECOVERY' : 'EMAIL VERIFICATION'}</span><h2>{stage === 'email' ? 'Forgot your password?' : 'Enter your reset code.'}</h2><p className="auth-intro">{stage === 'email' ? 'Enter the email address linked to your account. We’ll send you a one-time verification code.' : <>We sent a six-digit code to <strong>{email}</strong>. It expires in 10 minutes.</>}</p>{stage === 'email' ? <form className="auth-form" onSubmit={submitEmail}><label className="auth-label" htmlFor="reset-email">Email address</label><input className="auth-input" id="reset-email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} /><button className="auth-submit" disabled={loading}>{loading ? 'Sending code…' : <>Send verification code <ArrowRight size={16} /></>}</button></form> : <form className="auth-form" onSubmit={submitOtp}><label className="auth-label" htmlFor="reset-otp">Six-digit code</label><input className="auth-input auth-otp-input" id="reset-otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} /><button className="auth-submit" disabled={loading}>{loading ? 'Verifying…' : <>Verify code <ArrowRight size={16} /></>}</button><button className="auth-text-button" type="button" onClick={() => { setStage('email'); setOtp(''); }}>Use a different email</button></form>}<p className="auth-switch">Remember your password? <Link to="/login">Sign in <ArrowRight size={14} /></Link></p></div><div className="auth-panel-footer"><span>© {new Date().getFullYear()} Folio Career Studio</span><Link to="/">Home</Link></div></section></main>;
}
