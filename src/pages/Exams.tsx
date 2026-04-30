import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Textarea, Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AlertTriangle, Trash2, Plus, Sparkles, Edit2, Save, MapPin, Clock, Brain } from 'lucide-react';
import { DatePicker } from '../components/ui/DatePicker';
import { Badge } from '../components/ui/Badge';
import { useProfile, type Exam } from '../lib/store';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function urgencyColor(days: number): string {
  if (days < 0) return 'text-text-muted';
  if (days <= 3) return 'text-terracotta';
  if (days <= 14) return 'text-amber';
  return 'text-sage';
}

// ─── Blank exam factory ───────────────────────────────────────────────────────

function blankExam(): Exam {
  return {
    id: Date.now().toString(),
    subject: 'New Course',
    code: 'COURSE101',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    venue: 'Exam Hall',
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Exams: React.FC = () => {
  const { exams, setExams } = useProfile();

  const [timetableText, setTimetableText] = useState('');
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Exam | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Simulate timetable parsing (demo: adds two preset exams). */
  const handleAnalyse = contextSafe(() => {
    if (!timetableText.trim()) return;
    setIsAnalysing(true);

    setTimeout(() => {
      const parsed: Exam[] = [
        { id: `${Date.now()}1`, subject: 'Computer Science 2A', code: 'CSC2001F', date: '2026-06-02', time: '09:00', venue: 'Sports Hall' },
        { id: `${Date.now()}2`, subject: 'Maths 2000W', code: 'MAM2000W', date: '2026-06-05', time: '14:00', venue: 'Jameson Hall' },
      ];
      setExams((prev: Exam[]) => [...prev, ...parsed]);
      setIsAnalysing(false);
      setTimetableText('');

      gsap.from('.exam-card', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' });
    }, 1500);
  });

  const startEditing = (exam: Exam) => {
    setEditingId(exam.id);
    setEditDraft({ ...exam });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const saveEdit = () => {
    if (!editDraft || !editingId) return;
    setExams((prev: Exam[]) => prev.map((e) => (e.id === editingId ? editDraft : e)));
    cancelEditing();
  };

  const patchDraft = (field: keyof Exam, value: string) => {
    setEditDraft((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const addManualExam = () => {
    const newExam = blankExam();
    setExams((prev: Exam[]) => [newExam, ...prev]);
    startEditing(newExam);
  };

  const deleteExam = (id: string) => {
    setExams((prev: Exam[]) => prev.filter((e) => e.id !== id));
    if (editingId === id) cancelEditing();
  };

  // Sort: upcoming first
  const sorted = [...exams].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div ref={containerRef} className="max-w-[900px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="danger" className="px-3 py-1">Tactical Readiness</Badge>
            <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-forest dark:text-ivory-warm tracking-tighter leading-none mb-2">
            Exam Planner.
          </h1>
          <p className="text-base text-text-secondary dark:text-text-dark-secondary">
            Stay ahead of the registration density.
          </p>
        </div>
        <Button size="sm" onClick={addManualExam} className="shadow-md px-6 shrink-0">
          <Plus size={16} /> Add Paper
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-8">

        {/* ── Exam list ── */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted shrink-0">
              Deployment Papers
            </h2>
            <div className="h-px flex-1 bg-ivory-deep dark:bg-dark-border opacity-40" />
            <span className="text-[11px] font-bold text-text-muted shrink-0">{exams.length}</span>
          </div>

          {sorted.length === 0 ? (
            <div className="py-14 px-8 bg-ivory-warm/40 dark:bg-dark-card/30 rounded-[2rem] border-2 border-dashed border-ivory-deep dark:border-forest-mid/30 text-center">
              <Sparkles className="mx-auto mb-4 text-terracotta opacity-30" size={36} />
              <p className="text-text-secondary dark:text-text-dark-secondary font-medium text-sm">
                Scan your timetable or add your first exam to get started.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sorted.map((exam) => {
                const days = daysUntil(exam.date);
                const isEditing = editingId === exam.id;

                return (
                  <Card
                    key={exam.id}
                    className={`exam-card p-4 sm:p-5 group transition-all border-none ${
                      isEditing
                        ? 'bg-white dark:bg-dark-card shadow-xl ring-2 ring-terracotta/20'
                        : 'bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm hover:shadow-float'
                    }`}
                  >
                    {isEditing && editDraft ? (
                      /* ── Edit form ── */
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Subject</label>
                            <Input value={editDraft.subject} onChange={(e) => patchDraft('subject', e.target.value)} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Code</label>
                            <Input value={editDraft.code ?? ''} onChange={(e) => patchDraft('code', e.target.value)} />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <DatePicker
                            label="Date"
                            value={editDraft.date}
                            onChange={(e) => patchDraft('date', e.target.value)}
                          />
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Time</label>
                            <Input type="time" value={editDraft.time ?? ''} onChange={(e) => patchDraft('time', e.target.value)} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase text-text-muted tracking-wider">Venue</label>
                            <Input placeholder="e.g. Jameson Hall" value={editDraft.venue ?? ''} onChange={(e) => patchDraft('venue', e.target.value)} />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-1">
                          <Button variant="ghost" size="sm" onClick={cancelEditing} className="text-text-muted">Cancel</Button>
                          <Button size="sm" onClick={saveEdit}>
                            <Save size={14} /> Save Paper
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* ── Read view ── */
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
                          {/* Date block */}
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-forest text-ivory rounded-xl sm:rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm">
                            <span className="text-[9px] font-bold uppercase opacity-60 leading-none">
                              {new Date(exam.date).toLocaleDateString('en-ZA', { month: 'short' })}
                            </span>
                            <span className="text-xl font-black leading-tight">
                              {new Date(exam.date).getDate()}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              {exam.code && (
                                <span className="font-mono font-black text-[11px] text-terracotta bg-terracotta/8 px-2 py-0.5 rounded-md">
                                  {exam.code}
                                </span>
                              )}
                              <Badge variant="neutral" className="text-[9px]">Confirmed</Badge>
                              {days >= 0 && (
                                <span className={`text-[10px] font-bold ${urgencyColor(days)}`}>
                                  {days === 0 ? 'Today' : `${days}d away`}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-text-primary dark:text-text-dark-primary m-0 leading-snug truncate">
                              {exam.subject}
                            </h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                              {exam.time && (
                                <div className="flex items-center gap-1.5 text-[12px] text-text-secondary dark:text-text-dark-secondary">
                                  <Clock size={12} className="opacity-50" />
                                  {exam.time}
                                </div>
                              )}
                              {exam.venue && (
                                <div className="flex items-center gap-1.5 text-[12px] text-text-secondary dark:text-text-dark-secondary">
                                  <MapPin size={12} className="opacity-50" />
                                  {exam.venue}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions — visible on hover (desktop), always on mobile */}
                        <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0 self-start">
                          <button
                            onClick={() => startEditing(exam)}
                            title="Edit"
                            className="p-2 rounded-lg text-text-muted hover:text-forest dark:hover:text-ivory transition-colors hover:bg-ivory-warm dark:hover:bg-white/5"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteExam(exam.id)}
                            title="Delete"
                            className="p-2 rounded-lg text-text-muted hover:text-terracotta transition-colors hover:bg-terracotta/8"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Sidebar tools ── */}
        <div className="flex flex-col gap-4">

          {/* SI Quick-Scan card */}
          <Card className="p-5 sm:p-6 bg-forest text-ivory border-none shadow-float overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                <Brain size={18} className="text-amber" />
                Quick-Scan
              </h3>
              <p className="text-xs opacity-70 mb-4 leading-relaxed">
                Paste your timetable text from the UCT portal and I'll extract all dates and venues for you.
              </p>
              <Textarea
                placeholder="Paste timetable text here…"
                className="bg-white/10 border-white/20 text-ivory placeholder:text-ivory/30 min-h-[100px] mb-4 text-sm focus:bg-white/20 transition-all"
                value={timetableText}
                onChange={(e) => setTimetableText(e.target.value)}
              />
              <Button
                variant="primary"
                className="w-full bg-ivory text-forest hover:bg-ivory-warm active:scale-95 transition-transform"
                onClick={handleAnalyse}
                isLoading={isAnalysing}
                disabled={!timetableText.trim()}
              >
                Scan Timetable
              </Button>
            </div>
            <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-terracotta/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
          </Card>

          {/* Insight card */}
          {exams.length > 0 && (
            <Card className="p-5 bg-amber-pale dark:bg-amber/10 border-none animate-in zoom-in-95 duration-500">
              <div className="flex gap-3 mb-3">
                <AlertTriangle className="text-amber shrink-0" size={20} />
                <h4 className="font-bold text-sm m-0 text-text-primary dark:text-text-dark-primary">SI Insight</h4>
              </div>
              <p className="text-xs leading-relaxed text-text-secondary dark:text-text-dark-secondary">
                {exams.length} paper{exams.length !== 1 ? 's' : ''} logged.
                {exams.length >= 2 && ' Plan for your most dense cluster of exams first — spacing recovery time between consecutive papers is critical.'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
