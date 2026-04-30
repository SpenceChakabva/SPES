import React from 'react';
import { ShieldCheck, EyeOff, Database, Key, ServerOff, Fingerprint } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col items-center text-center mb-12 sm:mb-20">
        <Badge variant="verified" className="mb-4">Encryption Level: Tactical</Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-forest dark:text-ivory-warm mb-6 sm:mb-8 tracking-tighter leading-[0.9]">
          Data<br />Sovereignty.
        </h1>
        <p className="text-base sm:text-xl text-text-secondary dark:text-text-dark-secondary max-w-2xl leading-relaxed font-medium px-2">
          Your academic journey is your own intelligence. Thuthuka is architected to ensure that your data remains under your absolute control, stored exclusively on your hardware.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-20">
        <Card className="p-6 sm:p-10 border-none bg-ivory-warm/40 dark:bg-forest-darkpale/20 backdrop-blur-md relative overflow-hidden">
          <div className="relative z-10">
            <ServerOff className="text-terracotta mb-6" size={40} />
            <h2 className="text-2xl font-black text-text-primary dark:text-text-dark-primary mb-4 uppercase tracking-tighter">Zero Server Footprint</h2>
            <p className="text-text-secondary dark:text-text-dark-secondary leading-relaxed opacity-80">
              Unlike traditional SaaS platforms, Thuthuka has no central database for user data. Every piece of information—from your registered credits to your private notes—is written to your browser's local storage engine.
            </p>
          </div>
          <Database className="absolute -bottom-10 -right-10 opacity-5" size={200} />
        </Card>

        <Card className="p-6 sm:p-10 border-none bg-forest text-ivory relative overflow-hidden">
          <div className="relative z-10">
            <EyeOff className="text-terracotta-light mb-6" size={40} />
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Stealth Architecture</h2>
            <p className="opacity-80 leading-relaxed">
              We do not use analytics trackers, heatmaps, or third-party marketing pixels. Your navigation through the Thuthuka engine is mathematically private. No one—not even us—knows how you use the tool.
            </p>
          </div>
          <Fingerprint className="absolute -bottom-10 -right-10 opacity-10" size={200} />
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-20">
        {[
          {
            icon: <ShieldCheck className="text-sage" />,
            title: "Local Encryption",
            desc: "Data is sandboxed within your browser's security model."
          },
          {
            icon: <Key className="text-amber" />,
            title: "Total Portability",
            desc: "Export your entire intelligence stack as a JSON backup at any time."
          },
          {
            icon: <Database className="text-terracotta" />,
            title: "Instant Purge",
            desc: "One click to permanently erase all tactical data from your device."
          }
        ].map((item, i) => (
          <Card key={i} className="p-6 bg-white/40 dark:bg-forest-darkpale/10 border-none flex flex-col items-center text-center">
            <div className="mb-4">{item.icon}</div>
            <h3 className="font-bold text-text-primary dark:text-text-dark-primary mb-2 uppercase text-xs tracking-widest">{item.title}</h3>
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary opacity-70 leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>

      <div className="bg-ivory-warm/20 dark:bg-forest-darkpale/30 rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 border border-ivory-deep dark:border-white/5 text-center">
        <h3 className="text-2xl font-bold mb-6 text-forest dark:text-ivory-warm italic underline decoration-terracotta decoration-2 underline-offset-8">Cookie & Storage Notice</h3>
        <p className="text-text-secondary dark:text-text-dark-secondary max-w-2xl mx-auto leading-relaxed mb-8">
          Thuthuka uses <strong>LocalStorage</strong> and <strong>SessionStorage</strong> to maintain your tactical environment across sessions. We do not use cookies for tracking or marketing. By using the platform, you acknowledge that your data is stored locally on this machine for operational performance.
        </p>
        <Badge variant="verified">100% Local-First Compliance</Badge>
      </div>
    </div>
  );
};
