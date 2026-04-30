import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useProfile } from '../lib/store';
import { sendChatMessage, buildContext } from '../lib/ai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, AlertTriangle, FileText, Copy, Check, ExternalLink, X, Loader2 } from 'lucide-react';

interface Bursary {
  name: string;
  provider: string;
  fields: string[];
  value: string;
  deadline: string;
  url: string;
  requirements: string;
}

const BURSARIES: Bursary[] = [
  {
    name: 'NSFAS Bursary',
    provider: 'National Student Financial Aid Scheme',
    fields: ['All faculties'],
    value: 'Full tuition + living allowances',
    deadline: '30 November (annually)',
    url: 'https://www.nsfas.org.za',
    requirements: 'SA citizen, household income under R350,000/year',
  },
  {
    name: 'Allan Gray Orbis Foundation Fellowship',
    provider: 'Allan Gray Orbis Foundation',
    fields: ['Commerce', 'Science', 'Engineering', 'Law'],
    value: 'Full tuition + mentorship + stipend',
    deadline: '1 March (annually)',
    url: 'https://www.allangrayorbis.org',
    requirements: 'SA citizen, strong academics, entrepreneurial mindset',
  },
  {
    name: 'Funza Lushaka Bursary',
    provider: 'Department of Basic Education',
    fields: ['Humanities (Education)'],
    value: 'Full cost of study',
    deadline: '31 January (annually)',
    url: 'https://www.funzalushaka.doe.gov.za',
    requirements: 'SA citizen, studying towards teaching qualification',
  },
  {
    name: 'Sasol Bursary Programme',
    provider: 'Sasol Limited',
    fields: ['Engineering', 'Science'],
    value: 'Full tuition + accommodation + book allowance',
    deadline: '31 March (annually)',
    url: 'https://www.sasol.com/careers/students-and-graduates',
    requirements: 'SA citizen, studying Chemical/Mechanical/Electrical Engineering or Chemistry',
  },
  {
    name: 'Anglo American Bursary',
    provider: 'Anglo American',
    fields: ['Engineering', 'Science'],
    value: 'Full tuition + living expenses',
    deadline: '30 April (annually)',
    url: 'https://www.angloamerican.com/careers/students',
    requirements: 'SA citizen, Mining/Mechanical/Electrical Engineering or Geology',
  },
  {
    name: 'Standard Bank Derek Cooper Scholarship',
    provider: 'Standard Bank',
    fields: ['Commerce', 'Science', 'Engineering'],
    value: 'Up to R120,000/year',
    deadline: '30 June (annually)',
    url: 'https://www.standardbank.com/sbg/standard-bank-group/careers/early-careers',
    requirements: 'SA citizen, academic merit, financial need',
  },
  {
    name: 'Old Mutual Education Trust Bursary',
    provider: 'Old Mutual',
    fields: ['Commerce', 'Science', 'Engineering', 'Health Sciences'],
    value: 'Up to R80,000/year',
    deadline: '30 September (annually)',
    url: 'https://www.oldmutual.co.za/about/responsible-business/education/',
    requirements: 'SA citizen, household income under R600,000/year',
  },
  {
    name: 'UCT Financial Aid (GAP Funding)',
    provider: 'University of Cape Town',
    fields: ['All faculties'],
    value: 'Covers tuition/accommodation shortfall',
    deadline: 'Rolling (apply via Student Financial Aid)',
    url: 'https://www.uct.ac.za/main/students/fees-funding',
    requirements: 'Registered UCT student with demonstrated financial need',
  },
  {
    name: 'Motsepe Foundation Bursary',
    provider: 'Motsepe Foundation',
    fields: ['All faculties'],
    value: 'Full tuition + living allowance',
    deadline: '31 August (annually)',
    url: 'https://www.motsepefoundation.org',
    requirements: 'SA citizen, academic merit, financial need, community involvement',
  },
  {
    name: 'Eskom Bursary Programme',
    provider: 'Eskom Holdings',
    fields: ['Engineering', 'Science'],
    value: 'Full tuition + accommodation + stipend',
    deadline: '30 September (annually)',
    url: 'https://www.eskom.co.za/careers/',
    requirements: 'SA citizen, Electrical/Mechanical/Civil Engineering or related Science degree',
  },
];

