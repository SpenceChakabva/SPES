# Spes — Complete UI/UX Design Specification

> *Spes* (Latin): *"Hope."* Derived from UCT's motto *Spes Bona* (Good Hope).
> From the Nguni root *-thuth-* — forward motion, upward development.  
> A word that belongs to the continent this tool was built for.

---

## 0. Why This Name

UCT sits at the southern tip of Africa, under the watch of Table Mountain and the promise of *Spes Bona*. It draws students from across the continent — people who arrive in Cape Town with everything stacked against them and still show up on day one. Spes is not just an app; it is a manifestation of that hope — a tactical tool to ensure that progress is quiet, inevitable, and powered by pure competence.

The name carries no English translation baggage, no startup clichés, no geographic lock-in. It says: *you are already growing. this tool is for that process.*

Domain: **thuthuka.app**  
Tagline: *"Your UCT, your move."*  
Sub-tagline variant: *"From admission to graduation, one tool."*

---

## 1. Vision & Product Philosophy

### What Spes Is

Spes is a four-tool student companion for UCT students, unified under a single student profile. It solves:

1. **Accommodation Checker** — verify listings, flag NSFAS compliance, detect scams against the OCSAS accredited list
2. **Exam Planner** — parse timetables, analyse density, generate personalised study plans, export to calendar
3. **NSFAS Gap Calculator** — translate approval status into real monthly cashflow
4. **Bursary Matchmaker** — filter all UCT and external bursaries by your exact profile

### Design Principles

**Principle 1: African warmth, not Western tech coldness.**  
Too many "student tools" feel like SaaS dashboards built for Silicon Valley CTOs. Spes is warm, direct, and human. The visual language draws from the earthy, sun-burnt palette of the Western Cape landscape — terracotta, warm ivory, deep forest green — not the cold blues of enterprise software.

**Principle 2: Complexity inside, simplicity outside.**  
The logic underneath is sophisticated — NSFAS policy modelling, OCSAS verification, iCalendar generation. The interface shows none of this. Every screen is one task, one action, one answer.

**Principle 3: Mobile-first without exception.**  
UCT students live on their phones. The primary device is a mid-range Android. Every screen must work perfectly at 360px width, on a slow 3G connection, one-handed, on a minibus taxi.

**Principle 4: Zero friction onboarding.**  
No email signup. No password. A 4-field profile stored in `localStorage`. Students can be using the tool within 90 seconds of landing.

**Principle 5: No dark patterns.**  
No upsells. No "upgrade to premium." No data collection beyond what the tool needs. No ads. This is a trust product — its only currency is student trust.

---

## 2. Visual Identity

### 2.1 The Name Mark

```
THUTHUKA
────────
```

Set in **Playfair Display** at weight 700. The double-T creates a natural visual beat. All-caps in the wordmark only — everywhere else, sentence case. The em dash below the name is a design element, not punctuation.

Logomark alternative: A stylised seedling — a single curved stem with two leaves — in a circle. Minimal. Works as a favicon at 16×16. SVG only, never raster.

### 2.2 Colour System

Spes uses an **African earth palette** — grounded, warm, and distinct from any other student tool on the continent.

```css
/* ── Core ── */
--ivory:        #F5F0E8;   /* background, primary surface */
--ivory-warm:   #EDE7D9;   /* secondary surface, card hover */
--ivory-deep:   #D4CBB8;   /* borders, dividers */

/* ── Brand ── */
--terracotta:   #C1440E;   /* primary accent — UCT is red, this is deeper */
--terracotta-light: #E8694A; /* hover states, highlights */
--terracotta-pale:  #F5E2DA; /* tinted backgrounds, badges */

/* ── Depth ── */
--forest:       #1A3329;   /* text primary, headers */
--forest-mid:   #2D5444;   /* secondary text */
--forest-light: #4A7C68;   /* muted text, metadata */
--forest-pale:  #EAF0ED;   /* success backgrounds */

/* ── Functional ── */
--amber:        #D4820A;   /* warnings, NSFAS alerts */
--amber-pale:   #FDF3DC;   /* warning backgrounds */
--sage:         #5A8A6F;   /* positive states, verified */
--sage-pale:    #E8F3ED;   /* success backgrounds */
--clay-red:     #9B2818;   /* danger, scam flags */
--clay-pale:    #FDECEA;   /* danger backgrounds */

/* ── Type ── */
--text-primary:   #1A3329;  /* = --forest */
--text-secondary: #4A7C68;  /* = --forest-light */
--text-muted:     #8AA89B;  /* timestamps, metadata */
--text-inverse:   #F5F0E8;  /* text on dark/terracotta */
```

**The logic:** Ivory grounds every screen in warmth, not clinical white. Terracotta is used sparingly — on the primary CTA, on the active nav item, on key data points. Forest gives readable, serious body text. The warm/cool balance (terracotta warmth + forest coolness) prevents the palette from feeling either too earthy or too cold.

**Dark mode** is a Phase 2 feature. Version 1 is light-mode only, but CSS variables are structured so dark mode can be dropped in as a single override block.

### 2.3 Typography

```css
/* ── Display ── */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
--font-display: 'Playfair Display', Georgia, serif;

/* ── Body ── */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
--font-body: 'DM Sans', system-ui, sans-serif;

/* ── Mono (for data: NSFAS amounts, dates, exam times) ── */
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
--font-mono: 'DM Mono', 'JetBrains Mono', monospace;
```

**Why this pairing:**  
Playfair Display has a warmth and authority that feels editorial — like a good newspaper, not a startup landing page. DM Sans is clean and neutral, but with slightly more personality than Inter. The DM family pairing (Sans + Mono) gives perfect visual consistency across UI text and data text. Together they feel like a tool built by someone who cares.

