import type { StudentProfile, CalendarEvent, Exam } from './store';
import { secureStorage } from './crypto';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatPayload {
  messages: ChatMessage[];
  context?: Record<string, unknown>;
  clientKey?: string;
  provider?: string;
}

export interface ChatResponse {
  message: string;
}

export type AIErrorKind =
  | 'rate_limit'
  | 'not_configured'
  | 'network'
  | 'unknown';

/** Plain error object — avoids class syntax banned by erasableSyntaxOnly. */
export interface AIError {
  name: 'AIError';
  kind: AIErrorKind;
  message: string;
}

function makeAIError(kind: AIErrorKind, message: string): AIError {
  return { name: 'AIError', kind, message };
}

export function isAIError(err: unknown): err is AIError {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as AIError).name === 'AIError'
  );
}

// ─── Rate limiting ────────────────────────────────────────────────────────────

const RATE_KEY = 'spes_rate_log';
const MAX_REQUESTS_PER_HOUR = 30;
const ONE_HOUR_MS = 3_600_000;

function getRateLog(): number[] {
  const now = Date.now();
  const raw = secureStorage.getItem(RATE_KEY);
  return raw
    ? (JSON.parse(raw) as number[]).filter((t) => t > now - ONE_HOUR_MS)
    : [];
}

/** Returns remaining requests this hour. */
export function checkRateLimit(): number {
  return MAX_REQUESTS_PER_HOUR - getRateLog().length;
}

/** Returns false and blocks if the limit is reached. */
function consumeRateToken(): boolean {
  const log = getRateLog();
  if (log.length >= MAX_REQUESTS_PER_HOUR) return false;
  log.push(Date.now());
  secureStorage.setItem(RATE_KEY, JSON.stringify(log));
  return true;
}

// ─── API call ─────────────────────────────────────────────────────────────────

export async function sendChatMessage(payload: ChatPayload): Promise<ChatResponse> {
  if (!consumeRateToken()) {
    throw makeAIError(
      'rate_limit',
      `Rate limit reached. You can send up to ${MAX_REQUESTS_PER_HOUR} messages per hour. Try again later.`,
    );
  }

  let res: Response;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw makeAIError('network', 'Could not reach the AI service. Check your connection and try again.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    const message: string = err?.error ?? `HTTP ${res.status}`;

    if (message.toLowerCase().includes('not configured') || res.status === 503) {
      throw makeAIError(
        'not_configured',
        'The AI service is not configured yet. Add your API key in Profile → AI Settings.',
      );
    }

    throw makeAIError('unknown', message);
  }

  return res.json() as Promise<ChatResponse>;
}

// ─── Context builder ──────────────────────────────────────────────────────────

/** Strips sensitive fields and shapes student data into a compact AI context object. */
export function buildContext(
  profile: StudentProfile | null,
  exams: Exam[],
  events: CalendarEvent[],
  notes: { title: string; content: string; date: string }[] = [],
): Record<string, unknown> | undefined {
  if (!profile) return undefined;

  // Exclude API credentials from context
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { apiKey, apiProvider, ...safeProfile } = profile;

  const now = new Date();

  const upcomingExams = exams
    .filter((e) => new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({
      subject: e.subject,
      code: e.code,
      date: e.date,
      daysAway: Math.ceil((new Date(e.date).getTime() - now.getTime()) / 86_400_000),
      venue: e.venue,
    }));

  const activeSessions = events.map((ev) => ({
    title: ev.title,
    type: ev.type,
    time: ev.time,
    location: ev.location,
  }));

  return {
    ...safeProfile,
    upcomingExams,
    activeSessions,
    notes: notes.map((n) => ({ title: n.title, content: n.content })),
    currentDate: now.toISOString().split('T')[0],
    currentMonth: now.toLocaleString('en-US', { month: 'long' }),
  };
}

// ─── System prompt builder ────────────────────────────────────────────────────

/** Generate a rich system prompt for the Spes AI Study Planner. */
export function buildSystemPrompt(profile: StudentProfile | null): string {
  const baseRole = `You are Spes — a smart academic planning assistant built for UCT students. You are warm but direct. You use plain language and avoid filler. Format responses with clear structure (headers, bullet points) when helpful. Keep responses focused and actionable.`;

  if (!profile) return baseRole;

  const lines: string[] = [baseRole, ''];
  if (profile.faculty) lines.push(`The student is in the ${profile.faculty} faculty.`);
  if (profile.year) lines.push(`They are in their ${profile.year} year.`);
  if (profile.nsfasStatus) lines.push(`NSFAS status: ${profile.nsfasStatus}.`);
  if (profile.budget) lines.push(`Monthly budget: R${profile.budget.toLocaleString()}.`);
  if (profile.registeredCredits) lines.push(`Registered credits: ${profile.registeredCredits}.`);

  return lines.join('\n');
}
