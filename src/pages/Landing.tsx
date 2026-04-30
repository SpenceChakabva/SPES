import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { MapPin, CalendarDays, Coins, FileText, Calendar, StickyNote, ShieldCheck, BookOpen, Database, Heart, Cpu } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { Slider } from '../components/ui/Slider';
import { Badge } from '../components/ui/Badge';
import { useProfile } from '../lib/store';

gsap.registerPlugin(TextPlugin);

const profileSteps = [
  {
    id: 'faculty',
    question: 'What faculty are you in?',
    type: 'select-chips',
    options: ['Commerce', 'Engineering', 'Humanities', 'Health Sciences', 'Law', 'Science'],
  },
  {
    id: 'year',
    question: 'What year are you in?',
    type: 'select-chips',
    options: ['1st year', '2nd year', '3rd year', '4th year', 'Honours', 'Masters', 'PhD'],
  },
  {
    id: 'nsfasStatus',
    question: 'Are you NSFAS funded?',
    type: 'select-chips',
    options: ['Yes — approved', 'Pending / applied', 'Not applicable', 'Declined'],
  },
  {
    id: 'budget',
    question: "What's your monthly accommodation budget?",
    type: 'slider',
    min: 1000,
    max: 12000,
    step: 100,
    unit: 'ZAR',
    hint: 'NSFAS accommodation cap is R4,500/month',
  },
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tempProfile, setTempProfile] = useState<Record<string, any>>({ budget: 4500 });

  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const setupRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const typingTextRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(() => {
    // Typing animation for the hero text
    if (typingTextRef.current) {
      gsap.to(typingTextRef.current, {
        duration: 1.5,
        text: "back.",
        ease: "none",
        delay: 0.5
      });
    }

    // Initial page load animation
    gsap.fromTo('.stagger-item', 
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      }
    );
  }, { scope: containerRef });

  const handleStart = contextSafe(() => {
    // Morph from intro to setup
    const tl = gsap.timeline({
      onComplete: () => setIsSettingUp(true)
    });

    tl.to(introRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in'
    });

    if (window.innerWidth >= 1024) {
      tl.to(rightColRef.current, {
        x: '20%',
        opacity: 0.5,
        duration: 0.8,
        ease: 'power3.inOut'
      }, "<");
    }
  });

  useGSAP(() => {
    if (isSettingUp && setupRef.current) {
      gsap.fromTo(setupRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isSettingUp]);

  useGSAP(() => {
    if (isSettingUp && stepContentRef.current) {
      gsap.fromTo(stepContentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [currentStep, isSettingUp]);

  const advanceStep = contextSafe(() => {
    if (currentStep < profileSteps.length - 1) {
      gsap.to(stepContentRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => setCurrentStep(prev => prev + 1)
      });
    } else {
      updateProfile(tempProfile);
      navigate('/home');
    }
  });

  const handleOptionSelect = (id: string, value: string) => {
    setTempProfile((prev) => ({ ...prev, [id]: value }));
    setTimeout(() => {
      advanceStep();
    }, 300);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempProfile((prev) => ({ ...prev, budget: parseInt(e.target.value) }));
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(215,97,68,0.05),transparent_40%)] dark:bg-dark">
      {/* Subtle floating elements - non-boxy */}
      <div className="absolute top-[40%] left-[20%] w-[15%] h-[15%] border border-terracotta/5 rounded-full -z-10 animate-[spin_20s_linear_infinite]"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[10%] h-[10%] border-2 border-forest/5 rounded-lg -z-10 rotate-12 opacity-30"></div>
      
      <div className="max-w-[1200px] mx-auto flex flex-col pt-8 pb-12 px-4 sm:px-6 min-h-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-start lg:items-center mb-12 lg:mb-16 flex-1">
        
        {/* Left Column */}
        <div className="flex flex-col w-full text-center lg:text-left items-center lg:items-start">
          <h1 className="text-[clamp(36px,8vw,64px)] font-display font-bold text-forest dark:text-ivory-warm tracking-tight leading-[1.05] mb-8 stagger-item">
            UCT is a lot to manage.<br />
            We have your <span ref={typingTextRef} className="text-terracotta dark:text-terracotta-light inline-block min-h-[1.2em]"></span>
            <span className="animate-pulse inline-block w-1 h-[0.8em] bg-terracotta dark:bg-terracotta-light ml-1 align-baseline"></span>
          </h1>

          {/* Wrapper for overlap without collapsing using CSS Grid */}
          <div className="grid grid-cols-1 grid-rows-1 w-full place-items-center lg:place-items-start">
            {!isSettingUp && (
              <div ref={introRef} className="col-start-1 row-start-1 w-full flex flex-col items-center lg:items-start">
                <p className="text-base sm:text-lg md:text-xl text-text-secondary dark:text-text-dark-secondary max-w-[480px] leading-relaxed mb-8 stagger-item">
                  Managing your UCT degree is a full-time job. Spes handles the admin side so you can focus on the academics.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-8 stagger-item">
                  {profile ? (
                    <Button size="lg" onClick={() => navigate('/home')} className="shadow-md w-auto px-8">
                      Welcome back — Go to Dashboard
                    </Button>
                  ) : (
                    <Button size="lg" onClick={handleStart} className="shadow-md w-auto px-8">
                      Start — 60 seconds
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-6 text-[13px] sm:text-[14px] text-text-muted dark:text-text-dark-muted font-medium stagger-item">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-sage/10 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                    <span>Offline-first</span>
                  </div>
                  <span className="text-ivory-deep dark:text-forest-darkpale">·</span>
                  <span>No tracking, no cookies</span>
                  <span className="text-ivory-deep dark:text-forest-darkpale">·</span>
                  <span>Built for UCT</span>
                </div>
              </div>
            )}

            {isSettingUp && (
              <div ref={setupRef} className="col-start-1 row-start-1 w-full">
                <div className="text-sm font-semibold uppercase tracking-wider text-terracotta dark:text-terracotta-light mb-4">
                  Step {currentStep + 1} of {profileSteps.length}
                </div>
                
                <div ref={stepContentRef}>
                  <h2 className="text-2xl sm:text-3xl font-display text-text-primary dark:text-text-dark-primary mb-6 lg:mb-8 max-w-[500px] leading-tight">
                    {profileSteps[currentStep].question}
                  </h2>
                  
                  {profileSteps[currentStep].type === 'select-chips' && (
                    <div className="flex flex-wrap gap-3 max-w-[500px]">
                      {profileSteps[currentStep].options?.map((opt) => (
                        <Chip
                          key={opt}
                          selected={tempProfile[profileSteps[currentStep].id] === opt}
                          onClick={() => handleOptionSelect(profileSteps[currentStep].id, opt)}
                          className="px-5 py-3 text-[15px]"
                        >
                          {opt}
                        </Chip>
                      ))}
                    </div>
                  )}

                  {profileSteps[currentStep].type === 'slider' && (
                    <div className="max-w-[400px]">
                      <div className="text-3xl font-mono font-medium text-text-primary dark:text-text-dark-primary mb-8 tracking-tight">
                        R {tempProfile.budget.toLocaleString()} <span className="text-lg text-text-secondary dark:text-text-dark-secondary font-body">/ month</span>
                      </div>
                      <Slider
                        min={profileSteps[currentStep].min}
                        max={profileSteps[currentStep].max}
                        step={profileSteps[currentStep].step}
                        value={tempProfile.budget}
                        onChange={handleSliderChange}
                      />
                      <div className="mt-4 text-[14px] text-text-muted dark:text-text-dark-muted font-medium">
                        {profileSteps[currentStep].hint}
                      </div>
                      <Button size="lg" onClick={advanceStep} className="mt-8 w-auto px-8 shadow-md">
                        Complete Setup
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column (Vivid Illustration) */}
        <div ref={rightColRef} className="hidden lg:flex justify-end items-center relative">
          <div className="w-full max-w-[500px] aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 stagger-item relative group">
            <img 
              src="/uct_student_buddy_illustration_1776955113674.png" 
              alt="UCT Student Buddy" 
              className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105"
            />
            {/* Overlay Gradient for depth - only in dark mode or subtle in light */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent mix-blend-multiply opacity-0 dark:opacity-60 transition-opacity"></div>
            
            {/* System Status Micro-interaction */}
            <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3 z-20">
               <div className="w-2 h-2 bg-sage rounded-full animate-pulse shadow-[0_0_8px_rgba(122,158,126,0.8)]"></div>
               <span className="text-[11px] font-bold uppercase tracking-wider text-ivory">All Systems Ready</span>
            </div>

            {/* Buddy Personality Traits */}
            <div className="absolute top-10 -left-6 z-20 stagger-item">
              <Card className="p-3 bg-white/90 dark:bg-dark-card/80 backdrop-blur-lg border-white/40 dark:border-dark-border shadow-xl rotate-[-4deg] flex items-center gap-3 max-w-[180px]">
                <div className="w-8 h-8 bg-terracotta/20 rounded-lg flex items-center justify-center text-terracotta">
                  <Heart className="w-4 h-4 fill-terracotta/40" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Personality</span>
                  <span className="text-[13px] font-bold text-forest dark:text-ivory-warm">UCT Native</span>
                </div>
              </Card>
            </div>

            <div className="absolute bottom-20 -right-4 z-20 stagger-item delay-200">
              <Card className="p-3 bg-white/90 dark:bg-dark-card/80 backdrop-blur-lg border-white/40 dark:border-dark-border shadow-xl rotate-[3deg] flex items-center gap-3 max-w-[180px]">
                <div className="w-8 h-8 bg-sage/20 rounded-lg flex items-center justify-center text-sage">
                  <Database className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Your Data</span>
                  <span className="text-[13px] font-bold text-forest dark:text-ivory-warm">User-Owned</span>
                </div>
              </Card>
            </div>

            {/* Floating illustrations/icons */}
            <div className="absolute top-[20%] right-[10%] animate-bounce delay-75 pointer-events-none opacity-40">
              <BookOpen className="w-6 h-6 text-terracotta" />
            </div>
            <div className="absolute bottom-[30%] left-[5%] animate-pulse pointer-events-none opacity-30">
              <Cpu className="w-8 h-8 text-forest dark:text-ivory-warm" />
            </div>
          </div>
          
          {/* Decorative Floaters */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-terracotta/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        </div>
      </div>

      {/* Tools Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 stagger-item">
        <Card interactive onClick={() => navigate('/accommodation')} className="p-4 sm:p-5 flex flex-col h-full bg-white dark:bg-dark-card/40 border-ivory-deep dark:border-dark-border shadow-sm hover:shadow-float hover:scale-[1.02] transition-all duration-slow ease-spring">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="font-display text-[14px] sm:text-[16px] font-bold text-text-primary dark:text-text-dark-primary mb-1 leading-tight tracking-tight">Accommodation</h3>
          <p className="text-[11px] sm:text-[13px] text-text-secondary dark:text-text-dark-secondary leading-relaxed m-0 mt-auto opacity-70">Verify off-campus listings.</p>
        </Card>
        <Card interactive onClick={() => navigate('/exams')} className="p-4 sm:p-5 flex flex-col h-full bg-white dark:bg-dark-card/40 border-ivory-deep dark:border-dark-border shadow-sm hover:shadow-float hover:scale-[1.02] transition-all duration-slow ease-spring">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="font-display text-[14px] sm:text-[16px] font-bold text-text-primary dark:text-text-dark-primary mb-1 leading-tight tracking-tight">Exam Planner</h3>
          <p className="text-[11px] sm:text-[13px] text-text-secondary dark:text-text-dark-secondary leading-relaxed m-0 mt-auto opacity-70">Manage the final rush.</p>
        </Card>
        <Card interactive onClick={() => navigate('/calendar')} className="p-4 sm:p-5 flex flex-col h-full bg-white dark:bg-dark-card/40 border-ivory-deep dark:border-dark-border shadow-sm hover:shadow-float hover:scale-[1.02] transition-all duration-slow ease-spring">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="font-display text-[14px] sm:text-[16px] font-bold text-text-primary dark:text-text-dark-primary mb-1 leading-tight tracking-tight">Timetable</h3>
          <p className="text-[11px] sm:text-[13px] text-text-secondary dark:text-text-dark-secondary leading-relaxed m-0 mt-auto opacity-70">Sync schedule locally.</p>
        </Card>
        <Card interactive onClick={() => navigate('/notes')} className="p-4 sm:p-5 flex flex-col h-full bg-white dark:bg-dark-card/40 border-ivory-deep dark:border-dark-border shadow-sm hover:shadow-float hover:scale-[1.02] transition-all duration-slow ease-spring">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <StickyNote className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="font-display text-[14px] sm:text-[16px] font-bold text-text-primary dark:text-text-dark-primary mb-1 leading-tight tracking-tight">Scratchpad</h3>
          <p className="text-[11px] sm:text-[13px] text-text-secondary dark:text-text-dark-secondary leading-relaxed m-0 mt-auto opacity-70">Quick lecture capture.</p>
        </Card>
        <Card interactive onClick={() => navigate('/funding')} className="p-4 sm:p-5 flex flex-col h-full bg-white dark:bg-dark-card/40 border-ivory-deep dark:border-dark-border shadow-sm hover:shadow-float hover:scale-[1.02] transition-all duration-slow ease-spring">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="font-display text-[14px] sm:text-[16px] font-bold text-text-primary dark:text-text-dark-primary mb-1 leading-tight tracking-tight">NSFAS Calc</h3>
          <p className="text-[11px] sm:text-[13px] text-text-secondary dark:text-text-dark-secondary leading-relaxed m-0 mt-auto opacity-70">Monitor funding gaps.</p>
        </Card>
        <Card interactive onClick={() => navigate('/funding')} className="p-4 sm:p-5 flex flex-col h-full bg-white dark:bg-dark-card/40 border-ivory-deep dark:border-dark-border shadow-sm hover:shadow-float hover:scale-[1.02] transition-all duration-slow ease-spring">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="font-display text-[14px] sm:text-[16px] font-bold text-text-primary dark:text-text-dark-primary mb-1 leading-tight tracking-tight">Bursaries</h3>
          <p className="text-[11px] sm:text-[13px] text-text-secondary dark:text-text-dark-secondary leading-relaxed m-0 mt-auto opacity-70">Find your next sponsor.</p>
        </Card>
      </div>

      {/* Privacy & Future AI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 stagger-item">
        <Card className="p-8 bg-ivory-warm dark:bg-dark-card/40 border-none relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-8 h-8 text-sage" />
              <h3 className="text-xl font-display font-bold text-forest dark:text-ivory-warm">Privacy First</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-text-secondary dark:text-text-dark-secondary mb-6">
              Your data never leaves your device. No cloud sync, no tracking, no sharing your academic journey.
            </p>
            <div className="flex gap-2">
              <Badge variant="verified">Offline Encrypted</Badge>
              <Badge variant="verified">Zero Analytics</Badge>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-5">
            <ShieldCheck size={200} />
          </div>
        </Card>

        <Card className="p-8 !bg-forest dark:!bg-dark-card text-ivory border-none relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-8 h-8 text-amber" />
              <h3 className="text-xl font-display font-bold italic text-ivory">AI Study Planner</h3>
            </div>
            <p className="text-[15px] leading-relaxed opacity-80 mb-8">
              Get personalised study plans, exam strategies, and academic advice — powered by Claude AI and fully private.
            </p>
            <div className="mt-auto">
              <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-forest transition-colors" onClick={() => navigate('/about')}>
                See Roadmap
              </Button>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-slow">
            <Cpu size={200} />
          </div>
        </Card>
      </div>
    </div>

    <style>{`
        @keyframes morph {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          100% { border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
