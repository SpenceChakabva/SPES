import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useProfile, type PlannerMessage } from '../lib/store';
import { sendChatMessage, buildContext, checkRateLimit, isAIError } from '../lib/ai';
import { Button } from '../components/ui/Button';
import {
  Send,
  Brain,
  User,
  Sparkles,
  BookOpen,
  CalendarDays,
  Target,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

// ─── Quick actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    label: 'Build study plan',
    prompt: 'Create a detailed weekly study plan based on my courses and exams. Break it into focused daily time blocks.',
    icon: BookOpen,
  },
  {
    label: 'Exam strategy',
    prompt: 'Help me prepare a tactical exam strategy. What topics should I prioritise and in what order?',
    icon: CalendarDays,
  },
  {
    label: 'Weekly reset',
    prompt: 'Plan my upcoming week — balance lectures, study time, exercise, and rest. Be realistic about energy levels.',
    icon: Target,
  },
  {
    label: 'Motivate me',
    prompt: "I'm feeling overwhelmed with my workload. Give me a direct, tactical pep talk and help me prioritise what matters most right now.",
    icon: Sparkles,
  },
] as const;

// ─── Message renderer ─────────────────────────────────────────────────────────

/** Lightweight markdown renderer: bold, code, lists, and line breaks. */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    const key = `line-${lineIdx}`;

    // Heading
    if (line.startsWith('### ')) {
      nodes.push(<p key={key} className="font-bold text-sm mt-3 mb-1 text-text-primary dark:text-text-dark-primary">{line.slice(4)}</p>);
      return;
    }
    if (line.startsWith('## ')) {
      nodes.push(<p key={key} className="font-bold text-sm mt-3 mb-1 text-text-primary dark:text-text-dark-primary">{line.slice(3)}</p>);
      return;
    }
    if (line.startsWith('# ')) {
      nodes.push(<p key={key} className="font-bold text-sm mt-2 mb-1 text-text-primary dark:text-text-dark-primary">{line.slice(2)}</p>);
      return;
    }

    // List items
    if (line.match(/^[-*•]\s/)) {
      nodes.push(
        <div key={key} className="flex gap-2 text-sm leading-relaxed">
          <span className="text-terracotta mt-[3px] shrink-0">•</span>
          <span>{inlineFormat(line.slice(2))}</span>
        </div>
      );
      return;
    }

    // Numbered list
    if (line.match(/^\d+\.\s/)) {
      const num = line.match(/^(\d+)\./)?.[1] ?? '';
      nodes.push(
        <div key={key} className="flex gap-2 text-sm leading-relaxed">
          <span className="text-terracotta font-bold shrink-0 min-w-[1.25rem]">{num}.</span>
          <span>{inlineFormat(line.replace(/^\d+\.\s/, ''))}</span>
        </div>
      );
      return;
    }

    // Empty line → spacer
    if (line.trim() === '') {
      nodes.push(<div key={key} className="h-2" />);
      return;
    }

    // Normal paragraph
    nodes.push(
      <p key={key} className="text-[14px] leading-[1.65] mb-2 last:mb-0 text-text-primary dark:text-text-dark-primary/90">
        {inlineFormat(line)}
      </p>
    );
  });

  return nodes;
}

