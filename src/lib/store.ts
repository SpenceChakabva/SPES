import { useState, useEffect, useMemo } from 'react';
import { secureStorage } from './crypto';

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface StudentProfile {
  faculty?: string;
  year?: string;
  nsfasStatus?: string;
  budget?: number;
  homeProvince?: string;
  registeredCredits?: number;
  apiKey?: string;
  apiProvider?: 'server' | 'anthropic' | 'openai';
}

export interface Exam {
  id: string;
  subject: string;
  code?: string;
  date: string;   // ISO date string, e.g. '2026-06-02'
  time?: string;  // 24-hour time, e.g. '09:00'
  venue?: string;
  duration?: number; // minutes
  notes?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  location: string;
  type: 'lecture' | 'tutorial' | 'other';
  days?: string[];
}

export interface PlannerMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  PROFILE: 'spes_profile',
  NOTES: 'spes_notes',
  EVENTS: 'spes_events',
  EXAMS: 'spes_exams_list',
  PLANNER: 'spes_planner_history',
} as const;

// ─── Generic storage helpers ──────────────────────────────────────────────────

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = secureStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// ─── Main hook ────────────────────────────────────────────────────────────────

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(() =>
    readStorage<StudentProfile | null>(KEYS.PROFILE, null)
  );

  const [notes, setNotes] = useState<Note[]>(() =>
    readStorage<Note[]>(KEYS.NOTES, [])
  );

  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    readStorage<CalendarEvent[]>(KEYS.EVENTS, [])
  );

  const [exams, setExams] = useState<Exam[]>(() =>
    readStorage<Exam[]>(KEYS.EXAMS, [])
  );

  const [plannerHistory, setPlannerHistory] = useState<PlannerMessage[]>(() =>
    readStorage<PlannerMessage[]>(KEYS.PLANNER, [])
  );

  // Persist on change
  useEffect(() => { secureStorage.setItem(KEYS.PROFILE, JSON.stringify(profile)); }, [profile]);
  useEffect(() => { secureStorage.setItem(KEYS.NOTES, JSON.stringify(notes)); }, [notes]);
  useEffect(() => { secureStorage.setItem(KEYS.EVENTS, JSON.stringify(events)); }, [events]);
  useEffect(() => { secureStorage.setItem(KEYS.EXAMS, JSON.stringify(exams)); }, [exams]);
  useEffect(() => { secureStorage.setItem(KEYS.PLANNER, JSON.stringify(plannerHistory)); }, [plannerHistory]);

  // ─── Computed selectors ──────────────────────────────────────────────────

  const now = new Date();

  const upcomingExams = useMemo(
    () =>
      exams
        .filter((e) => new Date(e.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [exams] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const nextExam = upcomingExams[0] ?? null;

  const daysToNextExam = nextExam
    ? Math.ceil((new Date(nextExam.date).getTime() - now.getTime()) / 86_400_000)
    : null;

  // ─── Mutations ────────────────────────────────────────────────────────────

  const updateProfile = (updates: Partial<StudentProfile>) =>
    setProfile((prev) => ({ ...prev, ...updates }));

  const clearProfile = () => {
    setProfile(null);
    setNotes([]);
    setEvents([]);
    setExams([]);
    setPlannerHistory([]);
    secureStorage.clear();
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) =>
    setEvents((prev) => [...prev, { ...event, id: Date.now() }]);

  const deleteEvent = (id: number) =>
    setEvents((prev) => prev.filter((e) => e.id !== id));

  const updateEvent = (id: number, updates: Partial<CalendarEvent>) =>
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));

  const addExam = (exam: Omit<Exam, 'id'>) =>
    setExams((prev) => [...prev, { ...exam, id: Date.now().toString() }]);

  const deleteExam = (id: string) =>
    setExams((prev) => prev.filter((e) => e.id !== id));

  /** Prefill a representative demo timetable */
  const syncTimetable = () =>
    setEvents([
      { id: 1, title: 'CSC2001F Lecture', time: '09:00 - 09:45', location: 'RW James 3A', type: 'lecture' },
      { id: 2, title: 'MAM2000W Tutorial', time: '11:00 - 12:45', location: 'PD Hahn 4', type: 'tutorial' },
      { id: 3, title: 'Sports Club Meeting', time: '17:00 - 18:00', location: 'Sports Center', type: 'other' },
    ]);

  return {
    // State
    profile,
    notes,
    events,
    exams,
    plannerHistory,
    // Computed
    upcomingExams,
    nextExam,
    daysToNextExam,
    // Setters
    updateProfile,
    clearProfile,
    setNotes,
    setEvents,
    addEvent,
    deleteEvent,
    updateEvent,
    setExams,
    addExam,
    deleteExam,
    setPlannerHistory,
    syncTimetable,
  };
}
