# Thuthuka — Tactical UCT Infrastructure

Privacy-first academic engine for high-performance UCT students. Manage your schedule, notes, exams, funding, and study plans with zero server-side tracking.
# Spes — Tactical UCT Infrastructure

Spes is a high-performance student companion designed specifically for the University of Cape Town (UCT) environment. It handles the administrative friction of student life—from verifying NSFAS-compliant accommodation to generating tactical exam study plans—all while keeping your data strictly local and private.

## ── Tactical Pillars

1.  **Accommodation Checker**: Verify property listings against the UCT OCSAS accredited list and NSFAS price caps.
2.  **Exam Planner**: Parse your timetable, analyze study density, and generate a 1-click syncable iCalendar schedule.
3.  **SI Planner**: A locally-aware Synthetic Intelligence that understands your degree context and provides tactical advice.
4.  **Sovereignty**: Zero tracking. Zero clouds. Your data stays in your browser's encrypted sandbox.

## ── Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Vanilla CSS (Tactical Design System)
- **Animations**: GSAP + Framer Motion
- **AI Engine**: Anthropic Claude (via secure local proxy)
- **Storage**: Local-first encrypted persistence

## ── Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/your-username/spes.git
cd spes
```

### 2. Setup Environment
Create a `.env` file in the root:
```env
ANTHROPIC_API_KEY=your_key_here
```

### 3. Install & Run
```bash
npm install
npm run dev
```

## ── Philosophy

University admin is a black hole. **Spes** is the bridge. Built for students who value speed, privacy, and sub-second execution.

---
*Spes. Your UCT, your move.*

The AI Planner works without a key — it will show a helpful error message prompting configuration.

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add the environment variable `ANTHROPIC_API_KEY` in the Vercel dashboard (Settings > Environment Variables)
4. Deploy

The `vercel.json` handles SPA routing and API function routing automatically.

## Architecture

```
src/
  lib/
    crypto.ts     # AES-256-GCM encryption engine (Web Crypto API)
    store.ts      # React state management + encrypted persistence
    ai.ts         # Claude API client helper
  pages/
    Landing.tsx   # Onboarding wizard
    Home.tsx      # Dashboard with contextual banners
    Planner.tsx   # AI study planner (chat interface)
    Calendar.tsx  # Timetable manager
    Exams.tsx     # Exam planner
    Notes.tsx     # Scratchpad
    Funding.tsx   # NSFAS calculator + bursary finder
    Accommodation.tsx  # Housing verification
    Profile.tsx   # Profile + data management
    About.tsx     # Feature overview
    Privacy.tsx   # Data sovereignty page
  components/
    layout/       # Sidebar, BottomTabBar, Layout
    ui/           # Button, Card, Input, Select, etc.
api/
  chat.ts         # Vercel serverless function (Claude API proxy)
```

## Security Model

- **Encryption at rest**: All student data is encrypted with AES-256-GCM before being written to localStorage. The encryption key is derived via PBKDF2 (100,000 iterations) from a per-device random salt.
- **No server storage**: Zero data is sent to any server. The only outbound call is the AI chat, which sends the current conversation + anonymised profile context to the Claude API.
- **No tracking**: No analytics, no cookies, no fingerprinting.
- **Data sovereignty**: Users can export, import, or permanently delete all their data at any time.

## License

MIT