/* ─── SVG Donut Chart ────────────────────────────────────────── */
const DonutChart: React.FC<{ segments: { value: number; color: string; label: string }[]; size?: number }> = ({ segments, size = 140 }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = 50;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 140 140" width={size} height={size} className="donut-chart">
      {segments.map((seg, i) => {
        const pct = total > 0 ? seg.value / total : 0;
        const dash = pct * circ;
        const gap = circ - dash;
        const currentOffset = offset;
        offset += dash;
        return (
          <circle
            key={i}
            cx="70" cy="70" r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="16"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-currentOffset}
            strokeLinecap="round"
            className="donut-segment"
            style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
          />
        );
      })}
      <circle cx="70" cy="70" r="38" className="fill-white dark:fill-dark-card" />
    </svg>
  );
};

export const Funding: React.FC = () => {
  const { profile, exams, events } = useProfile();
  const [activeTab, setActiveTab] = useState<'nsfas' | 'bursary'>('nsfas');
  const [rent, setRent] = useState(profile?.budget || 4500);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState('');
  const [draftTarget, setDraftTarget] = useState('');
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleTabChange = contextSafe((tab: 'nsfas' | 'bursary') => {
    if (tab === activeTab) return;
    gsap.to(contentRef.current, {
      opacity: 0, y: 10, duration: 0.2,
      onComplete: () => setActiveTab(tab),
    });
  });

  useLayoutEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  const filteredBursaries = BURSARIES.filter(b => {
    if (!profile?.faculty) return true;
    return b.fields.includes('All faculties') || b.fields.includes(profile.faculty);
  });

  const openModal = useCallback(() => {
    setShowModal(true);
    setCopied(false);
  }, []);

  const closeModal = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setShowModal(false);
        setDraftResult('');
        setDraftTarget('');
      },
    });
    if (modalRef.current) {
      tl.to(modalRef.current, { y: 40, opacity: 0, duration: 0.25, ease: 'power2.in' }, 0);
    }
    if (backdropRef.current) {
      tl.to(backdropRef.current, { opacity: 0, duration: 0.2 }, 0.05);
    }
  }, []);

  // Animate modal in
  useEffect(() => {
    if (showModal && modalRef.current && backdropRef.current) {
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
      gsap.fromTo(modalRef.current,
        { y: 60, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', delay: 0.05 }
      );
    }
  }, [showModal]);

  // Close on Escape
  useEffect(() => {
    if (!showModal) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showModal, closeModal]);

  const handleDraft = async (bursaryName: string) => {
    setIsDrafting(true);
    setDraftResult('');
    setDraftTarget(bursaryName);
    openModal();

    const hasAI = profile?.apiKey || profile?.apiProvider === 'server';

    if (hasAI) {
      try {
        const context = buildContext(profile, exams, events);
        const data = await sendChatMessage({
          messages: [{
            role: 'user',
            content: `Write a concise, professional motivation letter for the "${bursaryName}" bursary application. Keep it under 250 words. Use a formal but warm tone. Include specific details from my profile. Do not use any emojis. Structure: Opening paragraph (who I am, what I'm studying), middle paragraph (why I need this bursary, my circumstances), closing paragraph (what I will achieve, gratitude). Sign off with "[Your Full Name]".`,
          }],
          context,
          ...(profile?.apiProvider && profile.apiProvider !== 'server' && profile?.apiKey
            ? { clientKey: profile.apiKey }
            : {}),
          ...(profile?.apiProvider === 'openai' ? { provider: 'openai' } : {}),
        });
        setDraftResult(data.message);
      } catch {
        setDraftResult(buildTemplateLetter(bursaryName));
      }
    } else {
      setDraftResult(buildTemplateLetter(bursaryName));
    }
    setIsDrafting(false);
  };

  const buildTemplateLetter = (bursaryName: string) => {
    return `Dear Selection Committee,

I am writing to apply for the ${bursaryName}. I am currently a ${profile?.year || '[year]'} student in the Faculty of ${profile?.faculty || '[faculty]'} at the University of Cape Town, from ${profile?.homeProvince || '[province]'}.

My NSFAS status is "${profile?.nsfasStatus || 'Pending'}", which ${profile?.nsfasStatus?.includes('approved') ? 'covers my tuition but leaves a shortfall for accommodation and living expenses' : 'does not fully cover my financial needs'}. My monthly accommodation budget is R${(profile?.budget || 4500).toLocaleString()}, and I face ongoing financial pressure that affects my ability to focus on my studies.

This bursary would allow me to dedicate myself fully to my academic work and contribute meaningfully to my field. I am committed to maintaining strong academic performance and giving back to my community upon graduation.

Thank you for considering my application. I would welcome the opportunity to discuss my candidacy further.

Yours sincerely,
[Your Full Name]
[Student Number]
[Contact Email]`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draftResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = draftResult;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nsfasCap = 4500;
  const foodAllowance = 1500;
  const gap = Math.max(0, rent - nsfasCap);
  const covered = Math.min(rent, nsfasCap);

  const donutSegments = [
    { value: covered, color: '#5A8A6F', label: 'NSFAS covers' },
    { value: foodAllowance, color: '#D4820A', label: 'Food allowance' },
    ...(gap > 0 ? [{ value: gap, color: '#C1440E', label: 'Shortfall' }] : []),
  ];

  return (
    <div ref={containerRef} className="max-w-[800px] mx-auto">
      <div className="flex mb-6 border-b-2 border-ivory-deep dark:border-forest-darkpale relative">
        <button
          className={`flex-1 bg-transparent border-none p-3 font-body font-semibold text-sm sm:text-base cursor-pointer relative transition-colors ${activeTab === 'nsfas' ? 'text-terracotta dark:text-terracotta-light' : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary'}`}
          onClick={() => handleTabChange('nsfas')}
        >
          NSFAS Calculator
          {activeTab === 'nsfas' && <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-terracotta dark:bg-terracotta-light" />}
        </button>
        <button
          className={`flex-1 bg-transparent border-none p-3 font-body font-semibold text-sm sm:text-base cursor-pointer relative transition-colors ${activeTab === 'bursary' ? 'text-terracotta dark:text-terracotta-light' : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary'}`}
          onClick={() => handleTabChange('bursary')}
        >
          Bursary Finder
          {activeTab === 'bursary' && <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-terracotta dark:bg-terracotta-light" />}
        </button>
      </div>

      <div ref={contentRef}>
        {activeTab === 'nsfas' && (
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2">NSFAS Calculator</h1>
            <p className="text-text-secondary dark:text-text-dark-secondary text-sm sm:text-base mb-6">What will you actually receive each month?</p>

            <Card className="mb-6 p-3 sm:p-4 bg-ivory-warm dark:bg-ivory-dark">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-text-secondary dark:text-text-dark-secondary text-xs sm:text-sm">
                  Faculty: {profile?.faculty || 'N/A'} | Year: {profile?.year || 'N/A'}
                </span>
                <Badge variant={profile?.nsfasStatus?.includes('approved') ? 'verified' : 'warning'}>
                  {profile?.nsfasStatus || 'Status Unknown'}
                </Badge>
              </div>
            </Card>

            <div className="mb-8">
              <label className="block font-semibold mb-3">Monthly rent: R{rent.toLocaleString()}</label>
              <Slider min={0} max={10000} step={100} value={rent} onChange={(e) => setRent(parseInt(e.target.value))} />
            </div>

            {/* Visual Breakdown */}
            <Card className="mb-6 p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-5">Monthly Breakdown</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="shrink-0">
                  <DonutChart segments={donutSegments} size={120} />
                </div>
                <div className="flex-1 w-full space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-sage" />
                      <span>Accommodation</span>
                    </div>
                    <span className="font-bold">R{nsfasCap.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber" />
                      <span>Food</span>
                    </div>
                    <span className="font-bold">R{foodAllowance.toLocaleString()}</span>
                  </div>
                  {gap > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-terracotta" />
                        <span>Shortfall</span>
                      </div>
                      <span className="font-bold text-terracotta">R{gap.toLocaleString()}</span>
                    </div>
                  )}
                  <hr className="border-0 border-t border-dashed border-ivory-deep dark:border-forest-darkpale" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Tuition</span>
                    <span className="text-text-muted">Paid directly to UCT</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Learning materials</span>
                    <span className="text-text-muted">R5,460/year</span>
                  </div>
                  <hr className="border-0 border-t border-dashed border-ivory-deep dark:border-forest-darkpale" />
                  <div className="flex justify-between font-bold text-base">
                    <span>TOTAL monthly</span>
                    <span>R{(nsfasCap + foodAllowance).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card accent={gap > 0 ? 'warning' : 'verified'} className="mb-6">
              <h3 className="text-lg mb-4">Your Gap</h3>
              <p className="text-[15px] mb-2">Actual rent (R{rent.toLocaleString()}) vs NSFAS allowance (R{nsfasCap.toLocaleString()})</p>

              {/* Budget bar */}
              <div className="mt-4 mb-3">
                <div className="h-3 w-full bg-ivory-deep dark:bg-dark-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${gap > 0 ? 'bg-gradient-to-r from-sage to-terracotta' : 'bg-sage'}`}
                    style={{ width: `${Math.min(100, (rent / Math.max(rent, nsfasCap)) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-text-muted mt-1">
                  <span>R0</span>
                  <span>NSFAS cap: R{nsfasCap.toLocaleString()}</span>
                </div>
              </div>

              {gap > 0 ? (
                <>
                  <p className="text-amber dark:text-amber-light font-semibold mt-3 flex items-center gap-2">
                    <AlertTriangle size={18} /> Shortfall: R{gap.toLocaleString()}/month | R{(gap * 10).toLocaleString()}/year
                  </p>
                  <p className="mt-4 text-[15px]">
                    <strong>What to do:</strong><br />
                    -- Apply for UCT GAP funding<br />
                    -- Check the Bursary Finder tab
                  </p>
                </>
              ) : (
                <p className="text-sage dark:text-sage-light font-semibold mt-2 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Your rent is fully covered.
                </p>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'bursary' && (
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2">Bursary Finder</h1>
            <p className="text-text-secondary dark:text-text-dark-secondary text-sm sm:text-base mb-2">
              {profile?.faculty
                ? `Showing bursaries matching "${profile.faculty}" faculty.`
                : 'Set your faculty in Profile to see personalised matches.'}
            </p>
            <p className="text-text-muted text-xs mb-6">
              {filteredBursaries.length} bursaries found | Deadlines are indicative -- always verify on the provider's website.
            </p>

            <div className="flex flex-col gap-3 sm:gap-4">
              {filteredBursaries.map((b, idx) => (
                <Card key={idx} className="p-4 sm:p-5">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-text-dark-primary mb-1 leading-tight">{b.name}</h3>
                      <p className="text-xs text-text-muted truncate">{b.provider}</p>
                    </div>
                    <Badge variant="info" className="shrink-0 text-[10px] sm:text-xs">{b.fields[0]}</Badge>
                  </div>
                  <div className="flex flex-col sm:grid sm:grid-cols-2 gap-1 text-sm text-text-secondary dark:text-text-dark-secondary mb-4">
                    <span><strong>Value:</strong> {b.value}</span>
                    <span><strong>Deadline:</strong> {b.deadline}</span>
                    <span className="sm:col-span-2 mt-1 text-xs text-text-muted">{b.requirements}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => window.open(b.url, '_blank', 'noopener,noreferrer')} className="flex items-center gap-1.5">
                      <ExternalLink size={14} /> Visit site
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDraft(b.name)} isLoading={isDrafting && draftTarget === b.name} className="flex items-center gap-1.5">
                      <FileText size={14} /> Draft letter
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Draft Letter Modal ──────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="absolute inset-0 bg-forest/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Card */}
          <div
            ref={modalRef}
            className="relative z-10 w-full sm:max-w-xl sm:mx-4 max-h-[85vh] bg-white dark:bg-dark-card rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl border border-ivory-deep dark:border-dark-border flex flex-col overflow-hidden"
          >
            {/* Handle bar (mobile) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-ivory-deep dark:bg-dark-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 pt-4 sm:pt-6 pb-3 border-b border-ivory-deep dark:border-dark-border shrink-0">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-text-primary dark:text-text-dark-primary">
                  Motivation Letter
                </h3>
                <p className="text-xs text-text-muted mt-0.5">{draftTarget}</p>
              </div>
              <div className="flex items-center gap-2">
                {draftResult && (
                  <Button size="sm" variant="secondary" onClick={handleCopy} className="flex items-center gap-1.5">
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </Button>
                )}
                <button
                  onClick={closeModal}
                  className="p-2 text-text-muted hover:text-text-primary dark:hover:text-text-dark-primary hover:bg-ivory-warm dark:hover:bg-dark-surface rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
              {isDrafting ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-12 h-12 bg-terracotta/10 text-terracotta rounded-2xl flex items-center justify-center">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                  <p className="text-sm text-text-secondary dark:text-text-dark-secondary font-medium">
                    Drafting your letter...
                  </p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-text-primary dark:text-text-dark-primary">
                  {draftResult}
                </pre>
              )}
            </div>

            {/* Footer */}
            {draftResult && (
              <div className="px-5 sm:px-6 py-4 border-t border-ivory-deep dark:border-dark-border bg-ivory-warm/30 dark:bg-dark-surface/30 shrink-0">
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Review and personalise this draft before submitting. Replace placeholders in [brackets] with your details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