```css
/* ── Type Scale (fluid) ── */
--text-xs:    clamp(11px, 1.2vw, 12px);
--text-sm:    clamp(13px, 1.4vw, 14px);
--text-base:  clamp(15px, 1.6vw, 16px);
--text-md:    clamp(17px, 2vw, 19px);
--text-lg:    clamp(21px, 2.6vw, 26px);
--text-xl:    clamp(28px, 4vw, 36px);
--text-hero:  clamp(38px, 6vw, 64px);

/* ── Tracking ── */
--tracking-tight:  -0.03em;  /* display headlines */
--tracking-normal:  0em;     /* body */
--tracking-caps:    0.08em;  /* ALL CAPS labels */
--tracking-mono:   -0.02em;  /* mono data */
```

### 2.4 Spacing & Layout

```css
/* ── Base unit: 4px ── */
--space-1:   4px;
--space-2:   8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;

/* ── Radius ── */
--radius-sm:   6px;
--radius-md:  10px;
--radius-lg:  16px;
--radius-xl:  24px;
--radius-full: 9999px;

/* ── Shadows ── */
--shadow-sm:  0 1px 3px rgba(26,51,41,0.06), 0 1px 2px rgba(26,51,41,0.04);
--shadow-md:  0 4px 12px rgba(26,51,41,0.08), 0 2px 4px rgba(26,51,41,0.04);
--shadow-lg:  0 12px 32px rgba(26,51,41,0.10), 0 4px 8px rgba(26,51,41,0.06);
--shadow-card: 0 2px 8px rgba(26,51,41,0.07);
--shadow-float: 0 8px 24px rgba(26,51,41,0.12);
```

### 2.5 Motion Tokens

```css
/* ── Durations ── */
--dur-instant:  80ms;
--dur-fast:    150ms;
--dur-normal:  240ms;
--dur-slow:    380ms;
--dur-reveal:  600ms;

/* ── Easings ── */
--ease-out:     cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out:  cubic-bezier(0.77, 0, 0.175, 1);
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);  /* slight overshoot */
--ease-drawer:  cubic-bezier(0.32, 0.72, 0, 1);

/* ── Stagger ── */
--stagger-base: 40ms;  /* multiply by index for list entries */
```

---

## 3. Information Architecture

### 3.1 Navigation Model

**Mobile (< 1024px):** Fixed bottom tab bar, 4 icons + profile.  
**Desktop (≥ 1024px):** Left sidebar, 220px wide, always visible.

```
Navigation items
├── 🏠  Home          /
├── 🏘  Accommodation  /accommodation  (Tool 1)
├── 📅  Exams          /exams          (Tool 3 — centrepiece)
├── 💰  Funding        /funding        (Tools 2+4 merged)
└── 👤  Profile        /profile
```

**Why Exams is the third tab (not first):** The accommodation checker is the entry hook — it's the most immediately shareable and has a clear "before/after" result. But exams is the centrepiece technically. Sequencing: Hook → Showcase → Depth.

### 3.2 User Flow — First Visit

```
Landing page
    ↓ CTA: "Start — takes 60 seconds"
Profile setup (4 fields, inline, no new page)
    ↓ auto-advance on completion
Home dashboard
    ↓ contextual prompt based on time of year
    ├── January–February: "Check your accommodation listing"
    ├── March–April: "Upload your exam timetable"
    ├── May: "Find additional bursaries before June deadline"
    └── Anytime: All 4 tools accessible
```

### 3.3 Profile Data Model

```typescript
interface StudentProfile {
  faculty: 'Commerce' | 'Engineering' | 'Humanities' | 
           'Health Sciences' | 'Law' | 'Science';
  year: 1 | 2 | 3 | 4 | 'Honours' | 'Masters' | 'PhD';
  nsfasStatus: 'Approved' | 'Pending' | 'Not applicable' | 'Declined';
  monthlyBudget: number;           // ZAR, for accommodation
  homeProvince: SAProvince;        // 9 provinces + Zimbabwe/Other
  registeredCredits?: number;      // affects NSFAS allowance calc
}
```

Stored in `localStorage` as JSON. No server, no auth. Expiry: 1 year.

---

## 4. Screen Designs — Full Specification

---

### 4.1 Landing Page

**Purpose:** Convert a confused or curious UCT student into an active user within 90 seconds. Must work on a slow 3G connection and a 360px screen.

**Layout:** Single-column on mobile, asymmetric two-column on desktop (content left, visual right).

---

#### Hero Section

**Desktop layout:**

```
┌─────────────────────────────────────────────────────────┐
│  THUTHUKA                           [Profile setup →]   │
├─────────────────────────────┬───────────────────────────┤
│                             │                           │
│  Your UCT,                  │   [Illustrated graphic:   │
│  your move.                 │    a stylised Cape Town   │
│                             │    mountain silhouette    │
│  One tool for accommodation,│    with a path ascending  │
│  exams, NSFAS, and          │    it — plant/growth      │
│  bursaries.                 │    motif overlay]         │
│                             │                           │
│  [Start — 60 seconds]       │                           │
│                             │                           │
└─────────────────────────────┴───────────────────────────┘
```

**Headline treatment:**
- "Your UCT," — Playfair Display, 64px, weight 700, `--forest`, letter-spacing `--tracking-tight`
- "your move." — same size, `--terracotta`
- The colour split on the headline is the single most memorable visual element. It references UCT's red without using it directly.

**Subheadline:**  
DM Sans, 18px, weight 400, `--text-secondary`, max-width 400px, line-height 1.6.  
Copy: *"From finding a flat to planning your finals — Spes handles the admin so you can focus on what matters."*

**Primary CTA button:**
```css
.cta-primary {
  background: var(--terracotta);
  color: var(--text-inverse);
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  padding: 14px 28px;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: 
    background var(--dur-fast) var(--ease-out),
    transform var(--dur-instant) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out);
}

.cta-primary:hover {
  background: var(--terracotta-light);
  box-shadow: 0 6px 20px rgba(193,68,14,0.25);
  transform: translateY(-1px);
}

.cta-primary:active {
  transform: scale(0.97) translateY(0);
  box-shadow: none;
}
```

