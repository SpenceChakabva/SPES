import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Calendar as CalendarIcon, Clock, MapPin, RefreshCw, AlertCircle, Share, Plus, BookOpen, Trash2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { useProfile, type CalendarEvent } from '../lib/store';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const Calendar: React.FC = () => {
  const { events, exams, addEvent, deleteEvent, syncTimetable } = useProfile();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: 'lecture',
    time: '09:00 - 10:00',
    days: []
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const allEvents = [
    ...events,
    ...exams.map((e) => {
      const startTime = e.time ?? '00:00';
      const endHour = String(parseInt(startTime.split(':')[0], 10) + 2).padStart(2, '0');
      return {
        id: parseInt(e.id, 10),
        title: `EXAM: ${e.subject}`,
        time: `${startTime} - ${endHour}:00`,
        location: e.venue ?? 'TBC',
        type: 'exam' as const,
        code: e.code,
        days: [] as string[],
      };
    }),
  ].sort((a, b) => a.time.localeCompare(b.time));

  useGSAP(() => {
    gsap.from('.event-card', {
      x: -30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power4.out'
    });
  }, { scope: containerRef });

  const handleSync = contextSafe(() => {
    setIsSyncing(true);
    
    setTimeout(() => {
      syncTimetable();
      setIsSyncing(false);
    }, 1500);
  });

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.time && newEvent.location) {
      addEvent(newEvent as Omit<CalendarEvent, 'id'>);
      setShowAddForm(false);
      setNewEvent({ type: 'lecture', time: '09:00 - 10:00', days: [] });
    }
  };

  const exportToICal = () => {
    if (allEvents.length === 0) return;
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Spes//UCT Schedule//EN\n";
    allEvents.forEach(event => {
      const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const startTime = event.time.split(' - ')[0].replace(':', '');
      const endTime = event.time.split(' - ')[1].replace(':', '');
      icsContent += "BEGIN:VEVENT\nSUMMARY:" + event.title + "\nDTSTART:" + date + "T" + startTime + "00\nDTEND:" + date + "T" + endTime + "00\nLOCATION:" + event.location + "\nEND:VEVENT\n";
    });
    icsContent += "END:VCALENDAR";
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'uct-schedule.ics';
    link.click();
  };

  return (
    <div ref={containerRef} className="max-w-[1200px] mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="stagger-item">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info" className="px-3 py-1">Active Semester</Badge>
            <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-forest dark:text-ivory-warm tracking-tighter leading-none mb-3">
            Your<br className="hidden sm:block" /> Schedule.
          </h1>
          <p className="text-base sm:text-lg text-text-secondary dark:text-text-dark-secondary font-medium">
            {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 stagger-item w-full sm:w-auto">
          <Button variant="secondary" size="sm" onClick={exportToICal} className="bg-white dark:bg-dark-card/40 border-none shadow-sm flex-1 sm:flex-none">
            <Share size={16} /> Export
          </Button>
          <Button size="sm" onClick={handleSync} disabled={isSyncing} className="sync-btn shadow-md flex-1 sm:flex-none">
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-10 items-start">
        
        {/* Main Schedule Column */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-text-muted">Daily Timeline</h2>
            <div className="h-[1px] flex-1 mx-4 bg-ivory-deep dark:bg-forest-darkpale opacity-30" />
          </div>

          {allEvents.length === 0 ? (
            <Card className="py-24 px-10 bg-ivory-warm dark:bg-dark-card/20 border-dashed border-2 border-ivory-deep dark:border-dark-border text-center">
               <CalendarIcon size={64} strokeWidth={1} className="mx-auto mb-6 text-text-muted opacity-20" />
               <h3 className="text-xl font-bold mb-2">Your slate is clean</h3>
               <p className="text-text-secondary max-w-xs mx-auto">Sync your UCT timetable or add your lectures manually to get started.</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-4 relative">
              {/* Timeline Indicator Line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-terracotta/20 via-sage/20 to-transparent hidden sm:block" />
              
              {allEvents.map((event) => (
                <div key={event.id} className="event-card relative pl-0 sm:pl-12 group">
                  {/* Timeline Dot */}
                  <div className={`absolute left-[23px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-ivory bg-white ring-4 transition-all z-10 hidden sm:block ${
                    event.type === 'exam' ? 'ring-terracotta/20 bg-terracotta' : 'ring-sage/20 bg-sage'
                  }`} />
                  
                  <Card className={`p-0 overflow-hidden border-none shadow-none hover:shadow-float transition-all duration-slow ${
                    event.type === 'exam' 
                      ? 'bg-gradient-to-r from-terracotta/10 to-transparent border-l-4 border-l-terracotta' 
                      : 'bg-white dark:bg-dark-card/20 hover:bg-ivory-warm dark:hover:bg-dark-card/40'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-stretch">
                      <div className="p-5 flex-1 flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-16 flex flex-col items-center justify-center shrink-0">
                          <span className={`text-xl font-black ${event.type === 'exam' ? 'text-terracotta' : 'text-forest dark:text-ivory-warm'}`}>
                            {event.time.split(':')[0]}:{event.time.split(':')[1].split(' ')[0]}
                          </span>
                          <span className="text-[10px] font-black uppercase text-text-muted tracking-widest mt-1">START</span>
                        </div>
                        
                        <div className="h-8 w-[1px] bg-ivory-deep dark:bg-forest-darkpale hidden sm:block opacity-40" />
                        
                          <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                              <h3 className="text-lg font-bold text-text-primary dark:text-text-dark-primary">{event.title}</h3>
                              {event.type === 'exam' && <BookOpen size={14} className="text-terracotta" />}
                              {event.days && event.days.length > 0 && (
                                <div className="flex gap-1 ml-1">
                                  {event.days.map((d: string) => (
                                    <span key={d} className="text-[9px] font-black text-sage uppercase">{d}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1">
                            <div className="flex items-center gap-1.5 text-sm text-text-secondary dark:text-text-dark-secondary">
                              <Clock size={14} className="opacity-40" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-text-secondary dark:text-text-dark-secondary">
                              <MapPin size={14} className="opacity-40" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                           <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                             event.type === 'exam' ? 'bg-terracotta text-white' : 'bg-sage-pale text-sage'
                           }`}>
                             {event.type}
                           </div>
                           <button
                            onClick={() => deleteEvent(event.id)}
                            className="p-2 text-text-muted hover:text-clay-red transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tactical Control Sidebar */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-8 stagger-item">
          <Card className="p-6 !bg-forest text-ivory border-none shadow-xl overflow-hidden relative group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="text-amber" size={24} />
                <h3 className="text-xl font-bold text-ivory">Manual Entry</h3>
              </div>
              
              {!showAddForm ? (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="w-full p-4 rounded-2xl bg-white/10 border-2 border-dashed border-white/20 text-white/60 hover:text-white hover:bg-white/20 hover:border-white/40 transition-all flex flex-col items-center gap-2 group/btn"
                >
                  <Plus className="group-hover/btn:scale-125 transition-transform" />
                  <span className="text-sm font-bold">Add Custom Lecture</span>
                </button>
              ) : (
                <div className="flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">Session Title</label>
                    <Input 
                      placeholder="e.g. CSC2001F Tutorial" 
                      className="h-10"
                      value={newEvent.title || ''}
                      onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">Time Slot</label>
                    <Input 
                      placeholder="09:00 - 10:00" 
                      className="h-10"
                      value={newEvent.time || ''}
                      onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">Venue</label>
                    <Input 
                      placeholder="RW James 3A" 
                      className="h-10"
                      value={newEvent.location || ''}
                      onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    <label className="text-[10px] font-bold uppercase opacity-60 tracking-wider">Repeat Days</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {DAYS.map(day => (
                        <button
                          key={day}
                          onClick={() => {
                            const current = newEvent.days || [];
                            const updated = current.includes(day) 
                              ? current.filter(d => d !== day) 
                              : [...current, day];
                            setNewEvent({...newEvent, days: updated});
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                            (newEvent.days || []).includes(day) 
                              ? 'bg-sage text-ivory ring-2 ring-sage/20' 
                              : 'bg-white/5 text-white/40 hover:bg-white/10'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)} className="flex-1 border-white/10 text-white/60 hover:text-white">Cancel</Button>
                    <Button size="sm" onClick={handleAddEvent} className="flex-1 bg-white text-forest hover:bg-ivory-warm">Add to Schedule</Button>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-terracotta/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </Card>

          <Card className="p-6 bg-ivory-warm dark:bg-dark-card/40 border-none">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-terracotta shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-bold text-text-primary dark:text-text-dark-primary mb-1">Synchronization Tip</h4>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary leading-relaxed">
                  Syncing pulls directly from PeopleSoft. Manual entries are stored locally and will persist through cloud syncs.
                </p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
