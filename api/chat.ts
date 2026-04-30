import type { VercelRequest, VercelResponse } from '@vercel/node';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MAX_CONTENT_LENGTH = 4000;

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, context, clientKey, provider } = req.body ?? {};
  const isOpenAI = provider === 'openai';

  // Resolve key: client BYOK → server env
  const apiKey =
    clientKey ||
    (isOpenAI ? process.env.OPENAI_API_KEY : process.env.ANTHROPIC_API_KEY);

  if (!apiKey) {
    return res.status(503).json({
      error: 'AI service not configured. Add your API key in Profile → AI Settings.',
      code: 'NO_KEY',
    });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages[] is required' });
  }

  const sanitised = messages
    .filter((m: Message) => m?.role && m?.content)
    .map((m: Message) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content).slice(0, MAX_CONTENT_LENGTH),
    }));

  if (sanitised.length === 0) {
    return res.status(400).json({ error: 'No valid messages provided' });
  }

  const systemPrompt = buildSystemPrompt(context);

  try {
    const text = isOpenAI
      ? await callOpenAI(apiKey, systemPrompt, sanitised)
      : await callAnthropic(apiKey, systemPrompt, sanitised);

    return res.status(200).json({ message: text });
  } catch (err: unknown) {
    console.error('Chat handler error:', err);
    const status = (err as { status?: number }).status ?? 0;

    if (status === 401) {
      return res.status(401).json({
        error: 'Invalid API key. Please check your key and try again.',
        code: 'INVALID_KEY',
      });
    }
    if (status === 429) {
      return res.status(429).json({
        error: 'AI rate limit reached. Please wait a moment and try again.',
        code: 'RATE_LIMIT',
      });
    }
    return res.status(502).json({ error: 'AI service error. Please try again.' });
  }
}

// ─── Provider calls ───────────────────────────────────────────────────────────

interface Message { role: string; content: string; }

async function callAnthropic(apiKey: string, system: string, messages: Message[]): Promise<string> {
  const r = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      system,
      messages,
    }),
  });

  if (!r.ok) {
    const e: Error & { status?: number } = new Error('Anthropic error');
    e.status = r.status;
    throw e;
  }

  const data = await r.json() as { content?: { type: string; text: string }[] };
  return data.content?.[0]?.type === 'text' ? data.content[0].text : '';
}

async function callOpenAI(apiKey: string, system: string, messages: Message[]): Promise<string> {
  const r = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1500,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });

  if (!r.ok) {
    const e: Error & { status?: number } = new Error('OpenAI error');
    e.status = r.status;
    throw e;
  }

  const data = await r.json() as { choices?: { message: { content: string } }[] };
  return data.choices?.[0]?.message?.content ?? '';
}

// ─── System prompt ────────────────────────────────────────────────────────────

type Context = Record<string, unknown>;

function buildSystemPrompt(ctx?: Context): string {
  let p = `You are the Thuthuka Synthetic Intelligence — a sharp, tactical academic planning assistant built exclusively for UCT (University of Cape Town) students.

Personality: You have solid Cape Town swagger and smart humor. You drop subtle local UCT/Cape Town references (like Jammie shuttles, the south easter wind, Upper Campus steps, or Gatsby cravings) but you keep it highly professional, sharp, and helpful. You are a genius FANG-tier AI advisor who happens to be a local.
Format: Use ## headings, bullet points, and numbered steps when structuring plans. Bold key terms with **bold**. Keep it visually clean. No cringe emojis, just slick formatting.
Scope: Study plans, exam strategy, time management, NSFAS/bursary guidance, accommodation, academic goals, course load management.
Constraint: If unsure about a UCT-specific fact, say so honestly. Do not hallucinate policies.`;

  if (!ctx) return p;

  p += '\n\n--- Student Profile ---';
  if (ctx.faculty) p += `\nFaculty: ${ctx.faculty}`;
  if (ctx.year) p += `\nYear of Study: ${ctx.year}`;
  if (ctx.nsfasStatus) p += `\nNSFAS Status: ${ctx.nsfasStatus}`;
  if (ctx.budget) p += `\nMonthly Budget: R${ctx.budget}`;
  if (ctx.homeProvince) p += `\nHome Province: ${ctx.homeProvince}`;
  if (ctx.registeredCredits) p += `\nRegistered Credits: ${ctx.registeredCredits}`;

  const exams = ctx.upcomingExams as { subject: string; code?: string; date: string; daysAway: number; venue?: string }[] | undefined;
  if (exams?.length) {
    p += '\n\n--- Upcoming Exams ---';
    exams.forEach(e => {
      p += `\n- ${e.subject}${e.code ? ` (${e.code})` : ''}: ${e.date} — ${e.daysAway} day${e.daysAway !== 1 ? 's' : ''} away${e.venue ? `, ${e.venue}` : ''}`;
    });
  }

  const sessions = ctx.activeSessions as { title: string; type: string; time: string; location: string }[] | undefined;
  if (sessions?.length) {
    p += '\n\n--- Weekly Schedule ---';
    sessions.forEach(s => {
      p += `\n- ${s.title} [${s.type}]: ${s.time} @ ${s.location}`;
    });
  }

  if (ctx.currentDate) p += `\n\nToday's Date: ${ctx.currentDate} (${ctx.currentMonth})`;

  return p;
}