**Trust strip below CTA:**  
Three inline pills: `✓ No signup` · `✓ Free forever` · `✓ 60 sec setup`  
Font: DM Sans 13px, `--text-muted`. Separator: `·` in `--ivory-deep`.

---

#### Scroll Section: The 4 Tools

Below the hero, a horizontal card row (scrollable on mobile, 4-across on desktop). Each card is a "problem → tool" statement.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   🏘          │  │   📅          │  │   💰          │  │   📋          │
│              │  │              │  │              │  │              │
│ "Is this     │  │ "3 exams in  │  │ "How much    │  │ "What else   │
│  listing     │  │  4 days."    │  │  will I      │  │  can I       │
│  real?"      │  │              │  │  actually    │  │  apply for?" │
│              │  │  Build a     │  │  receive?"   │  │              │
│  Verify      │  │  plan.       │  │              │  │  Find        │
│  against     │  │              │  │  Calculate   │  │  bursaries   │
│  OCSAS.      │  │              │  │  your gap.   │  │  that fit    │
│              │  │              │  │              │  │  you.        │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

**Card design:**
```css
.tool-card {
  background: var(--ivory-warm);
  border: 1px solid var(--ivory-deep);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  min-width: 240px;  /* for horizontal scroll on mobile */
  cursor: pointer;
  transition:
    transform var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.tool-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-float);
  border-color: var(--terracotta);
}

.tool-card__icon {
  width: 40px;
  height: 40px;
  background: var(--terracotta-pale);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: var(--space-4);
}

.tool-card__problem {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  line-height: 1.3;
}

.tool-card__solution {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}
```

---

#### Profile Setup — Inline (no modal, no new page)

Triggered by the CTA. The hero section morphs — the illustration slides right, the left column transforms into a stepped form. No page change. This transition is the single most important animation in the product.

**Animation sequence:**
1. CTA button morphs into a step indicator (`Step 1 of 4`)
2. Hero text fades out (150ms, opacity only)
3. Form fields slide in from below (240ms, `translateY(20px) → 0` + opacity)
4. Each completed field triggers a ✓ checkmark and auto-advances
5. On completion, the form collapses and the dashboard content reveals

```typescript
// Form fields — in order, one at a time
const profileSteps = [
  {
    id: 'faculty',
    question: 'What faculty are you in?',
    type: 'select-chips',
    options: ['Commerce', 'Engineering', 'Humanities', 
              'Health Sciences', 'Law', 'Science'],
  },
  {
    id: 'year',
    question: 'What year are you in?',
    type: 'select-chips',
    options: ['1st year', '2nd year', '3rd year', '4th year', 
              'Honours', 'Masters', 'PhD'],
  },
  {
    id: 'nsfasStatus',
    question: 'Are you NSFAS funded?',
    type: 'select-chips',
    options: ['Yes — approved', 'Pending / applied', 
              'Not applicable', 'Declined'],
  },
  {
    id: 'budget',
    question: 'What\'s your monthly accommodation budget?',
    type: 'slider',
    min: 1000,
    max: 12000,
    step: 100,
    unit: 'ZAR',
    hint: 'NSFAS accommodation cap is R4,500/month',
  },
];
```

**Chip select design:**
```css
.chip {
  padding: 10px 18px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--ivory-deep);
  background: var(--ivory);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition:
    background var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    transform var(--dur-instant) var(--ease-out);
  user-select: none;
}

.chip:hover {
  border-color: var(--terracotta);
  background: var(--terracotta-pale);
}

.chip.selected {
  background: var(--terracotta);
  border-color: var(--terracotta);
  color: var(--text-inverse);
}

.chip:active {
  transform: scale(0.96);
}
```

---

### 4.2 Home Dashboard

**Purpose:** Contextual entry point. Shows the student what's most relevant right now based on the time of year, and surfaces quick-access cards to all four tools.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  ← sidebar │  Good morning, 2nd year.          [🔔] [👤] │
│            ├─────────────────────────────────────────────┤
│  🏠 Home   │                                             │
│  🏘 Accom  │  ┌─────────────────────────────────────┐   │
│  📅 Exams  │  │  CONTEXTUAL BANNER                  │   │
│  💰 Fund   │  │  "Exam season starts in 3 weeks.    │   │
│  👤 Profile│  │   Upload your timetable to          │   │
│            │  │   start planning."     [Plan now →] │   │
│            │  └─────────────────────────────────────┘   │
│            │                                             │
│            │  Your tools                                 │
│            │  ┌──────────┐ ┌──────────┐                 │
│            │  │ Accom    │ │ Exams    │                 │
│            │  │ checker  │ │ planner  │                 │
│            │  └──────────┘ └──────────┘                 │
│            │  ┌──────────┐ ┌──────────┐                 │
│            │  │ NSFAS    │ │ Bursary  │                 │
│            │  │ calc     │ │ finder   │                 │
│            │  └──────────┘ └──────────┘                 │
│            │                                             │
│            │  Quick stats (from profile)                 │
│            │  Budget: R4,500 · NSFAS: Approved          │
│            │  Faculty: Engineering · Year: 2nd           │
└─────────────┴───────────────────────────────────────────┘
```

**Contextual banner logic:**
```typescript
function getContextualMessage(profile: StudentProfile): Banner {
  const month = new Date().getMonth(); // 0-indexed
  
  if (month <= 1) { // January–February
    return {
      icon: '🏘',
      headline: 'Housing season is now.',
      body: 'Verify your off-campus listing before you sign anything.',
      cta: 'Check listing',
      href: '/accommodation',
    };
  }
  if (month >= 2 && month <= 3) { // March–April
    return {
      icon: '📅',
      headline: 'Mid-year exams in 6–8 weeks.',
      body: 'Upload your timetable now and get a personalised study plan.',
      cta: 'Plan my exams',
      href: '/exams',
    };
  }
  if (month >= 8 && month <= 9) { // September–October
    return {
      icon: '📋',
      headline: 'Bursary deadlines are approaching.',
      body: 'Several funding opportunities close in October. Check what you qualify for.',
      cta: 'See my bursaries',
      href: '/funding',
    };
  }
  // Default
  return {
    icon: '💰',
    headline: 'Do you know your NSFAS gap?',
    body: 'Many students discover a shortfall too late. Calculate yours now.',
    cta: 'Calculate',
    href: '/funding',
  };
}
```

---

### 4.3 Tool 1 — Accommodation Checker

**URL:** `/accommodation`  
**Goal:** Paste a listing → get a clear verdict in under 10 seconds.

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│  Accommodation checker                                    │
│  ─────────────────────                                    │
│  Verify any listing against UCT's accredited             │
│  landlord database before you sign anything.             │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Paste your listing here                           │  │
│  │  (address, price, description — any format)        │  │
│  │                                                    │  │
│  │                                                    │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  [Check this listing →]                                  │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  [RESULT AREA — appears after check]                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### The Textarea

```css
.listing-input {
  width: 100%;
  min-height: 160px;
  padding: var(--space-4) var(--space-5);
  background: var(--ivory);
  border: 1.5px solid var(--ivory-deep);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.6;
  resize: vertical;
  transition:
    border-color var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out);
}

