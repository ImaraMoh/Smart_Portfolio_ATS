import React from 'react';
import {
  Sparkles,
  Code2,
  Wrench,
  Languages,
  HeartHandshake,
  Target,
  Zap,
  CheckCircle2,
  Layers3,
} from 'lucide-react';

import EntitySection from '../components/dashboard/EntitySection.jsx';
import { skillService } from '../services/entityService';

const fields = [
  {
    name: 'skillName',
    label: 'Skill',
    required: true,
    placeholder: 'React.js',
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      'technical',
      'soft',
      'tool',
      'language',
    ],
  },
  {
    name: 'proficiencyLevel',
    label: 'Proficiency',
    type: 'select',
    options: [
      'beginner',
      'intermediate',
      'advanced',
      'expert',
    ],
  },
];

const CATEGORY_CONFIG = {
  technical: {
    label: 'Technical',
    icon: Code2,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    dot: 'bg-blue-500',
  },

  tool: {
    label: 'Tool',
    icon: Wrench,
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    dot: 'bg-violet-500',
  },

  language: {
    label: 'Language',
    icon: Languages,
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    dot: 'bg-emerald-500',
  },

  soft: {
    label: 'Soft Skill',
    icon: HeartHandshake,
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    dot: 'bg-rose-500',
  },
};

const PROFICIENCY_CONFIG = {
  beginner: {
    label: 'Beginner',
    percentage: 25,
  },

  intermediate: {
    label: 'Intermediate',
    percentage: 50,
  },

  advanced: {
    label: 'Advanced',
    percentage: 75,
  },

  expert: {
    label: 'Expert',
    percentage: 100,
  },
};

const SkillsPage = () => {
  return (
    <div className="min-h-full pb-10">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative mb-7 overflow-hidden rounded-[28px] bg-ink text-white shadow-[0_25px_70px_rgba(0,0,0,0.12)]">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="absolute right-[-70px] top-[-70px] h-64 w-64 rounded-full border border-white/[0.05]" />

        </div>

        <div className="relative p-7 sm:p-9">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2">

            <Sparkles
              size={14}
              className="text-gold"
            />

            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
              Professional Profile
            </span>

          </div>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-2xl">

              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Skills
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Build a focused skills profile that highlights your expertise
                and improves your ATS keyword matching.
              </p>

            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                <Target
                  size={18}
                  className="text-gold"
                />
              </div>

              <div>

                <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                  Profile Section
                </p>

                <p className="mt-0.5 text-sm font-medium">
                  Skill Intelligence
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          INFO CARDS
      ===================================================== */}
      <div className="mb-7 grid gap-3 sm:grid-cols-3">

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
              <Zap
                size={16}
                className="text-emerald-600"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-ink">
                ATS Keywords
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Improve job matching
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <Code2
                size={16}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-ink">
                Technical Skills
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Technologies & expertise
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <CheckCircle2
                size={16}
                className="text-gold"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-ink">
                Proficiency
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Highlight your strengths
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          SKILL LIBRARY
      ===================================================== */}
      <section className="overflow-hidden rounded-[26px] border border-gray-200/80 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.05)]">

        <EntitySection
          title="Skill Library"
          description="Your technical skills, tools, languages and professional strengths."
          service={skillService}
          fields={fields}
          layout="grid"
          emptyLabel="Add the skills recruiters search for in your field."
          renderSummary={(skill) => {

            const category =
              CATEGORY_CONFIG[skill.category] ||
              CATEGORY_CONFIG.technical;

            const proficiency =
              PROFICIENCY_CONFIG[
                skill.proficiencyLevel
              ] ||
              PROFICIENCY_CONFIG.intermediate;

            const Icon = category.icon;

            return (
              <div className="min-h-[190px]">

                {/* =================================================
                    TOP
                ================================================= */}
                <div className="flex items-start justify-between gap-3">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${category.bg}`}
                  >
                    <Icon
                      size={19}
                      className={category.iconColor}
                    />
                  </div>

                  {skill.proficiencyLevel === 'expert' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-1 text-[9px] font-semibold text-ink">
                      <Sparkles
                        size={9}
                        className="text-gold"
                      />
                      Expert
                    </span>
                  )}

                </div>

                {/* =================================================
                    SKILL NAME
                ================================================= */}
                <div className="mt-5">

                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {skill.skillName}
                  </h3>

                  <div className="mt-1 flex items-center gap-2">

                    <span
                      className={`h-1.5 w-1.5 rounded-full ${category.dot}`}
                    />

                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                      {category.label}
                    </span>

                  </div>

                </div>

                {/* =================================================
                    PROFICIENCY
                ================================================= */}
                <div className="mt-6">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-gray-400">
                      Proficiency
                    </span>

                    <span className="text-[10px] font-semibold text-ink">
                      {proficiency.label}
                    </span>

                  </div>

                  <div className="flex gap-1">

                    {[25, 50, 75, 100].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          proficiency.percentage >= level
                            ? 'bg-ink'
                            : 'bg-gray-100'
                        }`}
                      />
                    ))}

                  </div>

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-3">

                  <span className="font-mono text-[8px] uppercase tracking-widest text-gray-300">
                    ATS Skill
                  </span>

                  <span className="inline-flex items-center gap-1 text-[9px] font-medium text-muted">

                    <Layers3 size={11} />

                    Profile ready

                  </span>

                </div>

              </div>
            );
          }}
        />

      </section>

      {/* =====================================================
          ATS TIP
      ===================================================== */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-gold/20 bg-gold/[0.06] px-5 py-4">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10">
          <Sparkles
            size={15}
            className="text-gold"
          />
        </div>

        <div>

          <p className="text-xs font-semibold text-ink">
            ATS tip
          </p>

          <p className="mt-0.5 text-xs leading-5 text-muted">
            Add skills using the same terminology recruiters use in job
            descriptions. Group them accurately and keep your proficiency
            levels realistic.
          </p>

        </div>

      </div>

    </div>
  );
};

export default SkillsPage;
