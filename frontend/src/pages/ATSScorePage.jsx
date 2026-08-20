import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Upload,
  FileText,
  Sparkles,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Building2,
  BriefcaseBusiness,
  ShieldCheck,
  Zap,
  X,
  Loader2,
  FileCheck2,
} from 'lucide-react';

import { atsService } from '../services/portfolioService';

/* ============================================================
   SCORE GAUGE
============================================================ */

const ScoreGauge = ({ score = 0 }) => {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));

  const circumference = 2 * Math.PI * 54;
  const offset =
    circumference - (safeScore / 100) * circumference;

  const color =
    safeScore >= 70
      ? '#22C55E'
      : safeScore >= 40
        ? '#F59E0B'
        : '#EF4444';

  const status =
    safeScore >= 70
      ? 'Strong Match'
      : safeScore >= 40
        ? 'Partial Match'
        : 'Needs Work';

  return (
    <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
      {/* Glow */}
      <div
        className="absolute inset-8 rounded-full blur-2xl opacity-20"
        style={{ backgroundColor: color }}
      />

      <svg
        viewBox="0 0 120 120"
        className="relative h-48 w-48 -rotate-90"
      >
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="7"
        />

        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition:
              'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-5xl font-semibold tracking-tight"
          style={{ color }}
        >
          {Math.round(safeScore)}
        </span>

        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-gray-400">
          ATS Score
        </span>

        <span
          className="mt-2 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider"
          style={{
            color,
            backgroundColor: `${color}12`,
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

/* ============================================================
   RESUME SOURCE SELECTOR
============================================================ */

const ResumeSourceSelector = ({
  source,
  setSource,
  file,
  setFile,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      toast.error('Please upload a PDF resume.');
      event.target.value = '';
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      toast.error('Resume must be smaller than 10 MB.');
      event.target.value = '';
      return;
    }

    setFile(selected);
    setSource('upload');
  };

  const removeFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setSource('generated');
  };

  return (
    <div className="rounded-[22px] border border-gray-200/80 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">

      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B1220] text-[#D4AF37]">
          <FileText size={16} />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#0B1220]">
            Resume source
          </p>

          <p className="mt-0.5 text-[11px] leading-5 text-gray-400">
            Choose which resume should be compared with the job.
          </p>
        </div>
      </div>

      {/* Small premium segmented tabs */}
      <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">

        <button
          type="button"
          onClick={() => setSource('generated')}
          className={`
            flex flex-1 items-center justify-center gap-2
            rounded-lg px-3 py-2.5
            text-[11px] font-semibold
            transition-all duration-200
            ${
              source === 'generated'
                ? 'bg-white text-[#0B1220] shadow-sm ring-1 ring-gray-200'
                : 'text-gray-400 hover:text-gray-700'
            }
          `}
        >
          <Sparkles
            size={13}
            className={
              source === 'generated'
                ? 'text-[#D4AF37]'
                : ''
            }
          />

          Generated Resume
        </button>

        <button
          type="button"
          onClick={() => setSource('upload')}
          className={`
            flex flex-1 items-center justify-center gap-2
            rounded-lg px-3 py-2.5
            text-[11px] font-semibold
            transition-all duration-200
            ${
              source === 'upload'
                ? 'bg-white text-[#0B1220] shadow-sm ring-1 ring-gray-200'
                : 'text-gray-400 hover:text-gray-700'
            }
          `}
        >
          <Upload size={13} />

          Upload PDF
        </button>
      </div>

      {/* Generated */}
      {source === 'generated' && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.045] px-3.5 py-3">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#B28B20]">
            <FileCheck2 size={15} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#0B1220]">
              Your latest generated resume
            </p>

            <p className="mt-0.5 text-[10px] leading-4 text-gray-400">
              We'll evaluate the resume generated from your profile.
            </p>
          </div>
        </div>
      )}

      {/* Upload */}
      {source === 'upload' && !file && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="
            mt-3 flex w-full flex-col items-center
            justify-center rounded-xl
            border border-dashed border-gray-300
            bg-gray-50/70 px-4 py-6
            text-center transition-all
            hover:border-[#D4AF37]
            hover:bg-[#D4AF37]/[0.025]
          "
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
            <Upload size={17} />
          </div>

          <p className="text-xs font-semibold text-gray-700">
            Upload your resume
          </p>

          <p className="mt-1 text-[10px] text-gray-400">
            PDF only · Maximum 10 MB
          </p>
        </button>
      )}

      {/* Uploaded file */}
      {source === 'upload' && file && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
            <FileCheck2 size={16} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-gray-800">
              {file.name}
            </p>

            <p className="mt-0.5 text-[10px] text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
            </p>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-white hover:text-red-500"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

/* ============================================================
   RESULT STAT
============================================================ */

const ResultStat = ({
  icon: Icon,
  label,
  value,
  tone = 'dark',
}) => {
  const tones = {
    dark: 'bg-gray-50 text-[#0B1220]',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-600',
    gold: 'bg-[#D4AF37]/10 text-[#9A7718]',
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}
      >
        <Icon size={14} />
      </div>

      <div className="min-w-0">
        <p className="font-mono text-[8px] uppercase tracking-widest text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-[#0B1220]">
          {value}
        </p>
      </div>
    </div>
  );
};

/* ============================================================
   KEYWORD GROUP
============================================================ */

const KeywordGroup = ({
  title,
  items,
  type,
}) => {
  if (!items?.length) return null;

  const isMatched = type === 'matched';

  return (
    <div className="rounded-[20px] border border-gray-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.035)]">

      <div className="mb-4 flex items-center justify-between">

        <div className="flex items-center gap-2">
          {isMatched ? (
            <CheckCircle2
              size={15}
              className="text-emerald-500"
            />
          ) : (
            <AlertCircle
              size={15}
              className="text-red-500"
            />
          )}

          <h3 className="text-sm font-semibold text-[#0B1220]">
            {title}
          </h3>
        </div>

        <span className="font-mono text-[9px] text-gray-400">
          {items.length}
        </span>

      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={`
              rounded-full border px-2.5 py-1.5
              font-mono text-[9px]
              ${
                isMatched
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                  : 'border-red-100 bg-red-50 text-red-600'
              }
            `}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   ATS SCORE PAGE
============================================================ */

const ATSScorePage = () => {
  const [form, setForm] = useState({
    jobTitle: '',
    company: '',
    jobDescriptionText: '',
  });

  const [resumeSource, setResumeSource] =
    useState('generated');

  const [resumeFile, setResumeFile] =
    useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      form.jobDescriptionText.trim().length < 30
    ) {
      toast.error(
        'Paste a fuller job description (at least 30 characters).'
      );
      return;
    }

    if (
      resumeSource === 'upload' &&
      !resumeFile
    ) {
      toast.error(
        'Please upload a PDF resume first.'
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * IMPORTANT:
       * atsService.score() should accept this object:
       *
       * {
       *   jobTitle,
       *   company,
       *   jobDescriptionText,
       *   resumeSource,
       *   resumeFile
       * }
       *
       * For generated resume, backend uses the
       * user's system-generated resume.
       *
       * For uploaded resume, backend parses the PDF.
       */

      const data = await atsService.score({
        ...form,
        resumeSource,
        resumeFile:
          resumeSource === 'upload'
            ? resumeFile
            : null,
      });

      setResult(data);

      toast.success(
        'ATS analysis completed successfully.'
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          'Scoring failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const score = Number(result?.score || 0);

  const status =
    score >= 70
      ? {
          label: 'Strong match',
          description:
            'Your resume aligns well with this role.',
          icon: CheckCircle2,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
        }
      : score >= 40
        ? {
            label: 'Partial match',
            description:
              'Your profile has a reasonable foundation, but can be improved.',
            icon: Target,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          }
        : {
            label: 'Needs improvement',
            description:
              'Your resume needs stronger alignment with this job.',
            icon: AlertCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
          };

  return (
    <div className="min-h-full pb-12">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative mb-6 overflow-hidden rounded-[28px] bg-[#0A0F1B] text-white shadow-[0_25px_70px_rgba(15,23,42,0.13)]">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#D4AF37]/15 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-500/[0.06] blur-3xl" />

          <div className="absolute right-8 top-8 h-44 w-44 rounded-full border border-white/[0.05]" />

          <div className="absolute right-16 top-16 h-28 w-28 rounded-full border border-[#D4AF37]/10" />
        </div>

        <div className="relative p-6 sm:p-8">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">

            <Sparkles
              size={12}
              className="text-[#D4AF37]"
            />

            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/50">
              Career Intelligence
            </span>
          </div>

          <div className="max-w-3xl">

            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Optimize your resume for the role.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-[15px]">
              Compare your resume against a real job description
              using semantic matching, keyword analysis and
              resume-specific recommendations.
            </p>

          </div>

          <div className="mt-6 flex flex-wrap gap-2">

            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[9px] text-white/55">
              <ShieldCheck
                size={12}
                className="text-[#D4AF37]"
              />
              ATS Analysis
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[9px] text-white/55">
              <Target size={12} />
              Semantic Match
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[9px] text-white/55">
              <Zap size={12} />
              Smart Suggestions
            </span>

          </div>
        </div>
      </section>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">

        {/* ====================================================
            LEFT — ANALYSIS FORM
        ==================================================== */}

        <section className="rounded-[24px] border border-gray-200/80 bg-white p-5 shadow-[0_15px_50px_rgba(15,23,42,0.045)] sm:p-6">

          {/* Section heading */}
          <div className="mb-6">

            <div className="mb-2 flex items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0B1220] text-[#D4AF37]">
                <Target size={13} />
              </div>

              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-gray-400">
                Analysis setup
              </span>

            </div>

            <h2 className="font-display text-xl font-semibold tracking-tight text-[#0B1220]">
              Compare your resume
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-400">
              Select your resume and paste the target job description.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Resume source */}
            <ResumeSourceSelector
              source={resumeSource}
              setSource={setResumeSource}
              file={resumeFile}
              setFile={setResumeFile}
            />

            {/* Job details */}
            <div className="rounded-[20px] border border-gray-200/80 bg-gray-50/40 p-4">

              <div className="mb-4 flex items-center gap-2">

                <BriefcaseBusiness
                  size={14}
                  className="text-[#B28B20]"
                />

                <span className="text-xs font-semibold text-[#0B1220]">
                  Target role
                </span>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {/* Job title */}
                <div>
                  <label className="mb-1.5 block font-mono text-[8px] uppercase tracking-widest text-gray-400">
                    Job title
                  </label>

                  <div className="relative">
                    <BriefcaseBusiness
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />

                    <input
                      type="text"
                      placeholder="Frontend Engineer"
                      value={form.jobTitle}
                      onChange={(e) =>
                        updateField(
                          'jobTitle',
                          e.target.value
                        )
                      }
                      className="
                        h-11 w-full rounded-xl
                        border border-gray-200
                        bg-white pl-9 pr-3
                        text-xs text-[#0B1220]
                        outline-none transition
                        placeholder:text-gray-300
                        focus:border-[#D4AF37]
                        focus:ring-2
                        focus:ring-[#D4AF37]/10
                      "
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="mb-1.5 block font-mono text-[8px] uppercase tracking-widest text-gray-400">
                    Company
                  </label>

                  <div className="relative">
                    <Building2
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />

                    <input
                      type="text"
                      placeholder="Acme Corporation"
                      value={form.company}
                      onChange={(e) =>
                        updateField(
                          'company',
                          e.target.value
                        )
                      }
                      className="
                        h-11 w-full rounded-xl
                        border border-gray-200
                        bg-white pl-9 pr-3
                        text-xs text-[#0B1220]
                        outline-none transition
                        placeholder:text-gray-300
                        focus:border-[#D4AF37]
                        focus:ring-2
                        focus:ring-[#D4AF37]/10
                      "
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Job description */}
            <div>

              <div className="mb-1.5 flex items-center justify-between">

                <label className="font-mono text-[8px] uppercase tracking-widest text-gray-400">
                  Job description
                </label>

                <span className="text-[9px] text-gray-300">
                  {form.jobDescriptionText.length} characters
                </span>

              </div>

              <textarea
                rows={11}
                required
                placeholder="Paste the complete job posting here. Include responsibilities, required skills, qualifications and technologies..."
                value={form.jobDescriptionText}
                onChange={(e) =>
                  updateField(
                    'jobDescriptionText',
                    e.target.value
                  )
                }
                className="
                  w-full resize-none rounded-[18px]
                  border border-gray-200
                  bg-white p-4
                  text-xs leading-6 text-[#0B1220]
                  outline-none transition
                  placeholder:text-gray-300
                  focus:border-[#D4AF37]
                  focus:ring-2
                  focus:ring-[#D4AF37]/10
                "
              />

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                group flex w-full items-center
                justify-center gap-2
                rounded-xl
                bg-[#0A0F1B]
                px-5 py-3.5
                text-xs font-semibold
                text-white
                shadow-[0_12px_30px_rgba(10,15,27,0.16)]
                transition-all duration-200
                hover:-translate-y-0.5
                hover:bg-[#111827]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Analyzing resume...
                </>
              ) : (
                <>
                  <Sparkles
                    size={14}
                    className="text-[#D4AF37]"
                  />

                  Compute ATS score

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}

            </button>

          </form>
        </section>

        {/* ====================================================
            RIGHT — RESULT
        ==================================================== */}

        <section className="min-w-0">

          {!result && (
            <div className="flex min-h-[500px] flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-white px-6 text-center">

              <div className="relative mb-5">

                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/10 blur-xl" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border border-gray-200 bg-white shadow-sm">
                  <Target
                    size={24}
                    className="text-[#D4AF37]"
                    strokeWidth={1.5}
                  />
                </div>

              </div>

              <h3 className="font-display text-lg font-semibold text-[#0B1220]">
                Your ATS analysis will appear here
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-6 text-gray-400">
                Choose your resume, paste a job description,
                and we'll calculate your match score with
                actionable recommendations.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">

                <span className="rounded-full bg-gray-50 px-3 py-1.5 text-[9px] text-gray-400">
                  Resume analysis
                </span>

                <span className="rounded-full bg-gray-50 px-3 py-1.5 text-[9px] text-gray-400">
                  Keyword matching
                </span>

                <span className="rounded-full bg-gray-50 px-3 py-1.5 text-[9px] text-gray-400">
                  Skill alignment
                </span>

              </div>

            </div>
          )}

          {result && (
            <div className="space-y-5">

              {/* Score card */}
              <div className="overflow-hidden rounded-[24px] border border-gray-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">

                <div className="relative overflow-hidden bg-[#0A0F1B] p-6 text-white sm:p-7">

                  <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#D4AF37]/10 blur-3xl" />

                  <div className="relative flex flex-col items-center gap-6 sm:flex-row">

                    <ScoreGauge score={score} />

                    <div className="text-center sm:text-left">

                      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1">

                        <status.icon
                          size={12}
                          className={status.color}
                        />

                        <span className="font-mono text-[8px] uppercase tracking-widest text-white/50">
                          Analysis complete
                        </span>

                      </div>

                      <h2 className="font-display text-2xl font-semibold">
                        {status.label}
                      </h2>

                      <p className="mt-2 max-w-sm text-xs leading-5 text-white/45">
                        {status.description}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Score stats */}
                <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">

                  <ResultStat
                    icon={CheckCircle2}
                    label="Matched"
                    value={
                      result.matchedKeywords?.length ||
                      0
                    }
                    tone="green"
                  />

                  <ResultStat
                    icon={AlertCircle}
                    label="Missing"
                    value={
                      result.missingKeywords?.length ||
                      0
                    }
                    tone="red"
                  />

                  <ResultStat
                    icon={Target}
                    label="Score"
                    value={`${Math.round(score)} / 100`}
                    tone="gold"
                  />

                  <ResultStat
                    icon={Zap}
                    label="Method"
                    value="Semantic"
                    tone="dark"
                  />

                </div>

              </div>

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div className="rounded-[20px] border border-gray-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.035)]">

                  <div className="mb-4 flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#B28B20]">
                      <Sparkles size={15} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#0B1220]">
                        Optimization suggestions
                      </h3>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        Improvements that can strengthen your match.
                      </p>
                    </div>

                  </div>

                  <div className="space-y-2">

                    {result.suggestions.map(
                      (suggestion, index) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-xl bg-gray-50/80 p-3"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B1220] font-mono text-[8px] text-[#D4AF37]">
                            {String(index + 1).padStart(
                              2,
                              '0'
                            )}
                          </span>

                          <p className="text-xs leading-5 text-gray-500">
                            {suggestion}
                          </p>
                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* Keywords */}
              <div className="grid gap-5 md:grid-cols-2">

                <KeywordGroup
                  title="Matched keywords"
                  items={result.matchedKeywords}
                  type="matched"
                />

                <KeywordGroup
                  title="Missing keywords"
                  items={result.missingKeywords}
                  type="missing"
                />

              </div>

            </div>
          )}

        </section>
      </div>

      {/* ======================================================
          FOOTER TIP
      ====================================================== */}

      <div className="mt-6 flex items-start gap-3 rounded-[20px] border border-[#D4AF37]/15 bg-[#D4AF37]/[0.035] px-5 py-4">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#B28B20]">
          <ShieldCheck size={15} />
        </div>

        <div>
          <p className="text-xs font-semibold text-[#0B1220]">
            ATS optimization tip
          </p>

          <p className="mt-0.5 text-[11px] leading-5 text-gray-400">
            Use the actual job description whenever possible.
            The more complete the posting, the more useful the
            semantic match and missing-keyword analysis will be.
          </p>
        </div>

      </div>

    </div>
  );
};

export default ATSScorePage;