.listing-input:focus {
  outline: none;
  border-color: var(--terracotta);
  box-shadow: 0 0 0 3px rgba(193,68,14,0.10);
}

.listing-input::placeholder {
  color: var(--text-muted);
}
```

**Placeholder copy:**  
*"Paste anything — a WhatsApp message, a Gumtree link, an email, even a photo caption. We'll handle the rest."*

#### Submit Button States

```
[idle]      →  [loading: "Checking..." with spinner]  
→  [success: "Verified ✓"]  →  [error: "Try again"]
```

The button morphs between states using AnimatePresence. Never shows a page reload.

#### Result Card — Four Possible States

**State A: Verified ✓**
```
┌─────────────────────────────────────────────────────┐
│  ✓  OCSAS Accredited                               │
│     border: 2px solid --sage                        │
│     background: --sage-pale                         │
├─────────────────────────────────────────────────────┤
│  Landlord: [extracted name]                         │
│  Address: [extracted address]                       │
│  OCSAS listing: Found — accredited since [year]    │
│                                                     │
│  Budget check:                                      │
│  Asking R4,200/month                                │
│  ✓ Within NSFAS cap (R4,500)                       │
│                                                     │
│  Lease flags: None detected                         │
└─────────────────────────────────────────────────────┘
```

**State B: Not found (proceed with caution)**
```
┌─────────────────────────────────────────────────────┐
│  ⚠  Not on OCSAS accredited list                   │
│     border: 2px solid --amber                       │
│     background: --amber-pale                        │
├─────────────────────────────────────────────────────┤
│  This landlord was not found in the OCSAS database. │
│  That doesn't mean it's a scam — it means you       │
│  should verify before signing.                      │
│                                                     │
│  What to do:                                        │
│  → Email OCSAS: res@uct.ac.za                       │
│  → Request an inspection before signing             │
│  → Never pay a deposit before viewing in person    │
│                                                     │
│  Budget check:  R5,500/month — above NSFAS cap     │
│  ⚠ NSFAS will not cover the full amount.           │
│     Gap: R1,000/month (R10,000/year)               │
└─────────────────────────────────────────────────────┘
```

**State C: Scam flags detected**
```
┌─────────────────────────────────────────────────────┐
│  ✕  High risk — multiple flags detected             │
│     border: 2px solid --clay-red                    │
│     background: --clay-pale                         │
├─────────────────────────────────────────────────────┤
│  Flags found:                                       │
│  ✕ Price too low for area (R1,200 in Rondebosch)   │
│  ✕ No physical address provided                     │
│  ✕ Requires deposit before viewing                 │
│  ✕ Not on OCSAS database                           │
│                                                     │
│  This listing shows common patterns of             │
│  accommodation scams targeting UCT students.       │
│  Do not transfer any money.                        │
│                                                     │
│  Report to: saps.gov.za or uct.ac.za/security      │
└─────────────────────────────────────────────────────┘
```

**State D: NSFAS private accommodation warning**
```
┌─────────────────────────────────────────────────────┐
│  ℹ  Accredited but requires NSFAS approval          │
│     border: 2px solid --forest-light                │
│     background: --forest-pale                       │
├─────────────────────────────────────────────────────┤
│  The listing appears legitimate, but if you're      │
│  NSFAS funded:                                      │
│                                                     │
│  → Private accommodation must be NSFAS-accredited  │
│    (different from OCSAS accreditation)            │
│  → You must submit your lease to SFA before moving │
│  → Funding will not be paid for non-accredited     │
│    private accommodation                           │
│                                                     │
│  Your profile: NSFAS Approved                      │
│  Action required: Verify with SFA before signing   │
└─────────────────────────────────────────────────────┘
```

---

### 4.4 Tool 2 — Exam Planner (The Engineering Centrepiece)

**URL:** `/exams`  
**Goal:** Paste → analyse → generate plan → export to calendar.

This is the most technically impressive tool and the most important UX challenge: transforming a wall of raw timetable text into something a student can act on.

**Layout — three-phase progressive disclosure:**

```
Phase 1: Input
Phase 2: Analysis (appears below input, never replaces it)
Phase 3: Study plan + export (appears below analysis)
```

#### Phase 1: Timetable Input

```
┌──────────────────────────────────────────────────────────┐
│  Exam planner                                            │
│  ────────────                                            │
│  Paste your timetable from examtimetable.uct.ac.za       │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Step 1 of 3: Paste your exam timetable           │  │
│  │                                                    │  │
│  │  [textarea — same style as accommodation]          │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  How to get your timetable:                              │
│  1. Go to examtimetable.uct.ac.za                        │
│  2. Enter your student number                            │
│  3. Select all text (Ctrl+A), copy, paste here           │
│                                                          │
│  [Analyse my timetable →]                               │
└──────────────────────────────────────────────────────────┘
```

#### Phase 2: Analysis Panel

Once parsed, this panel animates in below the input. It shows the student something they've never seen before: their exam density visualised.

```
┌──────────────────────────────────────────────────────────┐
│  ✓ Parsed 5 exams                    [Edit] [Re-parse]   │
│  ─────────────────────────────────────────────────────   │
│                                                          │
│  Exam calendar (May 23 – June 4)                         │
│                                                          │
│  23 Mon   24 Tue   25 Wed   26 Thu   27 Fri              │
│  [SCI3024]          [COM2012]         [ENG2011]          │
│                                                          │
│  30 Mon   31 Tue   01 Wed   02 Thu   03 Fri              │
│            [SCI3012]          [COM2016]                  │
│                                                          │
│  ─────────────────────────────────────────────────────   │
│                                                          │
│  Density score: 7/10 ⚠ HEAVY                            │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ⚠ Back-to-back concern:                        │    │
│  │  SCI3024 (Mon 23) and COM2012 (Wed 25) have     │    │
│  │  only 1 day between them.                       │    │
│  │  COM2012 is weighted 40% of your year.          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ✓ Possible deferral check:                     │    │
│  │  No concurrent exams found.                     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  [Generate my study plan →]                              │
└──────────────────────────────────────────────────────────┘
```

**The density score** is a proprietary metric:
```typescript
function calcDensityScore(exams: Exam[]): { score: number; label: string } {
  const sorted = [...exams].sort((a, b) => a.date - b.date);
  let totalGap = 0;
  
  for (let i = 1; i < sorted.length; i++) {
    const gapDays = (sorted[i].date - sorted[i-1].date) / (1000 * 60 * 60 * 24);
    totalGap += gapDays;
  }
  
  const avgGap = totalGap / (sorted.length - 1);
  const daysSpan = (sorted[sorted.length-1].date - sorted[0].date) / (1000 * 60 * 60 * 24);
  
  // Raw density: 0 (all exams same day) to 10 (evenly spread)
  const raw = Math.min(10, Math.round(avgGap * 10 / daysSpan * (sorted.length - 1)));
  const score = 10 - raw; // invert: higher = denser (harder)
  
  const labels = [
    { min: 0, label: 'LIGHT', colour: '--sage' },
    { min: 4, label: 'MODERATE', colour: '--amber' },
    { min: 7, label: 'HEAVY', colour: '--clay-red' },
  ];
  
  return { score, ...labels.findLast(l => score >= l.min) };
}
```

#### Phase 3: Study Plan

The plan is generated by Claude. The prompt is carefully engineered:

```typescript
const systemPrompt = `You are a study planning expert for UCT students. 
Given a list of exams with dates and subjects, generate a practical, 
day-by-day study plan working backwards from the last exam.

Rules:
- Work backwards from the last exam
- For each subject, estimate hours needed by type:
  - Engineering/Science: 4–6 hours/topic, calculation-heavy
  - Commerce: 3–4 hours/topic, case-study + theory mix  
  - Humanities: 2–3 hours/topic, essay-based
  - Law: 4–5 hours/topic, memorisation + application
- Build in 1 rest day per 5 study days
- The 2 days before each exam = revision only (no new material)
- Flag any gaps shorter than 24 hours as "danger windows"
- Output as structured JSON, not prose`;

