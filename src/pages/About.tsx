import React from 'react';
import { Shield, Lock, Zap, Sparkles, Database, Globe, Command } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col items-center text-center mb-12 sm:mb-20">
        <Badge variant="info" className="mb-4">v2.4</Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-forest dark:text-ivory-warm mb-6 sm:mb-8 tracking-tighter leading-[0.9]">
          Made for<br />UCT.
        </h1>
        <p className="text-base sm:text-xl text-text-secondary dark:text-text-dark-secondary max-w-2xl leading-relaxed font-medium px-2">
          Spes is a student companion built to take the pain out of university admin. We handle the paperwork side of your degree so you can focus on the work that actually matters.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20">
        {[
          {
            icon: <Shield size={24} />,
            title: "Offline First",
            color: "text-sage bg-sage/10",
            desc: "Your data loads instantly because it never has to travel to a server — it lives in your browser."
          },
          {
            icon: <Lock size={24} />,
            title: "Encrypted Storage",
            color: "text-terracotta bg-terracotta/10",
            desc: "Everything is encrypted before it's saved, so your data stays private even on shared devices."
          },
          {
            icon: <Command size={24} />,
            title: "Smart Parsing",
            color: "text-amber bg-amber/10",
            desc: "Paste your UCT timetable and the app extracts your schedule automatically — no manual entry needed."
          },
          {
            icon: <Zap size={24} />,
            title: "Fast & Light",
            color: "text-forest bg-forest/10",
            desc: "Snappy and responsive. Designed to stay out of your way, especially during exam season."
          }
        ].map((item, i) => (
          <Card key={i} className="p-6 border-none bg-white dark:bg-dark-card/60 hover:-translate-y-2 transition-all duration-slow group">
            <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-lg font-black text-text-primary dark:text-text-dark-primary mb-3 uppercase tracking-tighter">{item.title}</h3>
            <p className="text-[14px] text-text-secondary dark:text-text-dark-secondary leading-relaxed opacity-80">
              {item.desc}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 mb-12 sm:mb-20">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-display font-black text-forest dark:text-ivory-warm mb-6 leading-tight">
            Solving the <span className="text-terracotta italic">Admin Problem.</span>
          </h2>
          <p className="text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-6">
            University admin gets in the way of actual studying. This app was built to simplify the paperwork, track what matters, and keep everything private.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-ivory bg-ivory-deep dark:bg-forest-darkpale flex items-center justify-center">
                  <Sparkles size={14} className="text-terracotta" />
                </div>
              ))}
            </div>
            <span className="text-sm font-bold text-text-primary dark:text-text-dark-primary">Trusted by UCT students.</span>
          </div>
        </div>
        <Card className="p-8 !bg-forest text-ivory border-none relative overflow-hidden group">
          <div className="relative z-10">
            <Database className="text-terracotta mb-6" size={40} />
            <h3 className="text-2xl font-bold text-ivory mb-4 italic">Built for Privacy.</h3>
            <p className="opacity-80 leading-relaxed mb-8">
              No tracking, no analytics, no third-party scripts. Everything runs in your browser and stays there.
            </p>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-terracotta w-[85%] animate-pulse"></div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest mt-2 block opacity-40">Reliability: 99.9%</span>
          </div>
          <Globe className="absolute -bottom-20 -right-20 opacity-5 scale-150 group-hover:rotate-12 transition-transform duration-slow" size={300} />
        </Card>
      </div>

      <div className="text-center p-6 sm:p-12 bg-ivory-warm dark:bg-dark-card/20 rounded-2xl sm:rounded-[3rem] border border-ivory-deep dark:border-white/5">
        <h3 className="text-2xl font-bold mb-4 text-forest dark:text-ivory-warm">Simple. Fast. Private.</h3>
        <p className="text-text-secondary dark:text-text-dark-secondary max-w-lg mx-auto mb-8 text-[15px]">
          Built with React and GSAP. Designed specifically for UCT students who have better things to do than fight with admin.
        </p>
        <div className="flex justify-center gap-2">
           <div className="h-1.5 w-12 bg-terracotta rounded-full"></div>
           <div className="h-1.5 w-6 bg-sage rounded-full"></div>
           <div className="h-1.5 w-3 bg-forest rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
