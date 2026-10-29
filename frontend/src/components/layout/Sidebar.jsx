import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

import {
  LayoutDashboard,
  GraduationCap,
  BriefcaseBusiness,
  Code2,
  FolderGit2,
  HeartHandshake,
  Palette,
  FileText,
  ScanSearch,
  UserRound,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

/* ============================================================
   NAVIGATION
============================================================ */

const NAV = [
  {
    to: '/dashboard',
    label: 'Overview',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/dashboard/education',
    label: 'Education',
    icon: GraduationCap,
  },
  {
    to: '/dashboard/experience',
    label: 'Experience',
    icon: BriefcaseBusiness,
  },
  {
    to: '/dashboard/skills',
    label: 'Skills',
    icon: Code2,
  },
  {
    to: '/dashboard/projects',
    label: 'Projects',
    icon: FolderGit2,
  },
  {
    to: '/dashboard/volunteer',
    label: 'Volunteering',
    icon: HeartHandshake,
  },
  {
    to: '/dashboard/portfolio',
    label: 'Portfolio',
    icon: Palette,
  },
  {
    to: '/dashboard/resume',
    label: 'Resume',
    icon: FileText,
  },
  {
    to: '/dashboard/ats',
    label: 'ATS Score',
    icon: ScanSearch,
  },
  {
    to: '/dashboard/profile',
    label: 'Profile',
    icon: UserRound,
  },
];

/* ============================================================
   SIDEBAR
============================================================ */

const Sidebar = ({ collapsed, onCollapsedChange }) => {
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const initial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U';

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* ======================================================
          MOBILE TOP BAR
      ====================================================== */}

      <header
        className="
          fixed
          left-3
          right-3
          top-3
          z-40
          flex
          h-[60px]
          items-center
          justify-between
          rounded-[20px]
          border
          border-gray-200
          bg-white/95
          px-3
          shadow-[0_8px_30px_rgba(15,23,42,0.08)]
          backdrop-blur-xl
          lg:hidden
        "
      >
        {/* Menu */}

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            text-gray-700
            transition-all
            hover:bg-gray-100
            hover:text-gray-950
            active:scale-95
          "
        >
          <Menu size={19} strokeWidth={2} />
        </button>

        {/* Brand */}

        <div className="flex items-center gap-2.5">
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-[#0A0F1B]
              text-[#D4AF37]
              shadow-sm
            "
          >
            <Sparkles size={15} />
          </div>

          <div className="leading-none">
            <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-gray-400">
              SP / ATS
            </p>

            <p className="mt-1 text-[11px] font-semibold text-[#0A0F1B]">
              Portfolio Studio
            </p>
          </div>
        </div>

        {/* User */}

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-[#0A0F1B]
            text-[10px]
            font-bold
            text-[#D4AF37]
          "
        >
          {initial}
        </div>
      </header>

      {/* ======================================================
          MOBILE BACKDROP
      ====================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobile}
          className="
            fixed
            inset-0
            z-50
            bg-black/30
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          z-[60]
          transition-all
          duration-300
          ease-out

          lg:sticky
          lg:top-5
          lg:h-[calc(100vh-40px)]
          lg:shrink-0

          ${collapsed ? 'lg:w-[78px]' : 'lg:w-[258px]'}

          ${
            mobileOpen
              ? 'left-3 top-3 bottom-3 w-[calc(100%-24px)] translate-x-0'
              : 'left-3 top-3 bottom-3 w-[calc(100%-24px)] -translate-x-[calc(100%+24px)]'
          }

          lg:left-auto
          lg:bottom-auto
          lg:top-5
          lg:translate-x-0
        `}
      >
        <div
          className="
            flex
            h-full
            flex-col
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.12]
            bg-gradient-to-br
            from-[#111827]/95
            via-[#090E18]/95
            to-[#090E18]/90
            backdrop-blur-2xl
            shadow-[0_24px_80px_rgba(15,23,42,0.22)]
          "
        >
          {/* ==================================================
              BRAND
          ================================================== */}

          <div
            className={`
              flex
              h-[78px]
              shrink-0
              items-center
              border-b
              border-white/[0.07]
              ${collapsed ? 'justify-center' : 'px-5'}
            `}
          >
            <div className="flex items-center gap-3">
              {/* Logo */}

              <div
                className="
                  relative
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[14px]
                  bg-[#D4AF37]/10
                "
              >
                <div className="absolute inset-0 rounded-[14px] bg-[#D4AF37]/10 blur-xl" />

                <Sparkles
                  size={17}
                  strokeWidth={1.8}
                  className="relative text-[#D4AF37]"
                />
              </div>

              {!collapsed && (
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#D4AF37]">
                    Smart Portfolio
                  </p>

                  <p className="mt-1 text-sm font-semibold tracking-tight text-white">
                    ATS Studio
                  </p>
                </div>
              )}
            </div>

            {/* Mobile close */}

            <button
              type="button"
              onClick={closeMobile}
              aria-label="Close navigation"
              className="
                ml-auto
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-white/55
                transition
                hover:bg-white/[0.07]
                hover:text-white
                lg:hidden
              "
            >
              <X size={17} />
            </button>
          </div>

          {/* ==================================================
              USER PROFILE
          ================================================== */}

          {!collapsed && (
            <div className="px-4 pt-4">
              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.035]
                  px-3
                  py-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#D4AF37]
                    text-xs
                    font-bold
                    text-[#090E18]
                  "
                >
                  {initial}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">
                    {user?.name || 'User'}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-white/55">
                    {user?.email || 'Portfolio account'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              NAVIGATION
          ================================================== */}

          <nav
            className="
              flex-1
              overflow-y-auto
              px-3
              py-5

              [scrollbar-width:none]
              [-ms-overflow-style:none]
            "
            style={{
              scrollbarWidth: 'none',
            }}
          >
            <style>
              {`
                nav::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>

            {!collapsed && (
              <div className="mb-3 px-2">
                <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/35">
                  Workspace
                </span>
              </div>
            )}

            <div className="space-y-1">
              {NAV.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeMobile}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) => `
                      group
                      relative
                      flex
                      items-center
                      rounded-xl
                      transition-all
                      duration-200

                      ${
                        collapsed
                          ? 'justify-center px-2 py-3'
                          : 'gap-3 px-3 py-2.5'
                      }

                      ${
                        isActive
                          ? 'bg-white/[0.09] text-white shadow-sm'
                          : 'text-white/75 hover:bg-white/[0.055] hover:text-white'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active indicator */}

                        {isActive && (
                          <span
                            className="
                              absolute
                              left-0
                              top-2.5
                              bottom-2.5
                              w-[3px]
                              rounded-r-full
                              bg-[#D4AF37]
                              shadow-[0_0_12px_rgba(212,175,55,0.5)]
                            "
                          />
                        )}

                        {/* Icon */}

                        <span
                          className={`
                            flex
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            transition-all
                            duration-200

                            ${
                              collapsed
                                ? 'h-9 w-9'
                                : 'h-8 w-8'
                            }

                            ${
                              isActive
                                ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                : 'text-white/60 group-hover:bg-white/[0.05] group-hover:text-white'
                            }
                          `}
                        >
                          <Icon
                            size={16}
                            strokeWidth={1.9}
                          />
                        </span>

                        {/* Text */}

                        {!collapsed && (
                          <span
                            className={`
                              text-[13px]
                              font-medium
                              tracking-[-0.01em]
                              ${
                                isActive
                                  ? 'text-white'
                                  : 'text-white/75 group-hover:text-white'
                              }
                            `}
                          >
                            {item.label}
                          </span>
                        )}

                        {/* Active dot */}

                        {!collapsed && isActive && (
                          <span
                            className="
                              ml-auto
                              h-1.5
                              w-1.5
                              rounded-full
                              bg-[#D4AF37]
                              shadow-[0_0_8px_rgba(212,175,55,0.7)]
                            "
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="shrink-0 border-t border-white/[0.07] p-3">
            <button
              type="button"
              onClick={logout}
              title={collapsed ? 'Sign out' : undefined}
              className={`
                group
                flex
                w-full
                items-center
                rounded-xl
                text-white/65
                transition-all
                duration-200
                hover:bg-red-500/[0.08]
                hover:text-red-400

                ${
                  collapsed
                    ? 'justify-center py-3'
                    : 'gap-3 px-3 py-2.5'
                }
              `}
            >
              <span
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  transition
                  group-hover:bg-red-500/10
                "
              >
                <LogOut size={15} />
              </span>

              {!collapsed && (
                <span className="text-[13px] font-medium">
                  Sign out
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ==================================================
            DESKTOP COLLAPSE BUTTON
        ================================================== */}

        <button
          type="button"
          onClick={() => onCollapsedChange((value) => !value)}
          aria-label={
            collapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
          className="
            absolute
            -right-3
            top-10
            hidden
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            border-gray-200
            bg-white
            text-gray-600
            shadow-[0_4px_15px_rgba(15,23,42,0.12)]
            transition-all
            hover:scale-105
            hover:text-gray-950
            lg:flex
          "
        >
          {collapsed ? (
            <ChevronRight size={13} />
          ) : (
            <ChevronLeft size={13} />
          )}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
