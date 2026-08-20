import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/common/Card.jsx';
import Spinner from '../components/common/Spinner.jsx';
import {
  educationService,
  experienceService,
  skillService,
  projectService,
  volunteerService
} from '../services/entityService';

import {
  GraduationCap,
  BriefcaseBusiness,
  Sparkles,
  FolderKanban,
  HeartHandshake,
  ArrowUpRight,
  ArrowRight,
  UserRound,
  Target,
  CheckCircle2,
  TrendingUp,
  Layers3,
  Eye,
  Zap
} from 'lucide-react';

const STAT_LINKS = [
  {
    key: 'education',
    label: 'Education',
    description: 'Academic background & qualifications',
    to: '/dashboard/education',
    service: educationService,
    icon: GraduationCap,
    accent: 'from-blue-500/15 to-indigo-500/5'
  },
  {
    key: 'experience',
    label: 'Experience',
    description: 'Work history & achievements',
    to: '/dashboard/experience',
    service: experienceService,
    icon: BriefcaseBusiness,
    accent: 'from-amber-500/15 to-orange-500/5'
  },
  {
    key: 'skills',
    label: 'Skills',
    description: 'Technical & professional skills',
    to: '/dashboard/skills',
    service: skillService,
    icon: Sparkles,
    accent: 'from-violet-500/15 to-purple-500/5'
  },
  {
    key: 'projects',
    label: 'Projects',
    description: 'Projects & technical work',
    to: '/dashboard/projects',
    service: projectService,
    icon: FolderKanban,
    accent: 'from-emerald-500/15 to-teal-500/5'
  },
  {
    key: 'volunteer',
    label: 'Volunteering',
    description: 'Leadership & community impact',
    to: '/dashboard/volunteer',
    service: volunteerService,
    icon: HeartHandshake,
    accent: 'from-rose-500/15 to-pink-500/5'
  }
];