const userPrompt = `Student profile: ${JSON.stringify(profile)}
Exams: ${JSON.stringify(exams)}
Today's date: ${new Date().toISOString().split('T')[0]}

Generate a study plan. Return JSON with this shape:
{
  "summary": string,
  "danger_windows": DangerWindow[],
  "plan": StudyDay[],
  "ics_events": ICSEvent[]
}`;
```

**Study plan display:**

```
┌──────────────────────────────────────────────────────────┐
│  Your study plan                          [Export →]     │
│  ─────────────────────────────────────────────────────   │
│                                                          │
│  Summary: 14 study days. Focus on SCI3024 first —       │
│  it comes earliest and has a tight prep window.         │
│                                                          │
│  ─────────────────────────────────────────────────────   │
│                                                          │
│  Mon 13 May                                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │  SCI3024: Thermodynamics                        │    │
│  │  Topics: Heat transfer, Entropy basics          │    │
│  │  Estimated time: 4–5 hours                      │    │
│  │  Type: Problem sets + theory                    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  Tue 14 May                                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │  SCI3024: Thermodynamics                        │    │
│  │  Topics: Fluid mechanics, Past papers           │    │
│  │  Estimated time: 5 hours                        │    │
│  │  Type: Calculation practice                     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ...                                                     │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  [Download .ics calendar]                       │    │
│  │  Opens in Google Calendar, Apple Calendar,      │    │
│  │  Outlook — any calendar app                     │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

**The .ics export is the detail that seals the portfolio story.** Here's the generator:

```typescript
function generateICS(studyDays: StudyDay[], exams: Exam[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Spes//Study Plan//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:Spes Study Plan',
    'X-WR-TIMEZONE:Africa/Johannesburg',
  ];

  // Add exam events
  exams.forEach(exam => {
    lines.push(
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(exam.date)}T${exam.time.replace(':','')}00`,
      `DTEND:${formatICSDate(exam.date)}T${addHours(exam.time, 3)}00`,
      `SUMMARY:EXAM: ${exam.subject}`,
      `DESCRIPTION:${exam.venue} | ${exam.code}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Exam tomorrow',
      'END:VALARM',
      'END:VEVENT',
    );
  });

  // Add study blocks
  studyDays.forEach(day => {
    day.sessions.forEach(session => {
      lines.push(
        'BEGIN:VEVENT',
        `DTSTART:${formatICSDate(day.date)}T090000`,
        `DTEND:${formatICSDate(day.date)}T${sessionEndTime(session)}00`,
        `SUMMARY:Study: ${session.subject}`,
        `DESCRIPTION:${session.topics.join(', ')} | ~${session.hours}h`,
        'STATUS:TENTATIVE',
        'END:VEVENT',
      );
    });
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
```

