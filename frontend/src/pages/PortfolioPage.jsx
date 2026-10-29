import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Check,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Palette,
  LayoutTemplate,
  Eye,
  Globe2,
  ChevronRight,
} from 'lucide-react';

import { portfolioService } from '../services/portfolioService';
import Spinner from '../components/common/Spinner.jsx';

/* ============================================================
   PREMIUM PORTFOLIO TEMPLATES
============================================================ */

const TEMPLATES = [
  {
    id: 'minimalist',
    label: 'Atelier Blanc',
    category: 'Editorial',
    blurb:
      'Quiet luxury with gallery-like spacing, fine typography and a sculptural hero.',
    preview: 'minimal',
  },

  {
    id: 'modern',
    label: 'NOVA / 01',
    category: 'Signature',
    blurb:
      'A luminous glass interface with a dimensional profile stage and crisp project cards.',
    preview: 'modern',
  },

  {
    id: 'creative',
    label: 'Colorfield',
    category: 'Creative',
    blurb:
      'An expressive art direction with vivid gradients, collage forms and playful composition.',
    preview: 'creative',
  },

  {
    id: 'tech-dark',
    label: 'Tech Dark',
    category: 'Digital',
    blurb:
      'A cinematic dark interface with neon edge light, 3D data forms and terminal details.',
    preview: 'tech-dark',
  },

  {
    id: 'executive',
    label: 'Maison No. 6',
    category: 'Executive',
    blurb:
      'An editorial profile with refined typography, warm materials and a gold sculptural motif.',
    preview: 'executive',
  },

  {
    id: 'neo-brutalist',
    label: 'OFFGRID',
    category: 'Experimental',
    blurb:
      'A graphic, art-led layout with oversized type, poster colors and sharp dimensional blocks.',
    preview: 'neo-brutalist',
  },

  {
    id: 'ai-studio',
    label: 'AI / 3D Studio',
    category: 'AI Generated',
    blurb:
      'A cinematic portfolio world with animated 3D-style characters and glass scene panels.',
    preview: 'ai-3d',
  },
];

/* ============================================================
   COLOR THEMES
============================================================ */

const COLOR_THEMES = [
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Professional & premium',
    primary: '#0B1220',
    accent: '#D4AF37',
    background: '#F8FAFC',
    text: '#111827',
  },

  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Fresh & modern',
    primary: '#0F3D56',
    accent: '#20C4CB',
    background: '#F4FAFC',
    text: '#102A43',
  },

  {
    id: 'emerald',
    name: 'Emerald',
    description: 'Natural & confident',
    primary: '#123C35',
    accent: '#2BB673',
    background: '#F5FAF8',
    text: '#17201D',
  },

  {
    id: 'royal',
    name: 'Royal',
    description: 'Creative & sophisticated',
    primary: '#24144D',
    accent: '#8B5CF6',
    background: '#FAF8FF',
    text: '#18122B',
  },

  {
    id: 'rose',
    name: 'Rose',
    description: 'Elegant & distinctive',
    primary: '#4A1725',
    accent: '#F43F5E',
    background: '#FFF7F8',
    text: '#26151A',
  },

  {
    id: 'amber',
    name: 'Amber',
    description: 'Warm & creative',
    primary: '#3D2A0A',
    accent: '#F59E0B',
    background: '#FFFBF2',
    text: '#241A0A',
  },
];

const API_ROOT = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api')
  .replace(/\/api\/?$/, '');

/* ============================================================
   TEMPLATE PREVIEW
============================================================ */

