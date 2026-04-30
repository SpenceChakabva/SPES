import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// ─── Local API middleware ─────────────────────────────────────────────────────
// In production (Vercel) `api/chat.ts` is a serverless function.
// In local dev, Vite doesn't know about that directory, so we wire a
// configureServer plugin that handles POST /api/chat directly in Node.js —
// reading ANTHROPIC_API_KEY / OPENAI_API_KEY from the local .env file.

function localApiPlugin(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      // Load .env variables so process.env.ANTHROPIC_API_KEY is available
      const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
      
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
          return res.end();
        }
        if (req.method !== 'POST') return next();

        // Collect body
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));

        const { messages, context, clientKey, provider } = body ?? {};
        const isOpenAI = provider === 'openai';
        const apiKey = clientKey || (isOpenAI ? env.OPENAI_API_KEY : env.ANTHROPIC_API_KEY);

        const reply = (status: number, data: unknown) => {
          const json = JSON.stringify(data);
          res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(json);
        };

        if (!apiKey) {
          return reply(503, { error: 'AI service not configured. Add your API key in Profile → AI Settings.' });
        }
        if (!Array.isArray(messages) || messages.length === 0) {
          return reply(400, { error: 'messages[] is required' });
        }

        const sanitised = messages
          .filter((m: { role?: string; content?: string }) => m?.role && m?.content)
          .map((m: { role: string; content: string }) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: String(m.content).slice(0, 4000),
          }));

        const systemPrompt = buildDevSystemPrompt(context);

        try {
          const text = isOpenAI
            ? await callOpenAI(apiKey, systemPrompt, sanitised)
            : await callAnthropic(apiKey, systemPrompt, sanitised);
          reply(200, { message: text });
        } catch (err: unknown) {
          const status = (err as { status?: number }).status ?? 0;
          if (status === 401) return reply(401, { error: 'Invalid API key. Check your key and try again.' });
          reply(502, { error: 'AI service error. Please try again.' });
        }
      });
    },
  };
}

async function callAnthropic(apiKey: string, system: string, messages: { role: string; content: string }[]) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-opus-4-5', max_tokens: 1500, system, messages }),
  });
  if (!r.ok) { const e: Error & { status?: number } = new Error('Anthropic error'); e.status = r.status; throw e; }
  const d = await r.json() as { content?: { type: string; text: string }[] };
  return d.content?.[0]?.type === 'text' ? d.content[0].text : '';
}

async function callOpenAI(apiKey: string, system: string, messages: { role: string; content: string }[]) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', max_tokens: 1500, messages: [{ role: 'system', content: system }, ...messages] }),
  });
  if (!r.ok) { const e: Error & { status?: number } = new Error('OpenAI error'); e.status = r.status; throw e; }
  const d = await r.json() as { choices?: { message: { content: string } }[] };
  return d.choices?.[0]?.message?.content ?? '';
}

function buildDevSystemPrompt(ctx?: Record<string, unknown>): string {
  let p = `You are the Spes Synthetic Intelligence — a sharp, tactical academic planning assistant built exclusively for UCT (University of Cape Town) students.

Personality: You have solid Cape Town swagger and smart humor. You drop subtle local UCT/Cape Town references (like Jammie shuttles, the south easter wind, Upper Campus steps, or Gatsby cravings) but you keep it highly professional, sharp, and helpful. You are a genius FANG-tier AI advisor who happens to be a local.
Format: Use ## headings, bullet points, and numbered steps when structuring plans. Bold key terms with **bold**. Keep it visually clean. No cringe emojis, just slick formatting.
Calendar Sync: If the user asks you to create a schedule or add events, you SHOULD output a visually appealing markdown table (e.g. | Time | Subject | Location |) AND you MUST ALSO output a JSON block wrapped in \`\`\`json calendar ... \`\`\` at the very end of your message. The JSON should be an array of objects: [{ "title": string, "time": "HH:MM - HH:MM", "location": string, "type": "lecture" | "tutorial" | "exam" | "other", "days": ["Mon", "Tue", "Wed", "Thu", "Fri"] }].
Scope: Study plans, exam strategy, time management, NSFAS/bursary guidance, accommodation, academic goals, course load management.
Constraint: If unsure about a UCT-specific fact, say so honestly. Do not hallucinate policies.`;

  if (!ctx) return p;

  p += '\n\n--- Student Profile ---';
  if (ctx.faculty) p += `\nFaculty: ${ctx.faculty}`;
  if (ctx.year) p += `\nYear of Study: ${ctx.year}`;
  if (ctx.nsfasStatus) p += `\nNSFAS: ${ctx.nsfasStatus}`;
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

  const notes = ctx.notes as { title: string; content: string }[] | undefined;
  if (notes?.length) {
    p += '\n\n--- Student Scratchpad (Todos & Notes) ---';
    notes.forEach(n => {
      p += `\n- **${n.title}**: ${n.content}`;
    });
  }

  if (ctx.currentDate) p += `\n\nToday: ${ctx.currentDate} (${ctx.currentMonth})`;

  return p;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [react(), localApiPlugin()],
});