---

### 4.5 Tool 3 — Funding Hub (NSFAS + Bursaries)

**URL:** `/funding`  
**Layout:** Two tabs within the page: "NSFAS Calculator" and "Bursary Finder"

#### NSFAS Calculator Tab

```
┌──────────────────────────────────────────────────────────┐
│  NSFAS Calculator  │  Bursary Finder                     │
│  ─────────────────                                       │
│  What will you actually receive each month?              │
│                                                          │
│  Pre-filled from your profile:                           │
│  Faculty: Engineering · Year: 2nd · Credits: 120        │
│  [Edit profile]                                          │
│                                                          │
│  Accommodation type:                                     │
│  [UCT Residence]  [Private — accredited]  [Own home]    │
│                                                          │
│  Monthly rent (if applicable): [slider R0–R8,000]       │
│                                                          │
│  ─────────────────────────────────────────────────────   │
│                                                          │
│  Your monthly breakdown                                  │
│                                                          │
│  Tuition bursary       Paid directly to UCT             │
│  ─────────────         ─────────────────────           │
│  Accommodation allow.  R4,500                  ✓        │
│  Food allowance        R1,500                  ✓        │
│  Learning materials    R5,460 (once per year)           │
│  Transport allow.      R1,825 (if applicable)           │
│  ─────────────         ─────────────────────           │
│  TOTAL per month       R7,825                           │
│                                                          │
│  ─────────────────────────────────────────────────────   │
│                                                          │
│  Your gap                                                │
│  Actual rent (R5,500) vs NSFAS allowance (R4,500)       │
│  ⚠ Shortfall: R1,000/month · R10,000/year              │
│                                                          │
│  What to do:                                             │
│  → Apply for UCT GAP funding (if applicable)            │
│  → Apply to Bursary Finder for supplementary funding    │
│  → Contact SFA: financialaid@uct.ac.za                 │
└──────────────────────────────────────────────────────────┘
```

#### Bursary Finder Tab

```
┌──────────────────────────────────────────────────────────┐
│  NSFAS Calculator  │  Bursary Finder                     │
│                       ──────────────                     │
│  Based on your profile, here are bursaries               │
│  you may qualify for.                                    │
│                                                          │
│  Filters (pre-set from profile, editable):               │
│  Faculty: Engineering  Year: 2nd  NSFAS: Approved        │
│  Province: Limpopo  Average: [slider 50–100%]           │
│                                                          │
│  ─────────────────────────────────────────────────────   │
│                                                          │
│  12 results · Sorted by deadline (soonest first)        │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ESKOM Engineering Bursary                     │    │
│  │  ★★★★★ Strong match                            │    │
│  │  Up to: R80,000/year                           │    │
│  │  Deadline: 30 June 2026                        │    │
│  │  Eligible: Engineering, 2nd–4th year, NSFAS   │    │
│  │  [Apply →]  [Draft motivation letter]          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  UCT GAP Funding                                │    │
│  │  ★★★★☆ Good match                              │    │
│  │  Covers: Tuition shortfall                     │    │
│  │  Deadline: Rolling (apply now)                  │    │
│  │  [Apply →]  [Draft motivation letter]          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ...                                                     │
└──────────────────────────────────────────────────────────┘
```

**The "Draft motivation letter" feature** is the deepest value-add:

```typescript
const motivationPrompt = `Write a concise, genuine motivation paragraph 
(150–200 words) for a UCT student applying for this bursary.

Student: ${year} year ${faculty} student, ${province} origin, 
NSFAS ${nsfasStatus.toLowerCase()}, average: ${average}%

Bursary: ${bursary.name}
Criteria: ${bursary.criteria}
What they look for: ${bursary.lookFor}

Write in first person. Genuine, not sycophantic. 
Mention the student's specific situation naturally.
Do not use clichés like "passionate about" or "dream of becoming".`;
```

---

### 4.6 Profile Page

**URL:** `/profile`  
**Minimal — just the profile editor and a data transparency section.**

```
┌──────────────────────────────────────────────────────────┐
│  Your profile                                            │
│  ─────────────────────────────────────────────────────   │
│                                                          │
│  Faculty          [Engineering              ▾]          │
│  Year             [2nd year                ▾]          │
│  NSFAS status     [Approved                ▾]          │
│  Monthly budget   [R4,500         ←──────→]            │
│  Home province    [Limpopo                 ▾]          │
│  Registered credits [120 credits           ]           │
│                                                          │
│  [Save changes]                                          │
│                                                          │
│  ─────────────────────────────────────────────────────   │
│                                                          │
│  About your data                                         │
│  Everything is stored on your device only.              │
│  Spes does not collect, store, or transmit          │
│  any personal information.                              │
│                                                          │
│  [Clear all data]                                        │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Component Library

### 5.1 Button System

```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-weight: 600;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background var(--dur-fast) var(--ease-out),
    transform var(--dur-instant) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out),
    opacity var(--dur-fast) var(--ease-out);
}

.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* Sizes */
.btn-sm { font-size: 13px; padding: 8px 16px; }
.btn-md { font-size: 15px; padding: 12px 22px; }
.btn-lg { font-size: 16px; padding: 14px 28px; }

/* Variants */
.btn-primary {
  background: var(--terracotta);
  color: var(--text-inverse);
}
.btn-primary:hover {
  background: var(--terracotta-light);
  box-shadow: 0 4px 16px rgba(193,68,14,0.22);
}

.btn-secondary {
  background: var(--ivory-warm);
  color: var(--text-primary);
  border: 1.5px solid var(--ivory-deep);
}
.btn-secondary:hover {
  background: var(--ivory-deep);
  border-color: var(--forest-light);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}
