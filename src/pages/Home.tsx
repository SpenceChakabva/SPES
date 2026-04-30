import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  UserCircle,
  MapPin,
  CalendarDays,
  Coins,
  FileText,
  Calendar,
  StickyNote,
  TrendingUp,
  MessageSquare,
  Brain,
  Clock,
  ChevronRight,
  Zap,
  BookOpen,
} from 'lucide-react';
import { useProfile } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(hour: number): string {
  if (hour < 5) return 'Still up';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

function getContextualBanner() {
  const month = new Date().getMonth();
  if (month <= 1)
    return { icon: MapPin, headline: 'Housing season is now.', body: 'Verify your off-campus listing before you sign anything.', cta: 'Check listings', href: '/accommodation' };
  if (month >= 2 && month <= 4)
    return { icon: CalendarDays, headline: 'Mid-year exams approaching.', body: 'Upload your timetable now and get a personalised study plan.', cta: 'Plan my exams', href: '/exams' };
  if (month >= 8 && month <= 9)
    return { icon: FileText, headline: 'Bursary deadlines approaching.', body: 'Several funding opportunities close in October. Check what you qualify for.', cta: 'See bursaries', href: '/funding' };
  return { icon: Coins, headline: 'Do you know your NSFAS gap?', body: 'Many students discover a shortfall too late. Calculate yours now.', cta: 'Calculate', href: '/funding' };
}

function buildInsight(
  events: ReturnType<typeof useProfile>['events'],
  profile: ReturnType<typeof useProfile>['profile'],
  notes: ReturnType<typeof useProfile>['notes'],
  upcomingExams: ReturnType<typeof useProfile>['upcomingExams'],
  daysToNextExam: ReturnType<typeof useProfile>['daysToNextExam'],
): { text: string; stat: string; urgency: 'high' | 'medium' | 'low' } {
  const next = upcomingExams[0] ?? null;

  if (next && daysToNextExam !== null && daysToNextExam <= 7) {
    return {
      text: `${next.subject}${next.code ? ` (${next.code})` : ''} is in ${daysToNextExam} day${daysToNextExam !== 1 ? 's' : ''}. Focus your revision on highest-weight topics and do at least one timed past paper before then.`,
      stat: `${upcomingExams.length} exam${upcomingExams.length !== 1 ? 's' : ''} ahead`,
      urgency: 'high',
    };
  }

  if (next && daysToNextExam !== null) {
    const dateStr = new Date(next.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' });
    return {
      text: `You have ${upcomingExams.length} exam${upcomingExams.length !== 1 ? 's' : ''} coming up. Next paper: ${next.subject} on ${dateStr}. Start building your study plan now.`,
      stat: `${daysToNextExam} days to next exam`,
      urgency: 'medium',
    };
  }

  if (events.length > 0) {
    const lectures = events.filter((e) => e.type === 'lecture').length;
    const tutorials = events.filter((e) => e.type === 'tutorial').length;
    return {
      text: `You have ${events.length} session${events.length !== 1 ? 's' : ''} on your schedule${lectures ? ` (${lectures} lecture${lectures !== 1 ? 's' : ''})` : ''}${tutorials ? ` and ${tutorials} tutorial${tutorials !== 1 ? 's' : ''}` : ''}. Consistency is the foundation of academic performance.`,
      stat: `${events.length} active sessions`,
      urgency: 'low',
    };
  }

  if (notes.length > 0) {
    return {
      text: `You have ${notes.length} note${notes.length !== 1 ? 's' : ''} saved. Reviewing and organising your notes regularly strengthens retention. Add your exam dates to unlock study planning.`,
      stat: `${notes.length} notes saved`,
      urgency: 'low',
    };
  }

  if (profile?.budget) {
    const nsfasCap = 4500;
    const gap = Math.max(0, profile.budget - nsfasCap);
    if (gap > 0) {
      return {
        text: `Your accommodation costs R${profile.budget.toLocaleString()}/month — a R${gap.toLocaleString()} shortfall after the NSFAS allowance. Check the Bursary Finder for additional funding.`,
        stat: `R${gap.toLocaleString()} monthly gap`,
        urgency: 'medium',
      };
    }
  }

  return {
    text: 'Set up your profile, add your exams, and build your schedule. The more data you add, the more tactical this dashboard becomes.',
    stat: 'Getting started',
    urgency: 'low',
  };
}

// ─── Mini Ring Chart ──────────────────────────────────────────────────────────

const MiniRing: React.FC<{ pct: number; color: string; size?: number }> = ({ pct, color, size = 56 }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;
  return (
    <svg viewBox="0 0 56 56" width={size} height={size} aria-hidden="true">
      <circle cx="28" cy="28" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-ivory-deep dark:text-dark-border" />
      <circle
        cx="28" cy="28" r={r}
        fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        className="transition-all duration-700"
      />
    </svg>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ onClick, children, className = '' }) => (
  <Card
    interactive
    onClick={onClick}
    className={`flex flex-col items-center gap-2 border-none shadow-sm p-4 sm:p-5 relative overflow-hidden group ${className}`}
  >
    {children}
    <ChevronRight size={12} className="absolute bottom-2 right-2 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
  </Card>
);

// ─── Tool tile ────────────────────────────────────────────────────────────────

interface ToolItem {
  label: string;
  icon: React.ElementType;
  href: string;
  highlight?: boolean;
  external?: boolean;
  badge?: string;
}

const TOOLS: ToolItem[] = [
  { label: 'SI Planner', icon: Brain, href: '/planner', highlight: true, badge: 'AI' },
  { label: 'Accommodation', icon: MapPin, href: '/accommodation' },
  { label: 'Exam Planner', icon: CalendarDays, href: '/exams' },
  { label: 'Schedule', icon: Calendar, href: '/calendar' },
  { label: 'Scratchpad', icon: StickyNote, href: '/notes' },
  { label: 'Study Resources', icon: BookOpen, href: '/notes' },
  { label: 'NSFAS Calc', icon: Coins, href: '/funding' },
  { label: 'Bursaries', icon: FileText, href: '/funding' },
  {
    label: 'Feedback',
    icon: MessageSquare,
    href: 'https://docs.google.com/forms/d/e/1FAIpQLScxSNtyqh9dPO-Gv5IlQl6ufZgO_VF3f06nhD1b0j965d2szA/viewform?usp=header',
    external: true,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { profile, events, notes, upcomingExams, nextExam, daysToNextExam } = useProfile();

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.stagger-item', {
      y: 24,
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
    });
  }, { scope: containerRef });

  const now = new Date();
  const hour = now.getHours();
  const greeting = getGreeting(hour);
  const banner = getContextualBanner();

  const budget = profile?.budget ?? 0;
  const nsfasCap = 4500;
  const budgetPct = budget > 0 ? Math.min(100, (nsfasCap / budget) * 100) : 0;
  const nsfasApproved = profile?.nsfasStatus?.toLowerCase().includes('approved');

  const insight = buildInsight(events, profile, notes, upcomingExams, daysToNextExam);

  const urgencyBorder =
    insight.urgency === 'high'
      ? 'border-terracotta/30'
      : insight.urgency === 'medium'
        ? 'border-amber/30'
        : 'border-forest/20 dark:border-white/10';

  return (
    <div ref={containerRef} className="pb-16 sm:pb-12 space-y-6 sm:space-y-8 animate-in fade-in duration-500">

      {/* ── Header ── */}
      <header className="flex justify-between items-start gap-4 stagger-item">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-forest dark:text-ivory-warm leading-tight truncate">
            {greeting}{profile?.year ? `, ${profile.year} buddy` : ''}.
          </h1>
          <p className="text-text-secondary dark:text-text-dark-secondary text-xs sm:text-sm mt-0.5">
            Ready for the tactical push?
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            aria-label="Notifications"
            className="p-2 rounded-full text-text-secondary hover:text-forest hover:bg-ivory-warm dark:text-text-dark-secondary dark:hover:text-ivory-warm dark:hover:bg-forest-mid/30 transition-all"
          >
            <Bell size={20} />
          </button>
          <button
            aria-label="Profile"
            onClick={() => navigate('/profile')}
            className="p-2 rounded-full text-text-secondary hover:text-forest hover:bg-ivory-warm dark:text-text-dark-secondary dark:hover:text-ivory-warm dark:hover:bg-forest-mid/30 transition-all"
          >
            <UserCircle size={20} />
          </button>
        </div>
      </header>

      {/* ── Banner + Tactical Insight ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 stagger-item">

        {/* Contextual Banner */}
        <Card
          accent="warning"
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start bg-gradient-to-br from-ivory-warm/80 to-white dark:from-dark-card dark:to-dark-surface border-none shadow-md hover:shadow-float transition-all duration-slow p-5 sm:p-6 relative overflow-hidden group"
        >
          <div className="text-amber dark:text-amber bg-white dark:bg-dark-card p-4 rounded-2xl shadow-sm shrink-0 group-hover:scale-110 transition-transform duration-slow">
            <banner.icon size={26} />
          </div>
          <div className="flex-1 min-w-0 relative z-10">
            <h2 className="font-display text-lg sm:text-xl font-bold text-text-primary dark:text-text-dark-primary mb-1.5 leading-snug">
              {banner.headline}
            </h2>
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-4 max-w-[520px] leading-relaxed">
              {banner.body}
            </p>
            <Button size="sm" onClick={() => navigate(banner.href)} className="shadow-sm hover:scale-105 active:scale-95 transition-transform">
              {banner.cta}
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-56 h-56 bg-amber/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
        </Card>

        {/* Synthetic Intelligence Insight */}
        <Card
          className={`flex flex-col gap-3 bg-forest dark:bg-dark-card text-ivory border border-solid ${urgencyBorder} shadow-md overflow-hidden relative group p-5 sm:p-6`}
        >
          <div className="relative z-10 flex flex-col h-full gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-amber rounded-full animate-pulse" />
                <div className="absolute inset-0 w-2 h-2 bg-amber rounded-full animate-ping opacity-40" />
              </div>
              <span className="font-display text-sm font-bold tracking-wide italic text-ivory/90">
                Tactical Insight
              </span>
              {insight.urgency === 'high' && (
                <span className="ml-auto text-[10px] font-bold uppercase tracking-widest bg-terracotta/80 text-ivory px-2 py-0.5 rounded-full">
                  Urgent
                </span>
              )}
            </div>

            <p className="text-[13px] sm:text-sm opacity-80 leading-relaxed flex-1">
              {insight.text}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-ivory/50">
                <TrendingUp size={12} />
                {insight.stat}
              </div>
              <button
                onClick={() => navigate('/planner')}
                className="flex items-center gap-1 text-[11px] font-bold text-amber/80 hover:text-amber transition-colors"
              >
                <Zap size={11} />
                Ask SI
              </button>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-terracotta/5 rounded-full blur-2xl pointer-events-none" />
        </Card>
      </div>

      {/* ── Stat Cards Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-item">

        {/* Budget Ring */}
        <StatCard onClick={() => navigate('/funding')} className="bg-ivory-warm/60 dark:bg-dark-card/60">
          <MiniRing pct={budgetPct} color={budgetPct >= 100 ? '#5A8A6F' : '#C1440E'} />
          <div className="text-center">
            <span className="block text-base sm:text-lg font-black text-forest dark:text-ivory-warm">
              R{budget > 0 ? budget.toLocaleString() : '–'}
            </span>
            <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Budget</span>
          </div>
        </StatCard>

        {/* Exam Countdown */}
        <StatCard onClick={() => navigate('/exams')} className="bg-ivory-warm/60 dark:bg-dark-card/60">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-terracotta/10 flex items-center justify-center">
            {daysToNextExam !== null ? (
              <span className="text-lg sm:text-xl font-black text-terracotta">{daysToNextExam}</span>
            ) : (
              <CalendarDays size={22} className="text-terracotta" />
            )}
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold text-text-primary dark:text-text-dark-primary">
              {daysToNextExam !== null ? `day${daysToNextExam !== 1 ? 's' : ''}` : 'No exams'}
            </span>
            <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">
              {nextExam ? 'Next exam' : 'Upcoming'}
            </span>
          </div>
        </StatCard>

        {/* Sessions Count */}
        <StatCard onClick={() => navigate('/calendar')} className="bg-ivory-warm/60 dark:bg-dark-card/60">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sage/10 flex items-center justify-center">
            <span className="text-lg sm:text-xl font-black text-sage">{events.length}</span>
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold text-text-primary dark:text-text-dark-primary">
              session{events.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Schedule</span>
          </div>
        </StatCard>

        {/* NSFAS Status */}
        <StatCard onClick={() => navigate('/funding')} className="bg-ivory-warm/60 dark:bg-dark-card/60">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${nsfasApproved ? 'bg-sage/10' : 'bg-amber/10'}`}
          >
            <Clock size={22} className={nsfasApproved ? 'text-sage' : 'text-amber'} />
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold text-text-primary dark:text-text-dark-primary truncate max-w-[90px]">
              {nsfasApproved ? 'Approved' : profile?.nsfasStatus?.includes('Pending') ? 'Pending' : profile?.nsfasStatus || '–'}
            </span>
            <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">NSFAS</span>
          </div>
        </StatCard>
      </div>

      {/* ── Quick-access tools ── */}
      <section className="stagger-item">
        <h3 className="text-[11px] sm:text-[13px] font-bold text-text-muted dark:text-text-dark-muted mb-4 uppercase tracking-[0.18em]">
          Tactical Deployment
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {TOOLS.map((tool) => (
            <Card
              key={tool.label}
              interactive
              onClick={() =>
                tool.external
                  ? window.open(tool.href, '_blank', 'noopener,noreferrer')
                  : navigate(tool.href)
              }
              className={`flex flex-col gap-3 items-start p-4 sm:p-5 hover:shadow-float transition-all hover:-translate-y-1 group backdrop-blur-sm border-none ${
                tool.highlight
                  ? 'bg-gradient-to-br from-forest to-forest-mid text-ivory'
                  : 'bg-white/50 dark:bg-dark-card/50'
              }`}
            >
              <div
                className={`relative p-2.5 rounded-xl transition-colors duration-slow ${
                  tool.highlight
                    ? 'bg-white/15 text-ivory group-hover:bg-white/25'
                    : 'bg-terracotta/10 text-terracotta group-hover:bg-terracotta group-hover:text-ivory'
                }`}
              >
                <tool.icon size={18} />
                {tool.badge && (
                  <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black bg-amber text-white px-1 py-0.5 rounded-full leading-none">
                    {tool.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[13px] sm:text-sm font-bold leading-tight ${
                  tool.highlight
                    ? 'text-ivory/90'
                    : tool.external
                      ? 'text-terracotta dark:text-terracotta-light'
                      : 'text-text-primary dark:text-text-dark-primary'
                }`}
              >
                {tool.label}
              </span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
