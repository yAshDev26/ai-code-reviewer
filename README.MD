# AI Code Reviewer

> Instant AI-powered code analysis — review, fix, and execute code in your browser.

**Live Demo → [yashdev-code-reviewer.vercel.app](https://yashdev-code-reviewer.vercel.app)**

---

## What it does

AI Code Reviewer analyses your code using a **4-agent AI pipeline** powered by Groq's `llama-3.3-70b-versatile` model. Each agent specialises in a different quality dimension — security, performance, best practices, and code style — and a synthesizer agent merges and deduplicates the results into a final scored review.

| Feature | Description |
|---|---|
| **Single file review** | Paste or upload code, get a 1–10 quality score with categorised issues |
| **Auto fix** | One click rewrites your code fixing all detected issues |
| **Code execution** | Run code in an isolated E2B cloud sandbox with optional stdin |
| **Run & Review** | Execute and review in a single request — runtime bugs caught alongside static issues |
| **Project review** | Upload up to 5 files for cross-file architectural analysis |
| **GitHub review** | Paste a public repo URL — top 5 files fetched and reviewed automatically |

---

## Tech stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework, dynamic SSR |
| React 19 | UI components |
| TypeScript 5 | Type safety throughout |
| Tailwind CSS v4 | Styling with CSS variable theming |
| Monaco Editor | VS Code-grade embedded code editor |
| shadcn/ui + Radix | Accessible component primitives |
| Vercel | Deployment — auto-deploy on push |

### Backend
| Technology | Purpose |
|---|---|
| NestJS 11 | Modular Node.js REST API framework |
| TypeScript 5 | Strict types, Zod runtime validation |
| Groq SDK | LLM provider — llama-3.3-70b-versatile |
| E2B SDK | Ephemeral cloud sandboxes for code execution |
| Zod | Runtime AI response shape validation |
| class-validator | DTO validation via decorators |
| @nestjs/throttler | Per-route rate limiting |
| Render | Deployment — Node.js hosting |

---

## Architecture

```
Browser (Next.js)
    │
    │  HTTP / REST
    ▼
NestJS API (Render)
    │
    ├── ReviewModule
    │     └── AgentOrchestratorService
    │           ├── Security agent      ─┐
    │           ├── Performance agent    ├── parallel (Promise.allSettled)
    │           ├── Best practices agent ┤
    │           └── Code style agent    ─┘
    │                 └── Synthesizer agent → ReviewResponse
    │
    ├── ProjectModule
    │     ├── ProjectReviewService (per-file + cross-file analysis)
    │     └── GithubFetcherService (GitHub REST API walker)
    │
    └── ExecutionModule
          └── E2BService (ephemeral sandbox — create → run → kill)
```

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com) (free)
- An [E2B API key](https://e2b.dev) (free — required for code execution only)

### Clone the repo

```bash
git clone https://github.com/yAshDev26/ai-code-reviewer.git
cd ai-code-reviewer
```

### Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
E2B_API_KEY=your_e2b_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm run start:dev
```

Backend runs on `http://localhost:3001`

### Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## Supported languages

| Language | Review | Execute |
|---|---|---|
| JavaScript | ✅ | ✅ |
| TypeScript | ✅ | ✅ |
| Python | ✅ | ✅ |
| Java | ✅ | ✅ |
| C++ | ✅ | ✅ |
| Go | ✅ | ✅ |

---

## API endpoints

| Method | Endpoint | Description | Rate limit |
|---|---|---|---|
| POST | `/review` | Single file review — 4-agent pipeline | 10/min |
| POST | `/review/autofix` | Auto-fix all issues in submitted code | 20/min |
| POST | `/project/review-files` | Review uploaded file set (max 5) | 5/min |
| POST | `/project/review-github` | Fetch + review public GitHub repo | 5/min |
| POST | `/execution/run` | Run code in E2B sandbox | 15/min |
| POST | `/execution/run-and-review` | Run + review + runtime analysis combined | 8/min |

---

## Project structure

```
ai-code-reviewer/
├── frontend/
│   ├── app/                    ← Next.js App Router pages
│   ├── components/
│   │   ├── editor/             ← CodeEditor, EditorPanel, FileUpload
│   │   ├── execution/          ← ConsolePanel, StdinInput
│   │   ├── layout/             ← Header, LanguageSelector, ThemeSwitcher
│   │   ├── project/            ← GitHub input, file upload, overview
│   │   ├── review/             ← ScoreCard, ReviewPanel, AutoFixPanel
│   │   └── ui/                 ← Button, Card, Badge, Banner, Spinner, ScoreDial
│   ├── context/                ← ThemeContext (dark / light)
│   ├── hooks/                  ← useReview, useProjectReview
│   ├── lib/                    ← api.ts, errors.ts, design-tokens.ts
│   └── types/                  ← review.ts (shared interfaces)
│
└── backend/
    └── src/
        ├── common/             ← AiService, AllExceptionsFilter, AiException
        ├── review/             ← 4-agent pipeline, synthesizer, autofix
        ├── project/            ← per-file review, GitHub fetcher
        └── execution/          ← E2B sandbox service, runtime analysis
```

---

## Code quality standards

This project follows production-grade coding standards:

- **SOLID principles** — SRP, OCP, DIP, ISP applied throughout
- **Type safety** — Zod runtime validation on all AI responses, no `any[]`
- **Error handling** — global exception filter, React error boundaries, retry with backoff
- **Security** — 100kb payload cap, per-route rate limiting, CORS whitelist, no stack trace leaks
- **Design tokens** — all spacing, radius, and font sizes from a single constants file
- **Reusable components** — ScoreDial, Spinner, EmptyState, ConfirmDialog extracted as primitives
- **Single source of truth** — language extension map shared across frontend + backend

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel (Hobby) | [yashdev-code-reviewer.vercel.app](https://yashdev-code-reviewer.vercel.app) |
| Backend | Render (Free) | Auto-assigned on deploy |

Both auto-deploy on every push to `main`.

### Environment variables

**Render (backend):**
```
GROQ_API_KEY=
E2B_API_KEY=
PORT=3001
FRONTEND_URL=https://yashdev-code-reviewer.vercel.app
```

**Vercel (frontend):**
```
NEXT_PUBLIC_API_URL=https://ai-code-reviewer-backend-zqnh.onrender.com
```

---

## Built by

**Yashwant** — Senior Associate at PwC  
[github.com/yAshDev26](https://github.com/yAshDev26)

---

## License

MIT