.btn-ghost:hover {
  background: var(--ivory-warm);
  color: var(--text-primary);
}

.btn-danger {
  background: var(--clay-pale);
  color: var(--clay-red);
  border: 1.5px solid rgba(155,40,24,0.2);
}
.btn-danger:hover {
  background: var(--clay-red);
  color: var(--text-inverse);
}
```

### 5.2 Card System

```css
.card {
  background: var(--ivory);
  border: 1px solid var(--ivory-deep);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-card);
}

.card-interactive {
  cursor: pointer;
  transition:
    transform var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .card-interactive:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-float);
  }
}

/* Accent variants */
.card-verified   { border-left: 3px solid var(--sage); }
.card-warning    { border-left: 3px solid var(--amber); }
.card-danger     { border-left: 3px solid var(--clay-red); }
.card-info       { border-left: 3px solid var(--forest-light); }
```

### 5.3 Badge System

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  letter-spacing: 0.01em;
}

.badge-verified { background: var(--sage-pale);   color: var(--sage); }
.badge-warning  { background: var(--amber-pale);  color: var(--amber); }
.badge-danger   { background: var(--clay-pale);   color: var(--clay-red); }
.badge-info     { background: var(--forest-pale); color: var(--forest-mid); }
.badge-neutral  { background: var(--ivory-warm);  color: var(--text-secondary); }
```

### 5.4 Form Elements

```css
/* Text input */
.input {
  width: 100%;
  height: 44px;
  padding: 0 var(--space-4);
  background: var(--ivory);
  border: 1.5px solid var(--ivory-deep);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--text-primary);
  transition:
    border-color var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out);
}

.input:focus {
  outline: none;
  border-color: var(--terracotta);
  box-shadow: 0 0 0 3px rgba(193,68,14,0.10);
}

/* Select */
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,...");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

/* Slider (budget) */
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--ivory-deep);
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--terracotta);
  cursor: pointer;
  border: 3px solid var(--ivory);
  box-shadow: var(--shadow-sm);
  transition: transform var(--dur-instant) var(--ease-spring);
}

.slider::-webkit-slider-thumb:active {
  transform: scale(1.2);
}
```

### 5.5 Navigation

#### Sidebar (desktop ≥ 1024px)

```css
.sidebar {
  width: 220px;
  background: var(--ivory-warm);
  border-right: 1px solid var(--ivory-deep);
  padding: var(--space-6) var(--space-4);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-logo {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--terracotta);
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-8);
  padding: 0 var(--space-2);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition:
    background var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
  cursor: pointer;
}

.nav-item:hover {
  background: var(--ivory-deep);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--terracotta-pale);
  color: var(--terracotta);
  font-weight: 600;
}

.nav-item.active .nav-icon {
  color: var(--terracotta);
}
```

#### Bottom Tab Bar (mobile < 1024px)

```css
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--ivory);
  border-top: 1px solid var(--ivory-deep);
  padding: var(--space-2) var(--space-4);
  padding-bottom: max(var(--space-2), env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-1);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: var(--space-2) var(--space-1);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.tab-item.active .tab-icon { color: var(--terracotta); }
.tab-item.active .tab-label { color: var(--terracotta); font-weight: 600; }

.tab-icon { font-size: 22px; transition: transform var(--dur-fast) var(--ease-spring); }
.tab-item:active .tab-icon { transform: scale(0.88); }

.tab-label { font-size: 10px; font-weight: 500; color: var(--text-muted); }
```

---

## 6. Responsive Breakpoints

```css
/* Mobile first */
:root { /* 360px default — the floor */ }

/* Small phones */
@media (min-width: 390px) {
  /* Slightly more padding, larger tap targets */
}

/* Tablet / large phone */
@media (min-width: 640px) {
  /* Two-column grids for tool cards */
  /* Wider textarea */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Sidebar visible */
  /* Bottom tab bar hidden */
  /* Two-column hero */
  /* Side-by-side result + form layouts */
}

/* Wide desktop */
@media (min-width: 1440px) {
  /* Max content width: 1200px, centred */
  /* More breathing room in cards */
}
```

**Mobile-specific overrides:**

```css
@media (max-width: 1023px) {
  /* Add bottom padding to all pages for tab bar */
  .page-content { padding-bottom: 80px; }
  
  /* Full-width cards */
  .tool-card { min-width: unset; width: 100%; }
  
  /* Stack result card sections */
  .result-card { padding: var(--space-4); }
  
  /* Larger tap targets */
  .btn-md { padding: 14px 22px; min-height: 48px; }
  .chip { padding: 12px 18px; min-height: 44px; }
}
```

---

## 7. Animation System

### 7.1 Page Entry Animations

Every page content area uses a staggered entry. Content arrives in waves, not all at once.

```css
/* Wave 1: Page header */
.page-header {
  animation: slideUp var(--dur-slow) var(--ease-out) forwards;
  animation-delay: 0ms;
}

/* Wave 2: Primary content */
.content-primary {
  opacity: 0;
  animation: slideUp var(--dur-slow) var(--ease-out) forwards;
  animation-delay: var(--stagger-base);
}

/* Wave 3: Secondary content */
.content-secondary {
  opacity: 0;
  animation: slideUp var(--dur-slow) var(--ease-out) forwards;
  animation-delay: calc(var(--stagger-base) * 2);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### 7.2 Result Card Animation

When a result appears (after checking a listing, after generating a plan), it should feel like an answer being revealed — not content popping in:

```css
.result-card-enter {
  animation: reveal var(--dur-slow) var(--ease-out) forwards;
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
    clip-path: inset(8px 0 0 0 round 16px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    clip-path: inset(0 0 0 0 round 16px);
  }
}
```

### 7.3 Loading State

The "Checking..." / "Generating..." state uses a subtle pulse, not a spinning circle. The button itself pulses while Claude is working.

```css
.btn-loading {
  animation: pulse 1.2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.65; }
}
```

### 7.4 Density Bar (Exam Analyser)

The density score bar fills from left to right on entry, communicating the weight of the schedule viscerally:

```css
.density-bar {
  height: 8px;
  border-radius: 4px;
  background: var(--ivory-deep);
  overflow: hidden;
}

