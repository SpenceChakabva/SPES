import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, CalendarDays, Brain, User } from 'lucide-react';

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { path: '/home',         label: 'Home',    icon: Home },
  { path: '/planner',     label: 'SI',       icon: Brain },
  { path: '/accommodation', label: 'Accom',  icon: MapPin },
  { path: '/exams',       label: 'Exams',   icon: CalendarDays },
  { path: '/profile',     label: 'Profile', icon: User },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export const BottomTabBar: React.FC = () => (
  <nav
    role="navigation"
    aria-label="Main navigation"
    className="fixed bottom-0 left-0 right-0 z-50 bg-ivory/90 dark:bg-dark-surface/95 backdrop-blur-xl border-t border-ivory-deep dark:border-dark-border"
    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0.5rem)' }}
  >
    <div className="grid grid-cols-5 px-2 py-1">
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
        <NavLink key={path} to={path}>
          {({ isActive }) => (
            <span className="flex flex-col items-center gap-0.5 pt-1.5 pb-1 relative">

              {/* Active pill background */}
              <span
                className={`absolute inset-x-3 top-1 h-9 rounded-2xl transition-all duration-normal ease-spring ${
                  isActive ? 'bg-terracotta/10 dark:bg-terracotta/15' : 'bg-transparent'
                }`}
              />

              {/* Icon */}
              <span
                className={`relative z-10 w-6 h-6 flex items-center justify-center transition-transform duration-fast ease-spring ${
                  isActive ? 'scale-110 text-terracotta' : 'text-text-muted dark:text-text-dark-muted active:scale-90'
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className="transition-all duration-fast"
                />
              </span>

              {/* Label */}
              <span
                className={`relative z-10 text-[10px] font-semibold tracking-tight transition-colors duration-fast leading-none ${
                  isActive
                    ? 'text-terracotta'
                    : 'text-text-muted dark:text-text-dark-muted'
                }`}
              >
                {label}
              </span>

            </span>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);
