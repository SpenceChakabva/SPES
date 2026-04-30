import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';
import { ShieldCheck, X } from 'lucide-react';
import { Button } from '../ui/Button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_WIDTH = 220;
const DESKTOP_BREAKPOINT = 1024;
const CONSENT_KEY = 'thuthuka_consent';

// ─── Component ────────────────────────────────────────────────────────────────

export const Layout: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => window.innerWidth >= DESKTOP_BREAKPOINT,
  );
  const [showConsent, setShowConsent] = useState(
    () => !localStorage.getItem(CONSENT_KEY),
  );

  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoint detection
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Scroll restoration on route change
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  // Page transition
  useGSAP(() => {
    if (!mainRef.current) return;
    gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform' },
    );
  }, { dependencies: [location.pathname] });

  const acceptConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setShowConsent(false);
  };

  const isLandingPage = location.pathname === '/';

  // ── Landing layout (no sidebar/footer) ───────────────────────────────────
  if (isLandingPage) {
    return (
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Outlet />
        {showConsent && (
          <div className="fixed bottom-6 left-4 right-4 z-[100] animate-in slide-in-from-bottom-8 duration-500">
            <div className="max-w-[480px] mx-auto bg-forest text-ivory p-5 sm:p-6 rounded-[2rem] shadow-2xl border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck className="text-terracotta" size={20} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold text-xs mb-1 uppercase tracking-widest">Tactical Sovereignty</h4>
                <p className="text-[11px] opacity-70 leading-relaxed">
                  We use LocalStorage for offline intelligence. No trackers. No cookies. Pure performance.
                </p>
              </div>
              <Button size="sm" onClick={acceptConsent} className="bg-ivory text-forest hover:bg-ivory-warm whitespace-nowrap px-5 shrink-0">
                Understood
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── App layout ────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-ivory dark:bg-dark overflow-x-hidden">

      {isDesktop && <Sidebar />}

      <div
        className="flex flex-col flex-1 min-w-0"
        style={{ marginLeft: isDesktop ? SIDEBAR_WIDTH : 0 }}
      >
        <main
          ref={mainRef}
          className="flex-1 w-full"
        >
          <div
            className={`max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 ${
              isDesktop ? 'lg:px-12 lg:pt-10 pb-10' : 'pb-28'
            }`}
          >
            <Outlet />
          </div>
        </main>

        <footer
          className={`py-4 px-6 border-t border-ivory-deep dark:border-dark-border text-[11px] text-text-muted ${
            !isDesktop ? 'pb-28' : ''
          }`}
        >
          <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 opacity-50">
            <span>© 2026 Thuthuka Engine v2.4</span>
            <div className="flex gap-4">
              <Link to="/about" className="hover:text-terracotta transition-colors underline decoration-dotted">
                About
              </Link>
              <Link to="/privacy" className="hover:text-terracotta transition-colors underline decoration-dotted">
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {!isDesktop && <BottomTabBar />}

      {/* Consent toast */}
      {showConsent && (
        <div
          className={`fixed z-[100] animate-in slide-in-from-bottom-8 duration-500 ${
            isDesktop
              ? 'left-[244px] bottom-6 right-6'
              : 'left-4 right-4 bottom-24'
          }`}
        >
          <div className="max-w-[420px] bg-white/90 dark:bg-forest-darkpale/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-ivory-deep dark:border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 bg-sage/10 text-sage rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <p className="flex-1 text-[11px] text-text-secondary dark:text-text-dark-secondary leading-snug">
              LocalStorage powers offline tactical persistence.{' '}
              <Link to="/privacy" className="text-terracotta font-bold hover:underline">
                Privacy protocols
              </Link>
            </p>
            <button
              onClick={acceptConsent}
              aria-label="Dismiss"
              className="p-1.5 text-text-muted hover:text-forest dark:hover:text-ivory transition-colors rounded-lg hover:bg-ivory-warm dark:hover:bg-white/5"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