const TemplateVisual = ({ template, selected }) => {
  const previews = {
    minimalist: {
      layout: 'single',
      accent: '#111827',
    },
    modern: {
      layout: 'split',
      accent: '#2563EB',
    },
    creative: {
      layout: 'creative',
      accent: '#E11D48',
    },
    'tech-dark': {
      layout: 'terminal',
      accent: '#D4AF37',
    },
    executive: {
      layout: 'editorial',
      accent: '#7C3AED',
    },
    'neo-brutalist': {
      layout: 'brutal',
      accent: '#111827',
    },
    'ai-studio': {
      layout: 'ai3d',
      accent: '#7C8CFF',
    },
  };

  const preview = previews[template.id] || previews.minimalist;

  return (
    <div
      className={`
        relative h-[108px] w-[145px] shrink-0 overflow-hidden
        rounded-xl border transition-all duration-300
        ${
          selected
            ? 'border-[#111827] shadow-[0_8px_25px_rgba(15,23,42,0.12)]'
            : 'border-gray-200'
        }
      `}
    >
      {/* Mini browser bar */}
      <div className="flex h-5 items-center gap-1 border-b border-gray-100 bg-white px-2">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
      </div>

      {/* Minimal */}
      {preview.layout === 'single' && (
        <div className="space-y-2 p-3">
          <div
            className="h-2 w-2/3 rounded"
            style={{ backgroundColor: preview.accent }}
          />

          <div className="h-1.5 w-full rounded bg-gray-200" />
          <div className="h-1.5 w-4/5 rounded bg-gray-200" />

          <div className="mt-3 grid grid-cols-2 gap-1">
            <div className="h-7 rounded bg-gray-100" />
            <div className="h-7 rounded bg-gray-100" />
          </div>
        </div>
      )}

      {/* Modern */}
      {preview.layout === 'split' && (
        <div className="flex h-full">
          <div
            className="w-[32%]"
            style={{ backgroundColor: preview.accent }}
          />

          <div className="flex-1 space-y-2 p-3">
            <div className="h-2 w-3/4 rounded bg-gray-800" />
            <div className="h-1.5 w-full rounded bg-gray-200" />
            <div className="h-1.5 w-4/5 rounded bg-gray-200" />

            <div className="mt-3 h-7 rounded bg-gray-100" />
          </div>
        </div>
      )}

      {/* Creative */}
      {preview.layout === 'creative' && (
        <div className="relative h-full p-3">
          <div
            className="absolute right-2 top-2 h-10 w-10 rounded-full opacity-80"
            style={{ backgroundColor: preview.accent }}
          />

          <div className="relative space-y-2 pt-2">
            <div className="h-3 w-3/5 rounded bg-gray-900" />
            <div className="h-1.5 w-4/5 rounded bg-gray-200" />
            <div className="h-1.5 w-1/2 rounded bg-gray-200" />
          </div>

          <div className="absolute bottom-3 left-3 right-3 h-5 rounded bg-gray-100" />
        </div>
      )}

      {/* Tech Dark */}
      {preview.layout === 'terminal' && (
        <div className="h-full bg-[#080D18] p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-[5px] text-[#D4A24E]">
              &gt; portfolio
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="h-2 w-3/5 rounded bg-white/80" />
            <div className="h-1 w-4/5 rounded bg-white/20" />
            <div className="h-1 w-3/5 rounded bg-[#D4A24E]/70" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-1">
            <div className="h-6 rounded border border-white/10 bg-white/[0.03]" />
            <div className="h-6 rounded border border-white/10 bg-white/[0.03]" />
          </div>
        </div>
      )}

      {/* Executive */}
      {preview.layout === 'editorial' && (
        <div className="space-y-2 p-3">
          <div className="h-1 w-1/4 bg-gray-300" />

          <div
            className="h-3 w-full rounded-sm"
            style={{ backgroundColor: preview.accent }}
          />

          <div className="h-1.5 w-4/5 rounded bg-gray-200" />
          <div className="h-1.5 w-3/5 rounded bg-gray-200" />

          <div className="mt-3 h-6 border-t border-gray-200" />
        </div>
      )}

      {/* Neo Brutalist */}
      {preview.layout === 'brutal' && (
        <div className="h-full bg-[#F4F4F0] p-3">
          <div className="border-2 border-black bg-white p-2">
            <div className="h-2 w-3/4 bg-black" />
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="h-6 border-2 border-black bg-yellow-300" />
            <div className="h-6 border-2 border-black bg-white" />
          </div>
        </div>
      )}

      {/* AI / 3D Studio */}
      {preview.layout === 'ai3d' && (
        <div className="relative h-full overflow-hidden bg-[#0b1020] p-3">
          <div
            className="absolute right-3 top-7 h-10 w-10 rounded-full blur-[1px]"
            style={{ backgroundColor: preview.accent, opacity: 0.7 }}
          />
          <div className="relative z-10 h-2 w-2/3 rounded-full bg-white/90" />
          <div className="mt-2 h-1.5 w-1/2 rounded-full bg-white/40" />
          <div className="absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-2">
            <div className="h-8 rounded-xl border border-white/20 bg-white/10 shadow-lg backdrop-blur" />
            <div className="h-8 rounded-xl border border-white/20 bg-white/10 shadow-lg backdrop-blur" />
          </div>
        </div>
      )}

      {selected && (
        <div className="absolute right-2 top-7 flex h-5 w-5 items-center justify-center rounded-full bg-[#111827] text-white shadow-lg">
          <Check size={11} strokeWidth={3} />
        </div>
      )}
    </div>
  );
};

