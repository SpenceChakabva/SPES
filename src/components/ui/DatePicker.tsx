import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={`relative flex flex-col gap-1 ${className}`}>
      {label && <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{label}</label>}
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-terracotta transition-colors pointer-events-none">
          <CalendarIcon size={18} />
        </div>
        <input
          type="date"
          className="w-full h-12 pl-12 pr-4 bg-white dark:bg-dark-surface border-2 border-ivory-deep dark:border-dark-border rounded-xl font-body text-[15px] text-text-primary dark:text-text-dark-primary transition-all duration-fast ease-out focus:outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 appearance-none cursor-pointer"
          {...props}
        />
        <style>{`
          input[type="date"] {
            color-scheme: light;
          }
          .dark input[type="date"] {
            color-scheme: dark;
          }
          input[type="date"]::-webkit-calendar-picker-indicator {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            cursor: pointer;
            opacity: 0;
          }
        `}</style>
      </div>
    </div>
  );
};