const DashboardHome = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    const load = async () => {
      const results = await Promise.all(
        STAT_LINKS.map((s) => s.service.list().catch(() => []))
      );

      const c = {};

      STAT_LINKS.forEach((s, i) => {
        c[s.key] = results[i].length;
      });

      setCounts(c);
    };

    load();
  }, []);

  const completeness = useMemo(() => {
    if (!counts) return null;

    return Math.round(
      (STAT_LINKS.filter((s) => counts[s.key] > 0).length /
        STAT_LINKS.length) *
        100
    );
  }, [counts]);

  const firstName = user?.name
    ? user.name.split(' ')[0]
    : 'there';

  const totalItems = counts
    ? Object.values(counts).reduce((sum, value) => sum + value, 0)
    : 0;

  return (
    <div className="min-h-full pb-10">

      {/* =========================================================
          PREMIUM HEADER
      ========================================================= */}
      <section className="relative overflow-hidden rounded-[28px] bg-ink text-white mb-8 shadow-[0_25px_70px_rgba(0,0,0,0.14)]">

        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-28 -right-20 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="absolute top-0 right-0 w-[420px] h-[420px] opacity-[0.04]">
            <div className="absolute inset-8 rounded-full border border-white" />
            <div className="absolute inset-20 rounded-full border border-white" />
            <div className="absolute inset-32 rounded-full border border-white" />
          </div>
        </div>

        <div className="relative p-7 sm:p-9 lg:p-10">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 mb-5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>

                <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/70">
                  Portfolio Workspace
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[46px] leading-[1.08] font-display font-semibold tracking-tight">
                Welcome back,
                <span className="text-gold"> {firstName}</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-white/60">
                Build a stronger professional profile, improve your ATS
                compatibility, and turn your career data into a portfolio
                that stands out.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-7">
                <Link
                  to="/dashboard/portfolio"
                  className="
                    inline-flex items-center gap-2 rounded-xl
                    bg-gold text-ink px-5 py-3
                    text-sm font-semibold
                    shadow-[0_10px_30px_rgba(240,180,41,0.2)]
                    hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(240,180,41,0.28)]
                    transition-all duration-300
                  "
                >
                  <Eye size={17} />
                  View Portfolio
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  to="/dashboard/ats"
                  className="
                    inline-flex items-center gap-2 rounded-xl
                    border border-white/15 bg-white/[0.06]
                    backdrop-blur-sm px-5 py-3
                    text-sm font-medium text-white
                    hover:bg-white/[0.11] hover:border-white/25
                    transition-all duration-300
                  "
                >
                  <Target size={17} />
                  Check ATS Score
                </Link>
              </div>
            </div>

            {/* Mini profile metric */}
            <div className="
              shrink-0 rounded-2xl
              border border-white/10
              bg-white/[0.06]
              backdrop-blur-md
              p-5 min-w-[205px]
            ">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/50 uppercase tracking-wider font-mono">
                  Profile Status
                </span>

                <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center">
                  <TrendingUp size={15} className="text-gold" />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-4xl font-display font-semibold">
                  {completeness === null ? '—' : completeness}
                </span>
                <span className="text-sm text-white/40 mb-1">%</span>
              </div>

              <p className="text-xs text-white/40 mt-1">
                Profile completeness
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PROFILE COMPLETENESS
      ========================================================= */}
      <section className="mb-9">

        <div className="
          relative overflow-hidden rounded-[24px]
          border border-gray-200/80
          bg-white
          p-6 sm:p-7
          shadow-[0_10px_40px_rgba(15,23,42,0.045)]
        ">

          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

          <div className="relative">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-5">

              <div className="flex items-center gap-4">

                <div className="
                  h-11 w-11 rounded-xl
                  bg-ink flex items-center justify-center
                  shadow-lg shadow-ink/10
                ">
                  <Layers3 size={19} className="text-gold" />
                </div>

                <div>
                  <h2 className="text-base font-display font-semibold text-ink">
                    Profile completeness
                  </h2>

                  <p className="text-xs text-muted mt-0.5">
                    Keep your career profile complete for better ATS results.
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-display font-semibold text-ink">
                  {completeness === null ? '—' : `${completeness}%`}
                </span>

                {completeness === 100 && (
                  <CheckCircle2
                    size={18}
                    className="text-emerald-500"
                  />
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="relative h-3 rounded-full bg-gray-100 overflow-hidden">

              <div
                className="
                  absolute inset-y-0 left-0
                  rounded-full
                  bg-gradient-to-r from-gold via-[#f6c95c] to-gold
                  shadow-[0_0_18px_rgba(240,180,41,0.35)]
                  transition-all duration-700 ease-out
                "
                style={{
                  width: `${completeness || 0}%`
                }}
              />

            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted">
                {completeness === 100
                  ? 'Your profile is fully completed.'
                  : 'Add information to unlock your strongest profile.'}
              </p>

              <span className="hidden sm:block text-[10px] font-mono uppercase tracking-widest text-gray-400">
                {totalItems} total entries
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION HEADER
      ========================================================= */}
      <div className="flex items-end justify-between mb-5">

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />

            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">
              Career Profile
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-semibold text-ink">
            Your profile sections
          </h2>

          <p className="text-sm text-muted mt-1">
            Manage the information powering your portfolio and resume.
          </p>
        </div>

      </div>

      {/* =========================================================
          PROFILE STAT CARDS
      ========================================================= */}
      {counts === null ? (
        <div className="
          rounded-[24px] border border-gray-200 bg-white
          min-h-[240px] flex items-center justify-center
          shadow-[0_10px_40px_rgba(15,23,42,0.04)]
        ">
          <Spinner />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-9">

          {STAT_LINKS.map((item) => {

            const Icon = item.icon;
            const count = counts[item.key];

            return (
              <Link
                to={item.to}
                key={item.key}
                className="group"
              >
                <div className="
                  relative overflow-hidden
                  h-full min-h-[185px]
                  rounded-[22px]
                  border border-gray-200/80
                  bg-white
                  p-5
                  shadow-[0_8px_30px_rgba(15,23,42,0.035)]
                  hover:-translate-y-1
                  hover:border-gray-300
                  hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)]
                  transition-all duration-300
                ">

                  {/* Accent glow */}
                  <div
                    className={`
                      absolute -right-12 -top-12
                      h-32 w-32 rounded-full
                      bg-gradient-to-br ${item.accent}
                      blur-2xl
                      opacity-80
                      group-hover:scale-125
                      transition-transform duration-500
                    `}
                  />

                  <div className="relative">

                    <div className="flex items-start justify-between">

                      <div className="
                        h-11 w-11 rounded-xl
                        bg-gray-50 border border-gray-100
                        flex items-center justify-center
                        group-hover:bg-ink
                        transition-colors duration-300
                      ">
                        <Icon
                          size={19}
                          className="text-ink group-hover:text-gold transition-colors"
                        />
                      </div>

                      <div className="
                        h-8 w-8 rounded-lg
                        flex items-center justify-center
                        text-gray-300
                        group-hover:text-ink
                        group-hover:bg-gray-50
                        transition-all
                      ">
                        <ArrowUpRight size={17} />
                      </div>

                    </div>

                    <div className="mt-7 flex items-end justify-between gap-4">

                      <div>
                        <div className="
                          text-3xl font-display font-semibold
                          text-ink tracking-tight
                        ">
                          {count}
                        </div>

                        <div className="text-sm font-medium text-ink mt-1">
                          {item.label}
                        </div>

                        <p className="text-xs text-muted mt-1.5">
                          {item.description}
                        </p>
                      </div>

                      {count > 0 && (
                        <div className="
                          shrink-0 h-7 px-2.5 rounded-full
                          bg-emerald-50 text-emerald-600
                          text-[10px] font-semibold
                          flex items-center gap-1
                        ">
                          <CheckCircle2 size={12} />
                          Added
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              </Link>
            );
          })}

        </div>
      )}

      {/* =========================================================
          ACTION CARDS
      ========================================================= */}
      <div className="flex items-end justify-between mb-5">

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-gold" />

            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">
              Quick Actions
            </span>
          </div>

          <h2 className="text-xl font-display font-semibold">
            Turn your data into impact
          </h2>
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-4">

        {/* Portfolio */}
        <Link
          to="/dashboard/portfolio"
          className="group"
        >
          <div className="
            relative overflow-hidden
            rounded-[24px]
            bg-ink
            text-white
            p-6 sm:p-7
            min-h-[190px]
            shadow-[0_18px_50px_rgba(15,23,42,0.13)]
            hover:-translate-y-1
            hover:shadow-[0_25px_60px_rgba(15,23,42,0.2)]
            transition-all duration-300
          ">

            <div className="
              absolute -right-16 -top-20
              h-56 w-56 rounded-full
              bg-gold/15 blur-3xl
              group-hover:bg-gold/20
              transition-all duration-500
            " />

            <div className="relative h-full flex flex-col justify-between">

              <div className="flex items-start justify-between">

                <div className="
                  h-11 w-11 rounded-xl
                  bg-gold/10 border border-gold/10
                  flex items-center justify-center
                ">
                  <Eye size={19} className="text-gold" />
                </div>

                <div className="
                  h-9 w-9 rounded-full
                  border border-white/10
                  flex items-center justify-center
                  group-hover:bg-gold
                  group-hover:text-ink
                  transition-all duration-300
                ">
                  <ArrowUpRight size={17} />
                </div>

              </div>

              <div className="mt-8">
                <h3 className="text-lg font-display font-semibold">
                  View your portfolio
                </h3>

                <p className="text-sm text-white/50 mt-1.5 max-w-sm">
                  Preview your professional profile and switch between
                  portfolio templates.
                </p>

                <div className="
                  inline-flex items-center gap-2
                  mt-5 text-xs font-semibold text-gold
                  group-hover:gap-3
                  transition-all
                ">
                  Open portfolio
                  <ArrowRight size={14} />
                </div>
              </div>

            </div>
          </div>
        </Link>

        {/* ATS */}
        <Link
          to="/dashboard/ats"
          className="group"
        >
          <div className="
            relative overflow-hidden
            rounded-[24px]
            border border-gray-200/80
            bg-white
            p-6 sm:p-7
            min-h-[190px]
            shadow-[0_10px_35px_rgba(15,23,42,0.045)]
            hover:-translate-y-1
            hover:border-gray-300
            hover:shadow-[0_22px_50px_rgba(15,23,42,0.1)]
            transition-all duration-300
          ">

            <div className="
              absolute -right-14 -top-16
              h-48 w-48 rounded-full
              bg-gold/5 blur-3xl
              group-hover:bg-gold/10
              transition-all duration-500
            " />

            <div className="relative h-full flex flex-col justify-between">

              <div className="flex items-start justify-between">

                <div className="
                  h-11 w-11 rounded-xl
                  bg-ink flex items-center justify-center
                ">
                  <Target size={19} className="text-gold" />
                </div>

                <div className="
                  h-9 w-9 rounded-full
                  border border-gray-100
                  flex items-center justify-center
                  text-gray-400
                  group-hover:bg-ink
                  group-hover:text-white
                  transition-all duration-300
                ">
                  <ArrowUpRight size={17} />
                </div>

              </div>

              <div className="mt-8">
                <h3 className="text-lg font-display font-semibold text-ink">
                  Score against a job
                </h3>

                <p className="text-sm text-muted mt-1.5 max-w-sm">
                  Analyze your profile against a job description with
                  AI-powered semantic ATS scoring.
                </p>

                <div className="
                  inline-flex items-center gap-2
                  mt-5 text-xs font-semibold text-ink
                  group-hover:gap-3
                  transition-all
                ">
                  Run ATS analysis
                  <ArrowRight size={14} />
                </div>
              </div>

            </div>
          </div>
        </Link>

      </div>

      {/* =========================================================
          FOOTER MICRO MESSAGE
      ========================================================= */}
      <div className="
        mt-8 flex flex-col sm:flex-row
        items-center justify-between gap-3
        px-1
      ">
        <div className="flex items-center gap-2 text-xs text-muted">
          <UserRound size={14} />
          <span>Your profile powers your portfolio automatically.</span>
        </div>

        <div className="
          flex items-center gap-1.5
          text-[10px] font-mono
          uppercase tracking-widest
          text-gray-400
        ">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          All systems operational
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;
