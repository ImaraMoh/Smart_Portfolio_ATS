import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FileText,
  Download,
  RefreshCw,
  Upload,
  Sparkles,
  CheckCircle2,
  FileSearch,
  ArrowUpRight,
  ShieldCheck,
  ScanText,
  X,
  Loader2,
} from 'lucide-react';

import { resumeService } from '../services/portfolioService';
import api from '../services/api';

const ResumePage = () => {
  const fileInputRef = useRef(null);

  const [regenerating, setRegenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  /* ============================================================
     REGENERATE
  ============================================================ */

  const handleRegenerate = async () => {
    if (regenerating) return;

    setRegenerating(true);

    try {
      await resumeService.regenerate();

      toast.success(
        'Resume regenerated from your latest profile data'
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'Failed to regenerate resume'
      );
    } finally {
      setRegenerating(false);
    }
  };

  /* ============================================================
     DOWNLOAD
  ============================================================ */

  const handleDownload = async () => {
    if (downloading) return;

    setDownloading(true);

    try {
      const res = await api.get('/resume/download', {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], {
        type: 'application/pdf',
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = 'Resume.pdf';

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      toast.success('Resume downloaded');
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'Failed to download resume'
      );
    } finally {
      setDownloading(false);
    }
  };

  /* ============================================================
     FILE SELECTION
  ============================================================ */

  const handleFileSelect = (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF resume');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Resume must be smaller than 10MB');
      return;
    }

    setSelectedFile(file);
    setAnalysis(null);
  };

  /* ============================================================
     FILE INPUT
  ============================================================ */

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    handleFileSelect(file);

    event.target.value = '';
  };

  /* ============================================================
     DRAG & DROP
  ============================================================ */

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    handleFileSelect(file);
  };

  /* ============================================================
     ANALYZE RESUME
  ============================================================ */

  const handleAnalyze = async () => {
    if (!selectedFile || uploading) return;

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append('resume', selectedFile);

      const response = await api.post(
        '/resume/analyze',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setAnalysis(response.data?.data || response.data);

      toast.success('Resume analysis completed');
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'Failed to analyze resume'
      );
    } finally {
      setUploading(false);
    }
  };

  /* ============================================================
     REMOVE FILE
  ============================================================ */

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysis(null);
  };

  /* ============================================================
     ANALYSIS DATA
  ============================================================ */

  const detectedSections =
    analysis?.detectedSections ||
    analysis?.sections ||
    [];

  const score =
    analysis?.score ??
    analysis?.atsScore ??
    null;

  return (
    <div className="min-h-full pb-12">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="relative mb-7 overflow-hidden rounded-[30px] bg-[#0A0F1B] text-white shadow-[0_25px_80px_rgba(15,23,42,0.14)]">

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#D4AF37]/15 blur-3xl" />

          <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-white/[0.035] blur-3xl" />

          <div className="absolute right-12 top-12 h-40 w-40 rounded-full border border-white/[0.05]" />

        </div>

        <div className="relative p-6 sm:p-8">

          <div className="mb-5 flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10">
              <FileText
                size={17}
                className="text-[#D4AF37]"
              />
            </div>

            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/45">
              Resume Studio
            </span>

          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-2xl">

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Build a resume that gets noticed.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Generate an ATS-friendly resume from your profile,
                or upload your existing CV to detect and improve
                your professional information.
              </p>

            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-xl">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <ShieldCheck
                  size={18}
                  className="text-[#D4AF37]"
                />
              </div>

              <div>

                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
                  Resume Format
                </p>

                <p className="mt-0.5 text-sm font-medium">
                  ATS Optimized
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <section className="mb-7 grid gap-4 md:grid-cols-2">

        {/* Generate */}

        <div className="group relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#D4AF37]/[0.06] blur-2xl" />

          <div className="relative">

            <div className="mb-5 flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A0F1B] text-[#D4AF37]">
                <Sparkles size={18} />
              </div>

              <span className="rounded-full bg-gray-50 px-3 py-1 font-mono text-[8px] uppercase tracking-widest text-gray-400">
                Generated
              </span>

            </div>

            <h2 className="text-lg font-semibold text-[#0A0F1B]">
              Generate your resume
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Create a clean ATS-friendly resume using your
              latest education, experience, skills and projects.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">

              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0A0F1B] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#151D2D] disabled:opacity-50"
              >

                {downloading ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Download size={14} />
                )}

                {downloading
                  ? 'Preparing...'
                  : 'Download PDF'}

              </button>

              <button
                type="button"
                onClick={handleRegenerate}
                disabled={regenerating}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#0A0F1B] transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >

                <RefreshCw
                  size={14}
                  className={
                    regenerating
                      ? 'animate-spin'
                      : ''
                  }
                />

                {regenerating
                  ? 'Regenerating...'
                  : 'Regenerate'}

              </button>

            </div>

          </div>

        </div>

        {/* Upload */}

        <div className="group relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/[0.05] blur-2xl" />

          <div className="relative">

            <div className="mb-5 flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileSearch size={18} />
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 font-mono text-[8px] uppercase tracking-widest text-blue-500">
                Import
              </span>

            </div>

            <h2 className="text-lg font-semibold text-[#0A0F1B]">
              Analyze an existing CV
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Upload your current resume and detect your
              professional sections before updating your profile.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleInputChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#0A0F1B] transition hover:border-[#0A0F1B] hover:bg-gray-50"
            >

              <Upload size={14} />

              Upload CV

            </button>

          </div>

        </div>

      </section>

      {/* ======================================================
          UPLOADED FILE
      ====================================================== */}

      {selectedFile && (
        <section className="mb-7 overflow-hidden rounded-[24px] border border-gray-200/80 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.05)]">

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FileText size={18} />
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-[#0A0F1B]">
                  {selectedFile.name}
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  {' · '}
                  PDF
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={removeFile}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={15} />
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0A0F1B] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#151D2D] disabled:opacity-50"
              >

                {uploading ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <ScanText size={14} />
                )}

                {uploading
                  ? 'Analyzing...'
                  : 'Analyze Resume'}

              </button>

            </div>

          </div>

        </section>
      )}

      {/* ======================================================
          DROPZONE
      ====================================================== */}

      {!selectedFile && (
        <section
          onDragOver={(event) =>
            event.preventDefault()
          }
          onDrop={handleDrop}
          className="mb-7 rounded-[24px] border border-dashed border-gray-300 bg-gray-50/70 p-8 text-center transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/[0.025]"
        >

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm">
            <Upload size={19} />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-[#0A0F1B]">
            Drop your current CV here
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            PDF only · Maximum 10MB
          </p>

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="mt-4 text-xs font-semibold text-[#0A0F1B] underline underline-offset-4"
          >
            Browse files
          </button>

        </section>
      )}

      {/* ======================================================
          ANALYSIS
      ====================================================== */}

      {analysis && (
        <section className="mb-7 overflow-hidden rounded-[26px] border border-gray-200/80 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.06)]">

          <div className="border-b border-gray-100 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#A98416]">
                <ScanText size={17} />
              </div>

              <div>

                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gray-400">
                  Resume Intelligence
                </p>

                <h2 className="mt-0.5 text-lg font-semibold text-[#0A0F1B]">
                  Detected resume structure
                </h2>

              </div>

            </div>

          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">

            {score !== null && (
              <div className="rounded-2xl bg-[#0A0F1B] p-5 text-white">

                <p className="font-mono text-[8px] uppercase tracking-widest text-white/40">
                  Resume Score
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#D4AF37]">
                  {score}
                </p>

                <p className="mt-1 text-xs text-white/40">
                  Initial analysis
                </p>

              </div>
            )}

            {detectedSections.map(
              (section, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5"
                >

                  <div className="flex items-center gap-2">

                    <CheckCircle2
                      size={15}
                      className="text-emerald-500"
                    />

                    <span className="text-sm font-semibold text-[#0A0F1B]">
                      {typeof section === 'string'
                        ? section
                        : section.name ||
                          section.title}
                    </span>

                  </div>

                  {section?.count && (
                    <p className="mt-2 text-xs text-gray-400">
                      {section.count} items detected
                    </p>
                  )}

                </div>
              )
            )}

          </div>

        </section>
      )}

      {/* ======================================================
          TIP
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[24px] border border-[#D4AF37]/15 bg-[#D4AF37]/[0.045] p-5">

        <div className="flex items-start gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
            <Sparkles
              size={15}
              className="text-[#A98416]"
            />
          </div>

          <div>

            <p className="text-xs font-semibold text-[#0A0F1B]">
              Resume intelligence tip
            </p>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-gray-500">
              Upload your existing CV first. The system can identify
              important sections and help you bring missing information
              into your Smart Portfolio profile before generating a
              fresh ATS-friendly resume.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};

export default ResumePage;
