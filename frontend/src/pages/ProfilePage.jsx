import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { userService } from '../services/portfolioService';
import Input from '../components/common/Input.jsx';
import TextArea from '../components/common/TextArea.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';

const ProfilePage = () => {
  const { user, updateUserLocal } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    website: user?.website || '',
    github: user?.socialLinks?.github || '',
    linkedin: user?.socialLinks?.linkedin || ''
  });
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        headline: form.headline,
        bio: form.bio,
        location: form.location,
        phone: form.phone,
        website: form.website,
        socialLinks: { github: form.github, linkedin: form.linkedin }
      };
      const updated = await userService.updateProfile(payload);
      updateUserLocal(updated);
      toast.success('Profile updated — portfolio and resume are regenerating');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await userService.changePassword(pwForm);
      toast.success('Password updated');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-display font-semibold mb-1">Profile</h1>
      <p className="text-sm text-muted mb-8">This information appears at the top of your portfolio and resume.</p>

      <Card className="mb-6">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Headline" placeholder="Full-Stack Developer" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
          <TextArea label="Bio" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <Input label="Website" placeholder="https://yourname.dev" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="GitHub URL" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
            <Input label="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
          </div>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</Button>
        </form>
      </Card>

      <Card>
        <div className="font-display font-semibold mb-4">Change password</div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password" type="password" required
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
          />
          <Input
            label="New Password" type="password" required minLength={8}
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
          />
          <Button type="submit" variant="secondary" disabled={pwSaving}>{pwSaving ? 'Updating...' : 'Update password'}</Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
