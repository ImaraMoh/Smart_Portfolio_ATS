import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
} from 'lucide-react';

import EntitySection from '../components/dashboard/EntitySection.jsx';
import { educationService } from '../services/entityService';

const fields = [
  {
    name: 'institution',
    label: 'Institution',
    required: true,
    placeholder: 'University of Colombo',
  },
  {
    name: 'degree',
    label: 'Degree',
    required: true,
    placeholder: 'B.Sc. in Computer Science',
  },
  {
    name: 'fieldOfStudy',
    label: 'Field of Study',
    placeholder: 'Software Engineering',
  },
  {
    name: 'startYear',
    label: 'Start Year',
    type: 'number',
    required: true,
    placeholder: '2022',
  },
  {
    name: 'endYear',
    label: 'End Year (leave blank if ongoing)',
    type: 'number',
    placeholder: '2026',
  },
  {
    name: 'grade',
    label: 'Grade / GPA',
    placeholder: '3.8 GPA',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder:
      'Relevant coursework, honors, thesis, achievements, or academic highlights...',
  },
];

const EducationPage = () => {
  return (
    <div className="min-h-full pb-10">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative mb-7 overflow-hidden rounded-[28px] bg-ink text-white shadow-[0_25px_70px_rgba(0,0,0,0.12)]">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="absolute right-[-80px] top-[-80px] h-72 w-72 rounded-full border border-white/[0.05]" />
        </div>

        <div className="relative p-7 sm:p-9">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2">

            <GraduationCap
              size={14}
              className="text-gold"
            />

            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
              Career Profile
            </span>

          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-2xl">

              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Education
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Showcase your academic journey, qualifications and
                achievements in one place.
              </p>

            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                <BookOpen size={18} className="text-gold" />
              </div>

              <div>

                <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                  Profile Section
                </p>

                <p className="mt-0.5 text-sm font-medium">
                  Academic Journey
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          QUICK INFO
      ===================================================== */}
      <div className="mb-7 grid gap-3 sm:grid-cols-3">

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <GraduationCap size={16} className="text-blue-600" />
            </div>

            <div>
              <p className="text-xs font-medium text-ink">
                Academic History
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Degrees & qualifications
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <Award size={16} className="text-gold" />
            </div>

            <div>
              <p className="text-xs font-medium text-ink">
                Achievements
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Grades & academic highlights
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Sparkles size={16} className="text-violet-600" />
            </div>

            <div>
              <p className="text-xs font-medium text-ink">
                ATS Ready
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Included in your profile data
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN EDUCATION CRUD
      ===================================================== */}
      <section className="overflow-hidden rounded-[26px] border border-gray-200/80 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.05)]">

        <EntitySection
          title="Academic Background"
          description="Add your degrees, diplomas, certifications and academic achievements."
          service={educationService}
          fields={fields}
          emptyLabel="Your academic journey will appear here. Add your first qualification to start building your professional profile."
          renderSummary={(education) => (
            <div>

              <div className="flex items-start gap-4">

                {/* Degree icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink shadow-md shadow-ink/10">
                  <GraduationCap
                    size={20}
                    className="text-gold"
                  />
                </div>

                <div className="min-w-0 flex-1">

                  <h3 className="font-display text-base font-semibold text-ink sm:text-lg">
                    {education.degree}

                    {education.fieldOfStudy && (
                      <span className="font-normal text-muted">
                        {' '}
                        · {education.fieldOfStudy}
                      </span>
                    )}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-muted">
                    {education.institution}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">

                    <span className="inline-flex items-center rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 font-mono text-[10px] text-muted">
                      {education.startYear} –{' '}
                      {education.endYear || 'Present'}
                    </span>

                    {education.grade && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-semibold text-ink">
                        <Award size={11} className="text-gold" />
                        {education.grade}
                      </span>
                    )}

                    {!education.endYear && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                        <CheckCircle2 size={11} />
                        Currently studying
                      </span>
                    )}

                  </div>

                  {education.description && (
                    <p className="mt-3 max-w-2xl text-xs leading-5 text-muted">
                      {education.description}
                    </p>
                  )}

                </div>

              </div>

            </div>
          )}
        />

      </section>

      {/* =====================================================
          TIP
      ===================================================== */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-gold/20 bg-gold/[0.06] px-5 py-4">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10">
          <Sparkles size={15} className="text-gold" />
        </div>

        <div>

          <p className="text-xs font-semibold text-ink">
            ATS tip
          </p>

          <p className="mt-0.5 text-xs leading-5 text-muted">
            Add relevant coursework, technical subjects, academic projects,
            honors and strong grades to give your ATS profile more useful
            context.
          </p>

        </div>

      </div>

    </div>
  );
};

export default EducationPage;
