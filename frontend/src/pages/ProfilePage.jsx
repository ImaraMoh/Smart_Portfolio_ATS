import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AtSign, Camera, Check, Eye, EyeOff, ImagePlus, LockKeyhole, ShieldCheck, Sparkles, Trash2, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { userService } from '../services/portfolioService';
import Input from '../components/common/Input.jsx';
import TextArea from '../components/common/TextArea.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';

const ProfilePage = () => {
  const { user, updateUserLocal } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', headline: user?.headline || '', bio: user?.bio || '',
    location: user?.location || '', phone: user?.phone || '', website: user?.website || '',
    github: user?.socialLinks?.github || '', linkedin: user?.socialLinks?.linkedin || '',
  });
  const [saving, setSaving] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const fileInput = useRef(null);
  const passwordStrength = !pwForm.newPassword
    ? 0
    : Math.min(4, 1
      + (pwForm.newPassword.length >= 8 ? 1 : 0)
      + (pwForm.newPassword.length >= 12 ? 1 : 0)
      + (/[A-Z]/.test(pwForm.newPassword) && /[a-z]/.test(pwForm.newPassword) && /\d|[^A-Za-z0-9]/.test(pwForm.newPassword) ? 1 : 0));
  const passwordStrengthLabel = ['Add a new password', 'Needs more strength', 'Getting stronger', 'Strong password', 'Excellent password'][passwordStrength];

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userService.updateProfile({
        ...form,
        socialLinks: { github: form.github, linkedin: form.linkedin },
      });
      updateUserLocal(updated);
      toast.success('Profile updated — your portfolio and resume are refreshing');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Choose a JPG, PNG, or WebP image');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be 2 MB or smaller');
      return;
    }
    setPhotoSaving(true);
    try {
      const updated = await userService.uploadAvatar(file);
      updateUserLocal(updated);
      toast.success('Profile photo saved — your portfolio is refreshing');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setPhotoSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoSaving(true);
    try {
      const updated = await userService.removeAvatar();
      updateUserLocal(updated);
      toast.success('Profile photo removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove photo');
    } finally {
      setPhotoSaving(false);
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
    <div className="min-h-full pb-10">
      <section className="relative mb-7 overflow-hidden rounded-[28px] bg-ink text-white shadow-[0_25px_70px_rgba(0,0,0,0.12)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute right-[-70px] top-[-70px] h-64 w-64 rounded-full border border-white/[0.05]" />
        </div>
        <div className="relative p-7 sm:p-9">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2">
            <Sparkles size={14} className="text-gold" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Account · Professional profile</span>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-white/20 bg-white/10 shadow-lg">
              {user?.avatarUrl ? <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" /> : <UserRound size={38} className="text-gold" />}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Your profile</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">Keep your professional details current. Your profile powers your resume and every portfolio template.</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button type="button" className="!border-white/15 !bg-white/10 !text-white hover:!bg-white/15" disabled={photoSaving} onClick={() => fileInput.current?.click()}>
                  {user?.avatarUrl ? <Camera size={15} /> : <ImagePlus size={15} />}
                  {photoSaving ? 'Saving photo…' : user?.avatarUrl ? 'Change photo' : 'Upload photo'}
                </Button>
                {user?.avatarUrl && <button type="button" onClick={handleRemovePhoto} disabled={photoSaving} className="inline-flex items-center gap-2 px-2 py-2 text-xs font-semibold text-white/55 transition hover:text-white disabled:opacity-50"><Trash2 size={14} />Remove</button>}
                <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} className="hidden" />
              </div>
              <p className="mt-2 text-[11px] text-white/40">JPG, PNG, or WebP · up to 2 MB</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
        <Card>
          <div className="mb-6 flex items-start gap-3 border-b border-gray-100 pb-5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-700"><UserRound size={18} /></span>
            <div><h2 className="font-display text-lg font-semibold">Personal information</h2><p className="mt-1 text-xs text-muted">These details appear on your portfolio and resume.</p></div>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Full name" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Professional headline" placeholder="Full-Stack Developer" maxLength={150} value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
            <TextArea label="About you" rows={5} maxLength={1000} placeholder="A short introduction to your experience and the work you enjoy…" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Location" placeholder="City, Country" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <Input label="Personal website" type="url" placeholder="https://yourname.dev" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="GitHub URL" type="url" placeholder="https://github.com/username" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
              <Input label="LinkedIn URL" type="url" placeholder="https://linkedin.com/in/username" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            </div>
            <div className="flex justify-end border-t border-gray-100 pt-5"><Button type="submit" disabled={saving}>{saving ? 'Saving changes…' : 'Save changes'}</Button></div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="relative overflow-hidden !p-0">
            <div className="relative overflow-hidden bg-gradient-to-br from-ink via-[#20283a] to-[#313348] px-5 pb-6 pt-5 text-white">
              <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-5 -top-7 h-24 w-24 rounded-full bg-gold/15 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-gold"><AtSign size={19} /></span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-100"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Active</span>
              </div>
              <div className="relative mt-5"><div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">Account / Sign-in</div><h2 className="mt-1 font-display text-xl font-semibold">Account details</h2></div>
            </div>
            <div className="p-5">
              <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-[#fbfbfa] to-white p-4 shadow-inner shadow-gray-100/70">
                <div className="text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">Email address</div>
                <div className="mt-2 break-all text-sm font-semibold leading-5 text-gray-800">{user?.email || '—'}</div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-emerald-700"><Check size={13} />Used for secure sign-in</div>
              </div>
              <p className="mt-4 flex items-start gap-2.5 text-xs leading-5 text-muted"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#3d9a72]" />Your email identifies your account and can’t be changed from this page.</p>
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 text-amber-800 shadow-sm"><LockKeyhole size={19} /></span>
              <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h2 className="font-display text-lg font-semibold">Password & security</h2><span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-gray-500">Private</span></div><p className="mt-1 text-xs leading-5 text-muted">Update your password to keep your account protected.</p></div>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="relative">
                <Input label="Current password" type={showCurrentPassword ? 'text' : 'password'} required autoComplete="current-password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="[&_input]:pr-12" />
                <button type="button" onClick={() => setShowCurrentPassword((visible) => !visible)} aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'} className="absolute right-3 top-[34px] rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">{showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              <div className="relative">
                <Input label="New password" type={showNewPassword ? 'text' : 'password'} required minLength={8} autoComplete="new-password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="[&_input]:pr-12" />
                <button type="button" onClick={() => setShowNewPassword((visible) => !visible)} aria-label={showNewPassword ? 'Hide new password' : 'Show new password'} className="absolute right-3 top-[34px] rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">{showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              <div aria-live="polite">
                <div className="mb-2 flex items-center justify-between text-[10px]"><span className="font-semibold text-gray-500">{passwordStrengthLabel}</span><span className="text-gray-400">At least 8 characters</span></div>
                <div className="grid grid-cols-4 gap-1.5">{[0, 1, 2, 3].map((index) => <span key={index} className={`h-1.5 rounded-full transition-colors ${passwordStrength > index ? (passwordStrength < 2 ? 'bg-rose-400' : passwordStrength < 3 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-gray-100'}`} />)}</div>
              </div>
              <Button type="submit" variant="secondary" disabled={pwSaving} className="w-full !border-gray-200 !bg-ink !text-white hover:!bg-gray-800">{pwSaving ? 'Updating password…' : 'Update password'}</Button>
            </form>
            <div className="mt-4 border-t border-gray-100 pt-3 text-[10px] leading-4 text-gray-400">Your current password is required to confirm this change.</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