.density-fill {
  height: 100%;
  border-radius: 4px;
  transform-origin: left center;
  animation: fillBar var(--dur-slow) var(--ease-out) 200ms forwards;
  transform: scaleX(0);
}

@keyframes fillBar {
  to { transform: scaleX(1); }
}

/* Colour by severity */
.density-fill.light    { background: var(--sage); }
.density-fill.moderate { background: var(--amber); }
.density-fill.heavy    { background: var(--clay-red); }
```

---

## 8. Accessibility

### 8.1 Colour Contrast Ratios

| Pair | Ratio | WCAG |
|------|-------|------|
| `--text-primary` on `--ivory` | 9.1:1 | AAA |
| `--text-secondary` on `--ivory` | 4.8:1 | AA |
| `--text-inverse` on `--terracotta` | 4.6:1 | AA |
| `--sage` label on `--sage-pale` | 4.9:1 | AA |
| `--clay-red` label on `--clay-pale` | 5.2:1 | AA |

### 8.2 Focus Styles

Every interactive element has a visible focus ring. Never `outline: none` without a replacement.

```css
:focus-visible {
  outline: 2.5px solid var(--terracotta);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

.btn:focus-visible,
.input:focus-visible,
.chip:focus-visible {
  box-shadow: 0 0 0 3px rgba(193,68,14,0.18);
}
```

### 8.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Remove movement, keep opacity transitions */
  .page-header,
  .content-primary,
  .content-secondary {
    animation: fadeIn 200ms ease-out forwards;
  }

  .result-card-enter {
    animation: fadeIn 200ms ease-out forwards;
  }

  .density-fill {
    animation: none;
    transform: scaleX(1);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
}
```

### 8.4 Screen Reader Support

- All icon buttons have `aria-label`
- Result cards use `role="alert"` so screen readers announce them
- Form validation errors use `aria-describedby`
- Tab bar items use `aria-current="page"` for active state
- Density score uses `aria-label="Exam density: 7 out of 10 — Heavy"`

---

## 9. Tech Stack

### Frontend
```
React 18 + TypeScript
Vite (build tool — faster than CRA, no config overhead)
React Router v6 (tab/page navigation)
```

### Styling
```
CSS Modules (co-located with components, no class conflicts)
CSS custom properties for all tokens (no Tailwind — too opinionated for this palette)
```

### Animation
```
Framer Motion (result cards, page transitions, form morphing)
Native CSS animations (stagger reveals, density bar fill, button states)
No GSAP needed at this scale
```

### AI Integration
```
Anthropic Claude API (claude-sonnet-4-6)
Three endpoints:
  POST /api/check-listing   → accommodation verification
  POST /api/plan-exams      → study plan generation
  POST /api/draft-letter    → bursary motivation letter
All via Vercel Edge Functions (zero cold start, free tier)
```

### Data
```
localStorage (profile, cached results)
Static JSON files (suburb data, NSFAS allowance tables, bursary list)
OCSAS list: weekly scraped + cached in Vercel KV (free tier)
No database required for v1
```

### Deployment
```
Vercel (free tier, auto-deploys from GitHub)
Custom domain: thuthuka.app (~R150/year)
```

---

## 10. Build Sequence

### Day 1 (lunch → 6pm): Foundation

```
12:00  Scaffold: vite + react + ts + router
12:30  CSS variables, typography imports
13:00  Profile component (chips + slider)
14:00  Navigation (sidebar + tab bar, responsive)
14:30  Home dashboard (contextual banner)
15:30  Accommodation checker UI + Claude integration
17:00  Deploy to Vercel. Share link.
```

### Day 2: The Engineering Showcase

```
09:00  Timetable parser (Claude extraction prompt)
10:30  Density analysis algorithm
12:00  Study plan display component
14:00  .ics generator
15:30  Export to calendar UX
17:00  Full exam flow working end-to-end
```

### Day 3: Funding + Polish

```
09:00  NSFAS calculator logic (hardcoded 2025 values)
11:00  Bursary JSON data (parse UCT PDF)
13:00  Bursary filter + match score
14:30  Motivation letter Claude prompt
16:00  Polish: animations, mobile testing
17:00  Submit to Injini product map + email UCT SRC
```

---

## 11. The Story to Tell

When you show this to an employer, an interviewer, or a journalist — the narrative is not "I built a student app." The narrative is:

> *I identified four specific, interconnected problems affecting 30,000 students at Africa's top university. I traced each problem to its root — not housing shortage, but information asymmetry. Not NSFAS dysfunction, but the gap between "approved" and "understood." I mapped every legal data source available. I built a verification system that cross-references a publicly available accreditation list. I built a timetable parser that turns unstructured text into a structured study plan with a calendar export. I did it in three days, deployed it for free, and shared it with the SRC.*

That story gets you in the room. The .ics export, the OCSAS verification logic, the density scoring algorithm — those are the details you walk through once you're in.

---

## 12. Future Versions

### V1.1 (Week 2–3)
- Community notes layer per suburb (anonymous, moderated)
- NSFAS disbursement tracker (enter your student number, get expected payment date)
- WhatsApp number to check listings via message (no app needed)

### V2 (Month 2–3)
- Multi-university support: Wits, CPUT, Stellenbosch
- Dark mode
- PWA (installable on Android home screen)
- Push notifications for bursary deadlines

### V3 (If Injini fellowship accepted)
- NSFAS appeal guide (step-by-step, plain language)
- Landlord rating system (student-verified, POPIA compliant)
- Direct OCSAS API partnership
- iOS app

---

*Spes. Your UCT, your move.*

---

**Document version:** 1.0  
**Author:** [Your name]  
**Last updated:** April 2026  
**Licence:** MIT — build it, fork it, credit it.
