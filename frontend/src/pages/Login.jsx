import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-ink text-white p-14">
        <div className="font-mono text-xs tracking-widest text-gold uppercase">SP/ATS Studio</div>
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight mb-4">
            One dashboard.<br />Portfolio + resume,<br />always in sync.
          </h1>
          <p className="text-white/60 text-sm max-w-sm">
            Manage your career data once. Get a live portfolio site and an ATS-scored,
            downloadable resume — updated automatically every time you make a change.
          </p>
        </div>
        <div className="text-white/40 text-xs font-mono">CO3554 · Data Management Project</div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-semibold mb-1">Welcome back</h2>
          <p className="text-sm text-muted mb-8">Sign in to keep building your profile.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
          </form>

          <p className="text-sm text-muted mt-6 text-center">
            No account yet? <Link to="/register" className="text-accent font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
