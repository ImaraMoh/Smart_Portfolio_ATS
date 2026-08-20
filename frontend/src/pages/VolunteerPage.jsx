import React from 'react';
import {
  Sparkles,
  HeartHandshake,
  Users,
  Target,
  CheckCircle2,
  CalendarDays,
  HandHeart,
  Globe2,
} from 'lucide-react';

import EntitySection from '../components/dashboard/EntitySection.jsx';
import { volunteerService } from '../services/entityService';

const fields = [
  {
    name: 'organization',
    label: 'Organization',
    required: true,
    placeholder: 'Red Cross',
  },
  {
    name: 'role',
    label: 'Role',
    required: true,
    placeholder: 'Event Coordinator',
  },
  {
    name: 'startDate',
    label: 'Start Date',
    type: 'date',
    required: true,
  },
  {
    name: 'endDate',
    label: 'End Date (leave blank if current)',
    type: 'date',
  },
  {
    name: 'isCurrent',
    label: 'I currently volunteer here',
    type: 'checkbox',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder:
      'Describe your responsibilities, contributions, leadership, achievements, or community impact...',
  },
];

const VolunteerPage = () => {
  return (
    <div className="min-h-full pb-10">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative mb-7 overflow-hidden rounded-[28px] bg-ink text-white shadow-[0_25px_70px_rgba(0,0,0,0.12)]">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="absolute right-[-70px] top-[-70px] h-64 w-64 rounded-full border border-white/[0.05]" />

          <div className="absolute bottom-[-100px] left-[-60px] h-56 w-56 rounded-full border border-gold/[0.08]" />

        </div>

        <div className="relative p-7 sm:p-9">

          {/* Eyebrow */}
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

            {/* Hero content */}
            <div className="max-w-2xl">

              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Volunteering
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Showcase the communities you've contributed to, the causes
                you've supported, and the impact you've created beyond your
                professional work.
              </p>

            </div>

            {/* Hero badge */}
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                <HeartHandshake
                  size={18}
                  className="text-gold"
                />
              </div>

              <div>

                <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                  Profile Section
                </p>

                <p className="mt-0.5 text-sm font-medium">
                  Community Impact
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

        {/* Leadership */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">

              <Users
                size={16}
                className="text-violet-600"
              />

            </div>

            <div>

              <p className="text-xs font-medium text-ink">
                Leadership
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Showcase initiative
              </p>

            </div>

          </div>

        </div>

        {/* Community */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">

              <Globe2
                size={16}
                className="text-emerald-600"
              />

            </div>

            <div>

              <p className="text-xs font-medium text-ink">
                Community
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Highlight your contribution
              </p>

            </div>

          </div>

        </div>

        {/* Impact */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">

              <Target
                size={16}
                className="text-gold"
              />

            </div>

            <div>

              <p className="text-xs font-medium text-ink">
                Impact
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Show meaningful results
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          VOLUNTEER EXPERIENCE
      ===================================================== */}
      <section className="overflow-hidden rounded-[26px] border border-gray-200/80 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.05)]">

        <EntitySection
          title="Community Contributions"
          description="Organizations, roles and community experiences that strengthen your professional story."
          service={volunteerService}
          fields={fields}
          emptyLabel="Add volunteering experience, community work, leadership activities, or causes you've contributed to."
          renderSummary={(volunteer) => {

            const startDate = volunteer.startDate
              ? new Date(volunteer.startDate).toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    year: 'numeric',
                  }
                )
              : '';

            const endDate = volunteer.isCurrent
              ? 'Present'
              : volunteer.endDate
                ? new Date(volunteer.endDate).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      year: 'numeric',
                    }
                  )
                : '';

            return (
              <div className="min-h-[210px]">

                {/* =================================================
                    TOP
                ================================================= */}
                <div className="flex items-start justify-between gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50">

                    <HandHeart
                      size={19}
                      className="text-rose-600"
                    />

                  </div>

                  {volunteer.isCurrent && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-700">

                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                      Currently Active

                    </span>
                  )}

                </div>

                {/* =================================================
                    ROLE
                ================================================= */}
                <div className="mt-5">

                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {volunteer.role}
                  </h3>

                  <div className="mt-1 flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />

                    <span className="text-sm font-medium text-muted">
                      {volunteer.organization}
                    </span>

                  </div>

                </div>

                {/* =================================================
                    DATE
                ================================================= */}
                {(startDate || endDate) && (
                  <div className="mt-5 flex items-center gap-2">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50">

                      <CalendarDays
                        size={13}
                        className="text-gray-500"
                      />

                    </div>

                    <div>

                      <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-gray-400">
                        Contribution Period
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-ink">
                        {startDate}
                        {startDate && endDate ? ' — ' : ''}
                        {endDate}
                      </p>

                    </div>

                  </div>
                )}

                {/* =================================================
                    DESCRIPTION
                ================================================= */}
                {volunteer.description && (
                  <div className="mt-5 rounded-xl bg-gray-50/80 px-3.5 py-3">

                    <p className="line-clamp-3 text-[11px] leading-5 text-muted">
                      {volunteer.description}
                    </p>

                  </div>
                )}

                {/* =================================================
                    FOOTER
                ================================================= */}
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">

                  <span className="font-mono text-[8px] uppercase tracking-widest text-gray-300">
                    Community Experience
                  </span>

                  <span className="inline-flex items-center gap-1 text-[9px] font-medium text-muted">

                    <CheckCircle2
                      size={11}
                      className="text-emerald-500"
                    />

                    Profile ready

                  </span>

                </div>

              </div>
            );
          }}
        />

      </section>

      {/* =====================================================
          PROFILE TIP
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
            Profile tip
          </p>

          <p className="mt-0.5 text-xs leading-5 text-muted">
            Focus on measurable impact when describing your volunteering.
            Mention leadership, events organized, people supported, projects
            completed, or outcomes you helped achieve.
          </p>

        </div>

      </div>

    </div>
  );
};

export default VolunteerPage;
