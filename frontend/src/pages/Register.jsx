import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Registration failed';
      toast.error(msg);
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
            Real-time ATS scoring,<br />not a one-time upload.
          </h1>
          <p className="text-white/60 text-sm max-w-sm">
            Semantic scoring with Sentence Transformers shows you exactly how well
            your resume matches a job — as you edit, not after you've already applied.
          </p>
        </div>
        <div className="text-white/40 text-xs font-mono">CO3554 · Data Management Project</div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-semibold mb-1">Create your account</h2>
          <p className="text-sm text-muted mb-8">Set up your dashboard in under a minute.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input
              label="Password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="text-xs text-muted -mt-2">At least 8 characters, including a number.</p>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</Button>
          </form>

          <p className="text-sm text-muted mt-6 text-center">
            Already have an account? <Link to="/login" className="text-accent font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