/** Handle **bold**, `code`, and plain text inline. */
function inlineFormat(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[2] !== undefined) {
      parts.push(<strong key={match.index} className="font-bold">{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      parts.push(
        <code key={match.index} className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-[12px] font-mono">
          {match[3]}
        </code>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// ─── Timestamp ────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

// ─── Rate limit bar ───────────────────────────────────────────────────────────

const RateLimitBar: React.FC<{ remaining: number; max?: number }> = ({ remaining, max = 30 }) => {
  const pct = Math.max(0, (remaining / max) * 100);
  const color = remaining > 10 ? 'bg-sage' : remaining > 5 ? 'bg-amber' : 'bg-terracotta';
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="flex-1 h-1 bg-ivory-deep dark:bg-dark-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-text-muted shrink-0">{remaining}/{max} left</span>
    </div>
  );
};

// ─── Typing indicator ─────────────────────────────────────────────────────────

const TypingDots: React.FC = () => (
  <div className="flex items-center gap-1 px-1 py-0.5" aria-label="Thinking">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce"
        style={{ animationDelay: `${i * 150}ms`, animationDuration: '900ms' }}
      />
    ))}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const Planner: React.FC = () => {
  const { profile, exams, events, plannerHistory, setPlannerHistory } = useProfile();
  const [messages, setMessages] = useState<PlannerMessage[]>(plannerHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persist history
  useEffect(() => { setPlannerHistory(messages); }, [messages, setPlannerHistory]);

  // Auto-scroll on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    if (isNearBottom || loading) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Show scroll-down button when scrolled up
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  }, []);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || loading) return;
    setError(null);

    const userMsg: PlannerMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setLoading(true);

    try {
      const context = buildContext(profile, exams, events);
      const data = await sendChatMessage({
        messages: updated.map(({ role, content: c }) => ({ role, content: c })),
        context,
        ...(profile?.apiProvider && profile.apiProvider !== 'server' && profile?.apiKey
          ? { clientKey: profile.apiKey }
          : {}),
        ...(profile?.apiProvider === 'openai' ? { provider: 'openai' } : {}),
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      if (isAIError(err)) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const autoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const t = e.currentTarget;
    t.style.height = 'auto';
    t.style.height = `${Math.min(t.scrollHeight, 140)}px`;
  };

  const clearChat = () => { setMessages([]); setError(null); };

  const remaining = checkRateLimit();

  return (
    <div className="flex flex-col h-[calc(100dvh-180px)] sm:h-[calc(100dvh-140px)] max-w-3xl mx-auto animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="mb-5 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest dark:text-ivory-warm leading-tight">
              SI Planner
            </h1>
            <p className="text-text-secondary dark:text-text-dark-secondary text-sm mt-0.5">
              Synthetic Intelligence — powered by Claude.
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              title="Clear conversation"
              className="flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-terracotta transition-colors p-2 rounded-xl hover:bg-terracotta/8 mt-1 shrink-0"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
        {remaining <= 15 && <div className="mt-3"><RateLimitBar remaining={remaining} /></div>}
      </div>

      {/* ── Chat area ── */}
      {messages.length === 0 ? (

        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-forest to-forest-mid text-ivory rounded-3xl flex items-center justify-center mb-5 shadow-lg">
            <Brain size={30} />
          </div>
          <h2 className="text-xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
            What can I help with?
          </h2>
          <p className="text-text-secondary dark:text-text-dark-secondary text-sm mb-8 max-w-sm leading-relaxed">
            I know your profile, schedule, and exams. Ask me anything about your academic game plan.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.prompt)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-dark-card/60 border border-ivory-deep dark:border-dark-border/40 text-left hover:shadow-float hover:bg-white dark:hover:bg-dark-card transition-all group"
              >
                <div className="p-2 rounded-xl bg-terracotta/10 text-terracotta group-hover:bg-terracotta group-hover:text-ivory group-hover:scale-110 transition-all shrink-0 duration-300">
                  <action.icon size={15} />
                </div>
                <span className="text-sm font-semibold text-text-primary dark:text-text-dark-primary leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

      ) : (

        /* Messages */
        <div className="relative flex-1 min-h-0">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto space-y-4 pr-1 pb-2 scroll-smooth"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                {/* AI avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-gradient-to-br from-forest to-forest-mid text-ivory rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Brain size={13} />
                  </div>
                )}

                <div className="flex flex-col max-w-[82%]">
                  <div
                    className={`relative rounded-3xl px-5 py-4 shadow-sm animate-in zoom-in-95 duration-300 ${
                      msg.role === 'user'
                        ? 'bg-forest text-ivory rounded-br-sm shadow-forest/20'
                        : 'bg-white/80 dark:bg-dark-card/80 text-text-primary dark:text-text-dark-primary border border-ivory-deep dark:border-dark-border/50 rounded-bl-sm backdrop-blur-md hover:shadow-float transition-shadow duration-500'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
                    )}
                  </div>
                  <span className={`text-[10px] text-text-muted mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>

                {/* User avatar */}
                {msg.role === 'user' && (
                  <div className="w-7 h-7 bg-forest/10 dark:bg-ivory/10 text-forest dark:text-ivory rounded-xl flex items-center justify-center shrink-0 mt-1">
                    <User size={13} />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-forest to-forest-mid text-ivory rounded-xl flex items-center justify-center shrink-0">
                  <Brain size={13} />
                </div>
                <div className="bg-white/70 dark:bg-dark-card/70 rounded-2xl rounded-bl-md px-4 py-3 border border-ivory-deep dark:border-dark-border">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Scroll-to-bottom pill */}
          {showScrollDown && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs font-bold bg-forest text-ivory px-3 py-1.5 rounded-full shadow-lg animate-in fade-in duration-200 hover:bg-forest-mid transition-colors"
            >
              <ChevronDown size={13} />
              Jump to latest
            </button>
          )}
        </div>
      )}

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-start gap-3 p-3 mt-3 mb-2 bg-clay-pale dark:bg-clay-red/10 text-clay-red rounded-xl text-sm shrink-0 animate-in slide-in-from-top-2 duration-300">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="mt-4 flex gap-3 items-end bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl p-3.5 rounded-[2rem] border border-ivory-deep dark:border-dark-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 shrink-0 transform translate-y-0">
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="p-3 text-text-muted hover:text-terracotta transition-colors rounded-2xl hover:bg-terracotta/10 self-end outline-none"
            title="Clear chat"
          >
            <Trash2 size={18} />
          </button>
        )}
        <textarea
          ref={inputRef}
          id="planner-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={autoResize}
          placeholder="Ask about study plans, exams, time management…"
          rows={1}
          disabled={loading}
          className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] font-medium text-text-primary dark:text-text-dark-primary placeholder:text-text-muted/50 min-h-[44px] max-h-[140px] py-2.5 px-2 disabled:opacity-50 custom-scrollbar"
        />
        <Button
          size="lg"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="rounded-[1.25rem] px-5 self-end shrink-0 transition-transform active:scale-90 shadow-md"
          aria-label="Send message"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="translate-x-0.5" />}
        </Button>
      </div>
    </div>
  );
};
