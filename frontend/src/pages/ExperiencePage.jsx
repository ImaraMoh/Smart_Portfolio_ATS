import React from 'react';
import {
  BriefcaseBusiness,
  Sparkles,
  MapPin,
  CalendarDays,
  Building2,
  CheckCircle2,
  Code2,
} from 'lucide-react';

import EntitySection from '../components/dashboard/EntitySection.jsx';
import { experienceService } from '../services/entityService';

const fields = [
  {
    name: 'company',
    label: 'Company',
    required: true,
    placeholder: 'Acme Corp',
  },
  {
    name: 'role',
    label: 'Role / Title',
    required: true,
    placeholder: 'Software Engineer Intern',
  },
  {
    name: 'location',
    label: 'Location',
    placeholder: 'Colombo, Sri Lanka',
  },
  {
    name: 'employmentType',
    label: 'Employment Type',
    type: 'select',
    options: [
      'full-time',
      'part-time',
      'internship',
      'contract',
      'freelance',
    ],
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
    label: 'I currently work here',
    type: 'checkbox',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder:
      'Describe your responsibilities, achievements, impact, and major contributions...',
  },
  {
    name: 'technologies',
    label: 'Technologies',
    type: 'tags',
  },
];

const formatDate = (date) => {
  if (!date) return '';

  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

const ExperiencePage = () => {
  return (
    <div className="min-h-full pb-10">

      {/* =====================================================
          PREMIUM HERO
      ===================================================== */}
      <section className="relative mb-7 overflow-hidden rounded-[28px] bg-ink text-white shadow-[0_25px_70px_rgba(0,0,0,0.12)]">

        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/[0.05]" />

          <div className="absolute right-8 top-8 h-28 w-28 rounded-full border border-gold/10" />

        </div>

        <div className="relative p-7 sm:p-9">

          {/* Eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2">

            <BriefcaseBusiness
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
                Experience
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Showcase the roles, internships and projects that demonstrate
                your professional growth and technical impact.
              </p>

            </div>

            {/* Profile badge */}
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                <BriefcaseBusiness
                  size={18}
                  className="text-gold"
                />
              </div>

              <div>

                <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                  Profile Section
                </p>

                <p className="mt-0.5 text-sm font-medium">
                  Career Journey
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          QUICK INFO CARDS
      ===================================================== */}
      <div className="mb-7 grid gap-3 sm:grid-cols-3">

        {/* ATS */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
              <CheckCircle2
                size={16}
                className="text-emerald-600"
              />
            </div>

            <div>

              <p className="text-xs font-medium text-ink">
                ATS Optimized
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Strong career signals
              </p>

            </div>

          </div>

        </div>

        {/* Technologies */}
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
                Technologies & tools
              </p>

            </div>

          </div>

        </div>

        {/* Portfolio */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <Sparkles
                size={16}
                className="text-gold"
              />
            </div>

            <div>

              <p className="text-xs font-medium text-ink">
                Portfolio Ready
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Professional timeline
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          EXPERIENCE CRUD
      ===================================================== */}
      <section className="overflow-hidden rounded-[26px] border border-gray-200/80 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.05)]">

        <EntitySection
          title="Professional Experience"
          description="Roles, internships and professional engagements that shape your career."
          service={experienceService}
          fields={fields}
          emptyLabel="Add your first role or internship to start building your professional timeline."
          renderSummary={(experience) => (
            <div>

              {/* Main row */}
              <div className="flex items-start gap-4">

                {/* Company icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink shadow-md shadow-ink/10">
                  <Building2
                    size={19}
                    className="text-gold"
                  />
                </div>

                <div className="min-w-0 flex-1">

                  {/* Role */}
                  <h3 className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
                    {experience.role}
                  </h3>

                  {/* Company */}
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">

                    <span className="font-medium text-muted">
                      {experience.company}
                    </span>

                    {experience.location && (
                      <>
                        <span className="hidden text-gray-300 sm:inline">
                          ·
                        </span>

                        <span className="inline-flex items-center gap-1 text-muted">
                          <MapPin size={12} />
                          {experience.location}
                        </span>
                      </>
                    )}

                  </div>

                  {/* Metadata */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">

                    {/* Employment */}
                    {experience.employmentType && (
                      <span className="inline-flex items-center rounded-full bg-ink/[0.06] px-2.5 py-1 text-[10px] font-semibold capitalize text-ink">
                        {experience.employmentType.replace(
                          '-',
                          ' '
                        )}
                      </span>
                    )}

                    {/* Dates */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 font-mono text-[10px] text-muted">

                      <CalendarDays size={11} />

                      {formatDate(experience.startDate)}

                      <span className="text-gray-300">
                        →
                      </span>

                      {experience.isCurrent
                        ? 'Present'
                        : formatDate(experience.endDate)}

                    </span>

                    {/* Current */}
                    {experience.isCurrent && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">

                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                        Current role

                      </span>
                    )}

                  </div>

                  {/* Description */}
                  {experience.description && (
                    <p className="mt-4 max-w-2xl text-xs leading-5 text-muted">
                      {experience.description}
                    </p>
                  )}

                  {/* Technologies */}
                  {experience.technologies?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">

                      {experience.technologies.map(
                        (technology, index) => (
                          <span
                            key={`${technology}-${index}`}
                            className="
                              inline-flex
                              items-center
                              rounded-lg
                              border
                              border-gray-100
                              bg-white
                              px-2.5
                              py-1
                              font-mono
                              text-[9px]
                              text-gray-500
                              shadow-sm
                            "
                          >
                            {technology}
                          </span>
                        )
                      )}

                    </div>
                  )}

                </div>

              </div>

            </div>
          )}
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
            Use specific job titles, measurable achievements and relevant
            technologies. These details help the ATS identify your experience
            when matching against a job description.
          </p>

        </div>

      </div>

    </div>
  );
};

export default ExperiencePage;
