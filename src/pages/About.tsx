import React from 'react';
import { Shield, Lock, Zap, Sparkles, Database, Globe, Command } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col items-center text-center mb-12 sm:mb-20">
        <Badge variant="info" className="mb-4">System Intelligence v2.4</Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-forest dark:text-ivory-warm mb-6 sm:mb-8 tracking-tighter leading-[0.9]">
          Tactical<br />Sovereignty.
        </h1>
        <p className="text-base sm:text-xl text-text-secondary dark:text-text-dark-secondary max-w-2xl leading-relaxed font-medium px-2">
          Thuthuka is a tactical infrastructure engine engineered to eliminate administrative friction for the high-performance UCT student. We don't just solve problems; we architect around them.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20">
        {[
          {
            icon: <Shield size={24} />,
            title: "Local-First Core",
            color: "text-sage bg-sage/10",
            desc: "Zero-latency data access via local browser sandboxing. Your intelligence remains yours."
          },
          {
            icon: <Lock size={24} />,
            title: "Private persistence",
            color: "text-terracotta bg-terracotta/10",
            desc: "Encrypted storage protocols ensure your academic roadmap is invisible to the outside world."
          },
          {
            icon: <Command size={24} />,
            title: "Heuristic Parsing",
            color: "text-amber bg-amber/10",
            desc: "Advanced client-side logic extracts tactical schedule data without server-side vulnerabilities."
          },
          {
            icon: <Zap size={24} />,
            title: "Sub-second Flow",
            color: "text-forest bg-forest/10",
            desc: "Optimized for speed. Designed for the milliseconds that count during exam season."
          }
        ].map((item, i) => (
          <Card key={i} className="p-6 border-none bg-white/40 dark:bg-forest-darkpale/20 backdrop-blur-lg hover:-translate-y-2 transition-all duration-slow group">
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
            Solving the <span className="text-terracotta italic">Administrative Vacuum.</span>
          </h2>
          <p className="text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-6">
            University admin is often a black hole of productivity. Thuthuka was built to bridge the gap between UCT's legacy systems and the modern student's need for instant, portable, and private insights.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-ivory bg-ivory-deep dark:bg-forest-darkpale flex items-center justify-center">
                  <Sparkles size={14} className="text-terracotta" />
                </div>
              ))}
            </div>
            <span className="text-sm font-bold text-text-primary dark:text-text-dark-primary">Trusted by tactical students.</span>
          </div>
        </div>
        <Card className="p-8 bg-forest text-ivory border-none relative overflow-hidden group">
          <div className="relative z-10">
            <Database className="text-terracotta mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4 italic">The Architecture of Privacy.</h3>
            <p className="opacity-80 leading-relaxed mb-8">
              We don't "scrape" or "track". We empower. By utilizing native browser APIs, we've created a tool that is functionally robust yet architecturally invisible to trackers.
            </p>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-terracotta w-[85%] animate-pulse"></div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest mt-2 block opacity-40">System Efficiency: 99.9%</span>
          </div>
          <Globe className="absolute -bottom-20 -right-20 opacity-5 scale-150 group-hover:rotate-12 transition-transform duration-slow" size={300} />
        </Card>
      </div>

      <div className="text-center p-6 sm:p-12 bg-ivory-warm/30 dark:bg-forest-darkpale/40 rounded-2xl sm:rounded-[3rem] border border-ivory-deep dark:border-white/5">
        <h3 className="text-2xl font-bold mb-4 text-forest dark:text-ivory-warm">Smart Tackling. Sub-second Execution.</h3>
        <p className="text-text-secondary dark:text-text-dark-secondary max-w-lg mx-auto mb-8 text-[15px]">
          Thuthuka is not just an app; it's a statement on data sovereignty. Built with React, GSAP, and a relentless focus on solving the UCT experience.
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
