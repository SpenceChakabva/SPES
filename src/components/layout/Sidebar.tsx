import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Home,
  MapPin,
  CalendarDays,
  Coins,
  User,
  Moon,
  Sun,
  Calendar,
  StickyNote,
  Info,
  Brain,
} from 'lucide-react';
import { useTheme } from 'next-themes';

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: 'Core',
    items: [
      { path: '/home',    label: 'Dashboard',  icon: Home },
      { path: '/planner', label: 'SI Planner', icon: Brain, badge: 'AI' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { path: '/calendar',      label: 'Schedule',      icon: Calendar },
      { path: '/notes',         label: 'Scratchpad',    icon: StickyNote },
      { path: '/accommodation', label: 'Accommodation', icon: MapPin },
      { path: '/exams',         label: 'Exams',         icon: CalendarDays },
      { path: '/funding',       label: 'Funding',       icon: Coins },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/about',   label: 'About',   icon: Info },
      { path: '/profile', label: 'Profile', icon: User },
    ],
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export const Sidebar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[220px] bg-ivory-warm dark:bg-dark-surface border-r border-ivory-deep dark:border-dark-border flex flex-col z-50 shadow-xl lg:shadow-none overflow-y-auto">

      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2.5 px-5 py-6 group no-underline shrink-0"
        aria-label="Thuthuka home"
      >
        <div className="w-8 h-8 bg-terracotta rounded-xl flex items-center justify-center text-ivory font-black text-sm group-hover:scale-110 transition-transform duration-fast ease-spring shadow-md">
          T
        </div>
        <div className="font-display text-xl font-bold text-forest dark:text-ivory-warm tracking-tighter leading-none">
          THUTHUKA
        </div>
      </Link>

      {/* Nav sections */}
      <nav className="flex-1 flex flex-col gap-5 px-3 pb-3" aria-label="Main navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted dark:text-text-dark-muted px-3 mb-1.5">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-fast ease-out group ${
                      isActive
                        ? 'bg-terracotta text-ivory shadow-md'
                        : 'text-text-secondary dark:text-text-dark-secondary hover:bg-white/60 dark:hover:bg-white/5 hover:text-forest dark:hover:text-ivory-warm'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={16}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        className="shrink-0 transition-transform duration-fast group-hover:scale-110"
                      />
                      <span className="truncate">{item.label}</span>
                      {'badge' in item && item.badge && (
                        <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none shrink-0 ${
                          isActive ? 'bg-white/20 text-ivory' : 'bg-amber/20 text-amber-600 dark:bg-amber/15 dark:text-amber'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer controls */}
      <div className="shrink-0 px-3 py-4 border-t border-ivory-deep dark:border-dark-border space-y-1">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-text-secondary dark:text-text-dark-secondary hover:bg-white/60 dark:hover:bg-white/5 hover:text-forest dark:hover:text-ivory-warm transition-all duration-fast"
        >
          {isDark ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </aside>
  );
};
