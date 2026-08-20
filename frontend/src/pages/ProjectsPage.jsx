import React from 'react';
import {
  Sparkles,
  FolderGit2,
  ExternalLink,
  GitBranch,
  Star,
  Code2,
  Layers3,
  Rocket,
  CheckCircle2,
} from 'lucide-react';

import EntitySection from '../components/dashboard/EntitySection.jsx';
import { projectService } from '../services/entityService';

const fields = [
  {
    name: 'title',
    label: 'Project Title',
    required: true,
    placeholder: 'Smart Portfolio Generator',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder:
      'What it does, the problem it solves, and your role in building it...',
  },
  {
    name: 'technologies',
    label: 'Technologies',
    type: 'tags',
  },
  {
    name: 'repoURL',
    label: 'Repository URL',
    placeholder: 'https://github.com/you/project',
  },
  {
    name: 'liveURL',
    label: 'Live Demo URL',
    placeholder: 'https://project.vercel.app',
  },
  {
    name: 'featured',
    label: 'Feature this project',
    type: 'checkbox',
  },
];

const ProjectsPage = () => {
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
              Professional Portfolio
            </span>

          </div>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-2xl">

              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Projects
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                Showcase the projects that demonstrate your technical
                capabilities, creativity, problem-solving and real-world
                experience.
              </p>

            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                <Rocket
                  size={18}
                  className="text-gold"
                />
              </div>

              <div>

                <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                  Profile Section
                </p>

                <p className="mt-0.5 text-sm font-medium">
                  Project Showcase
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

        {/* Technical Projects */}
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
                Technical Work
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Demonstrate your capabilities
              </p>

            </div>

          </div>

        </div>

        {/* Portfolio */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <FolderGit2
                size={16}
                className="text-violet-600"
              />
            </div>

            <div>

              <p className="text-xs font-medium text-ink">
                Portfolio Ready
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Showcase your best work
              </p>

            </div>

          </div>

        </div>

        {/* Featured */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
              <Star
                size={16}
                className="text-gold"
              />
            </div>

            <div>

              <p className="text-xs font-medium text-ink">
                Featured Projects
              </p>

              <p className="mt-0.5 text-[11px] text-muted">
                Highlight your strongest work
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          PROJECT LIBRARY
      ===================================================== */}
      <section className="overflow-hidden rounded-[26px] border border-gray-200/80 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.05)]">

        <EntitySection
          title="Project Library"
          description="Your personal, academic, freelance and professional projects."
          service={projectService}
          fields={fields}
          layout="grid"
          emptyLabel="Add projects that best demonstrate your skills and experience."

          renderSummary={(project) => (
            <div className="min-h-[235px] flex flex-col">

              {/* =================================================
                  PROJECT ICON + FEATURED
              ================================================= */}
              <div className="flex items-start justify-between gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink shadow-md shadow-ink/10">

                  <FolderGit2
                    size={19}
                    className="text-gold"
                  />

                </div>

                {project.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-[9px] font-semibold text-ink">

                    <Sparkles
                      size={9}
                      className="text-gold"
                    />

                    Featured

                  </span>
                )}

              </div>

              {/* =================================================
                  PROJECT TITLE
              ================================================= */}
              <div className="mt-5">

                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {project.title}
                </h3>

                <div className="mt-1 flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />

                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                    Project Showcase
                  </span>

                </div>

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}
              {project.description && (
                <p className="mt-4 line-clamp-3 text-xs leading-5 text-muted">
                  {project.description}
                </p>
              )}

              {/* =================================================
                  TECHNOLOGIES
              ================================================= */}
              {project.technologies?.length > 0 && (
                <div className="mt-4">

                  <div className="mb-2 flex items-center gap-2">

                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-gray-400">
                      Technologies
                    </span>

                    <div className="h-px flex-1 bg-gray-100" />

                  </div>

                  <div className="flex flex-wrap gap-1.5">

                    {project.technologies
                      .slice(0, 5)
                      .map((technology, index) => (
                        <span
                          key={`${technology}-${index}`}
                          className="
                            rounded-lg
                            border
                            border-gray-200
                            bg-gray-50
                            px-2
                            py-1
                            font-mono
                            text-[8px]
                            text-gray-600
                            transition-colors
                            group-hover:border-gold/30
                            group-hover:bg-gold/[0.04]
                          "
                        >
                          {technology}
                        </span>
                      ))}

                    {project.technologies.length > 5 && (
                      <span className="rounded-lg bg-ink px-2 py-1 font-mono text-[8px] text-white">
                        +{project.technologies.length - 5}
                      </span>
                    )}

                  </div>

                </div>
              )}

              {/* =================================================
                  PROJECT LINKS
              ================================================= */}
              {(project.repoURL || project.liveURL) && (
                <div className="mt-auto flex items-center gap-3 border-t border-gray-100 pt-4">

                  {project.repoURL && (
                    <a
                      href={project.repoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-[10px]
                        font-medium
                        text-ink
                        transition-colors
                        hover:text-gold
                      "
                    >
                      <GitBranch size={12} />
                      Repository
                    </a>
                  )}

                  {project.liveURL && (
                    <a
                      href={project.liveURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-[10px]
                        font-medium
                        text-ink
                        transition-colors
                        hover:text-gold
                      "
                    >
                      <ExternalLink size={12} />
                      Live Demo
                    </a>
                  )}

                </div>
              )}

              {/* =================================================
                  FOOTER
              ================================================= */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">

                <span className="font-mono text-[8px] uppercase tracking-widest text-gray-300">
                  Portfolio Project
                </span>

                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-muted">

                  <Layers3 size={11} />

                  Portfolio ready

                </span>

              </div>

            </div>
          )}

        />

      </section>

      {/* =====================================================
          PORTFOLIO TIP
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
            Portfolio tip
          </p>

          <p className="mt-0.5 text-xs leading-5 text-muted">
            Prioritize projects that demonstrate real-world problem solving.
            Add your technologies, repository and live demo whenever possible,
            and feature the projects that best represent your capabilities.
          </p>

        </div>

      </div>

    </div>
  );
};

export default ProjectsPage;