/* ============================================================
   PORTFOLIO PAGE
============================================================ */

const PortfolioPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);

  const [selectedTheme, setSelectedTheme] = useState('midnight');

  const previewHtml = data?.html?.replace(
    /<head([^>]*)>/i,
    `<head$1><base href="${API_ROOT}/">`
  );

  const load = async () => {
    setLoading(true);

    try {
      const d = await portfolioService.getMine();

      setData(d);

      if (d?.colorTheme) {
        setSelectedTheme(d.colorTheme);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to load portfolio'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ============================================================
     TEMPLATE CHANGE
  ============================================================ */

  const handleTemplateChange = async (id) => {
    if (switching) return;

    setSwitching(true);

    try {
      await portfolioService.setTemplate(id);

      toast.success('Portfolio template updated');

      await load();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to switch template'
      );
    } finally {
      setSwitching(false);
    }
  };

  /* ============================================================
     THEME CHANGE
  ============================================================ */

  const handleThemeChange = async (themeId) => {
    if (switching) return;

    setSwitching(true);

    try {
      const result =
        await portfolioService.setColorTheme(themeId);

      setSelectedTheme(result.colorTheme);

      setData((prev) => ({
        ...prev,
        ...result,
      }));

      toast.success(
        `${COLOR_THEMES.find((t) => t.id === themeId)?.name || 'Color theme'} applied`
      );
    } catch (err) {
      console.error('Theme change error:', err);

      toast.error(
        err.response?.data?.message ||
          'Failed to update color theme'
      );
    } finally {
      setSwitching(false);
    }
  };

  /* ============================================================
     REGENERATE
  ============================================================ */

  const handleRegenerate = async () => {
    if (switching) return;

    setSwitching(true);

    try {
      await portfolioService.regenerate();

      toast.success('Portfolio regenerated');

      await load();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to regenerate portfolio'
      );
    } finally {
      setSwitching(false);
    }
  };

  const activeTheme =
    COLOR_THEMES.find(
      (theme) => theme.id === selectedTheme
    ) || COLOR_THEMES[0];

  return (
    <div className="min-h-full pb-12">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative mb-7 overflow-hidden rounded-[30px] bg-ink text-white shadow-[0_25px_80px_rgba(0,0,0,0.13)]">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />

          <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />

          <div className="absolute right-10 top-10 h-64 w-64 rounded-full border border-white/[0.05]" />

          <div className="absolute right-20 top-20 h-44 w-44 rounded-full border border-white/[0.04]" />

        </div>

        <div className="relative p-7 sm:p-9">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 backdrop-blur-md">

            <Sparkles
              size={14}
              className="text-gold"
            />

            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/60">
              Portfolio Studio
            </span>

          </div>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-2xl">

              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Build your professional identity.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Choose a premium layout, customize your visual identity,
                and publish a portfolio generated directly from your
                profile data.
              </p>

            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                <Globe2
                  size={18}
                  className="text-gold"
                />
              </div>

              <div>

                <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                  Portfolio Status
                </p>

                <p className="mt-0.5 text-sm font-medium">
                  Live & Generated
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PUBLIC LINK
      ===================================================== */}

      {data && (
        <section className="mb-7 overflow-hidden rounded-[24px] border border-gray-200/80 bg-white shadow-[0_12px_45px_rgba(15,23,42,0.045)]">

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <Globe2
                  size={18}
                  className="text-emerald-600"
                />
              </div>

              <div className="min-w-0">

                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                  Public Portfolio
                </p>

                <a
                  href={data.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block truncate text-sm font-medium text-ink transition-colors hover:text-gold"
                >
                  {data.publicUrl}
                </a>

              </div>

            </div>

            <a
              href={data.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gray-950
                px-4
                py-2.5
                text-xs
                font-medium
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-gray-800
                hover:shadow-lg
              "
            >
              <Eye size={14} />

              <span>
                View Portfolio
              </span>

              <ExternalLink
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

          </div>

        </section>
      )}

      {/* =====================================================
          DESIGN SYSTEM
      ===================================================== */}

      <section className="mb-7 overflow-hidden rounded-[28px] border border-gray-200/70 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.055)]">

        {/* Header */}

        <div className="flex flex-col gap-5 border-b border-gray-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white shadow-sm">
              <LayoutTemplate size={17} />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <span className="font-mono text-[8px] font-medium uppercase tracking-[0.2em] text-gray-400">
                  Design System
                </span>

                <span className="h-1 w-1 rounded-full bg-gray-300" />

                <span className="font-mono text-[8px] uppercase tracking-widest text-gray-400">
                  Customize
                </span>

              </div>

              <h2 className="mt-1 text-lg font-semibold tracking-tight text-gray-950">
                Portfolio appearance
              </h2>

            </div>

          </div>

          {/* Current design */}

          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">

            <span className="text-[10px] text-gray-400">
              Current
            </span>

            <span className="h-1 w-1 rounded-full bg-gray-300" />

            <span className="text-[10px] font-semibold text-gray-900">
              {
                TEMPLATES.find(
                  (t) => t.id === data?.templatePreference
                )?.label || 'Minimalist'
              }
            </span>

            <span
              className="ml-1 h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: activeTheme.accent,
              }}
            />

          </div>

        </div>


        {/* Template Tabs */}

        <div className="px-5 py-5 sm:px-6">

          <div className="mb-3 flex items-center justify-between">

            <div>

              <p className="text-xs font-semibold text-gray-900">
                Layout
              </p>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Select your portfolio structure
              </p>

            </div>

            <span className="font-mono text-[8px] uppercase tracking-widest text-gray-300">
              {TEMPLATES.length} styles
            </span>

          </div>


          <div className="flex flex-wrap gap-2">

            {TEMPLATES.map((template) => {

              const selected =
                data?.templatePreference === template.id;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() =>
                    handleTemplateChange(template.id)
                  }
                  disabled={switching}
                  className={`
                    group
                    relative
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3
                    py-2
                    text-left
                    transition-all
                    duration-200
                    ${
                      selected
                        ? 'border-gray-950 bg-gray-950 text-white shadow-[0_5px_18px_rgba(15,23,42,0.15)]'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-950'
                    }
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  `}
                >

                  {/* Mini visual indicator */}

                  <span
                    className={`
                      flex
                      h-6
                      w-6
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-full
                      border
                      ${
                        selected
                          ? 'border-white/20 bg-white/10'
                          : 'border-gray-200 bg-gray-50'
                      }
                    `}
                  >

                    <span
                      className={`
                        h-2
                        w-2
                        rounded-full
                        ${
                          selected
                            ? 'bg-white'
                            : 'bg-gray-400'
                        }
                      `}
                    />

                  </span>

                  <span className="text-[11px] font-medium">
                    {template.label}
                  </span>

                  {selected && (
                    <Check
                      size={12}
                      strokeWidth={2.5}
                      className="ml-0.5 text-white"
                    />
                  )}

                </button>
              );
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          COLOR IDENTITY
      ===================================================== */}

      <section className="mb-7 overflow-hidden rounded-[28px] border border-gray-200/70 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.055)]">

        <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
              <Palette
                size={17}
                className="text-gray-900"
              />
            </div>

            <div>

              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-gray-400">
                Color identity
              </span>

              <h2 className="mt-1 text-lg font-semibold tracking-tight text-gray-950">
                Choose your accent
              </h2>

            </div>

          </div>


          {/* Active theme */}

          <div className="flex items-center gap-2">

            <span className="text-[10px] text-gray-400">
              {activeTheme.name}
            </span>

            <span
              className="h-5 w-5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
              style={{
                backgroundColor: activeTheme.accent,
              }}
            />

          </div>

        </div>


        {/* Round Theme Selector */}

        <div className="border-t border-gray-100 px-6 py-5">

          <div className="flex flex-wrap items-center gap-4">

            {COLOR_THEMES.map((theme) => {

              const selected =
                selectedTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() =>
                    handleThemeChange(theme.id)
                  }
                  disabled={switching}
                  title={theme.name}
                  aria-label={`Select ${theme.name} color theme`}
                  className="group relative flex flex-col items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {/* Outer selection ring */}

                  <span
                    className={`
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      transition-all
                      duration-200
                      ${
                        selected
                          ? 'ring-2 ring-gray-950 ring-offset-2'
                          : 'group-hover:ring-2 group-hover:ring-gray-200 group-hover:ring-offset-2'
                      }
                    `}
                  >

                    {/* Actual color */}

                    <span
                      className="h-10 w-10 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12),0_4px_12px_rgba(15,23,42,0.12)] transition-transform duration-200 group-hover:scale-105"
                      style={{
                        backgroundColor:
                          theme.accent,
                      }}
                    />

                  </span>


                  {/* Selected check */}

                  {selected && (
                    <span className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-[calc(50%+8px)] items-center justify-center rounded-full bg-white shadow-md">
                      <Check
                        size={11}
                        strokeWidth={3}
                        style={{
                          color: theme.accent,
                        }}
                      />
                    </span>
                  )}


                  <span
                    className={`
                      text-[9px]
                      font-medium
                      transition-colors
                      ${
                        selected
                          ? 'text-gray-950'
                          : 'text-gray-400 group-hover:text-gray-700'
                      }
                    `}
                  >
                    {theme.name}
                  </span>

                </button>
              );
            })}

          </div>

        </div>


        {/* Tiny color specification */}

        <div className="border-t border-gray-100 px-6 py-3">

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

            <div className="flex items-center gap-2">

              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    activeTheme.primary,
                }}
              />

              <span className="font-mono text-[8px] uppercase tracking-wider text-gray-400">
                Primary
              </span>

            </div>


            <div className="flex items-center gap-2">

              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    activeTheme.accent,
                }}
              />

              <span className="font-mono text-[8px] uppercase tracking-wider text-gray-400">
                Accent
              </span>

            </div>


            <div className="ml-auto hidden font-mono text-[8px] uppercase tracking-widest text-gray-300 sm:block">
              {activeTheme.description}
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          ACTIVE DESIGN SUMMARY
      ===================================================== */}

      <section className="mb-7 overflow-hidden rounded-[24px] bg-ink text-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">

        <div className="relative p-5 sm:p-6">

          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gold/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <Sparkles
                  size={14}
                  className="text-gold"
                />

                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
                  Current Design
                </span>

              </div>

              <div className="flex flex-wrap items-center gap-3">

                <span className="text-sm font-semibold">
                  {
                    TEMPLATES.find(
                      (t) =>
                        t.id ===
                        data?.templatePreference
                    )?.label || 'Minimalist'
                  }
                </span>

                <span className="h-1 w-1 rounded-full bg-white/20" />

                <span className="text-sm text-white/60">
                  {activeTheme.name}
                </span>

              </div>

            </div>

            <button
              type="button"
              onClick={handleRegenerate}
              disabled={switching}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.08] px-4 py-2.5 text-xs font-medium text-white transition-all hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
            >

              <RefreshCw
                size={14}
                className={
                  switching
                    ? 'animate-spin'
                    : ''
                }
              />

              Regenerate Portfolio

            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          LIVE PREVIEW
      ===================================================== */}

      <section>

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Eye
                size={15}
                className="text-gold"
              />

              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                Live Preview
              </span>

            </div>

            <h2 className="mt-1 font-display text-xl font-semibold text-ink">
              Your portfolio
            </h2>

          </div>

          <p className="text-xs text-muted">
            Changes are reflected in your generated portfolio.
          </p>

        </div>

        <div
          className="
            overflow-hidden
            rounded-[26px]
            border
            border-gray-200/80
            bg-white
            shadow-[0_20px_60px_rgba(15,23,42,0.08)]
          "
          style={{
            height: '75vh',
            minHeight: '550px',
          }}
        >

          {loading ? (

            <div className="flex h-full items-center justify-center">

              <div className="flex flex-col items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
                  <Spinner />
                </div>

                <p className="font-mono text-[9px] uppercase tracking-widest text-muted">
                  Loading preview
                </p>

              </div>

            </div>

          ) : (

            <iframe
              title="Portfolio preview"
              srcDoc={previewHtml}
              className="h-full w-full"
            />

          )}

        </div>

      </section>

      {/* =====================================================
          FOOTER TIP
      ===================================================== */}

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-gold/20 bg-gold/[0.055] px-5 py-4">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10">

          <Sparkles
            size={15}
            className="text-gold"
          />

        </div>

        <div>

          <p className="text-xs font-semibold text-ink">
            Portfolio tip
          </p>

          <p className="mt-0.5 text-xs leading-5 text-muted">
            Choose a layout that matches your target role. Keep the
            visual identity consistent with your resume, LinkedIn profile,
            and other professional materials.
          </p>

        </div>

      </div>

    </div>
  );
};

export default PortfolioPage;
