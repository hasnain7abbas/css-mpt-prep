# FIA Job Prep — Complete Build Specification

> **Purpose of this document:** This is a build-ready specification for Claude Code (or any developer) to implement the FIA Job Prep web application end-to-end. It contains brand assets, page-by-page UI specs, the WhatsApp-based registration flow, data models, tech stack recommendations, and a fix list for issues found in the original draft.

---

## 0. TL;DR for Claude Code

You are building a **mobile-first MCQ practice platform** for candidates preparing for FIA (Federal Investigation Agency) jobs in Pakistan. Key constraints:

1. **Registration is manual / gated.** Users cannot self-register on the site. The "Register" button must open WhatsApp with a pre-filled message to **+92 341 5298183**, where the owner manually creates the account and shares credentials.
2. **Login is standard** (email + password), but accounts only exist if the owner created them.
3. **Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Prisma + PostgreSQL + NextAuth (credentials provider). Deploy on Vercel + Neon/Supabase.
4. **Design system:** Emerald-green primary (`#10b981`), dark slate surfaces, generous whitespace, rounded-2xl cards, subtle shadows. No childish gradients, no neon.
5. **Build order:** Auth → Dashboard shell → Subject/Test catalog → Quiz engine → Result screen → Progress tracking → Admin panel (later).

Read the entire document before writing code. The **"Bug Fixes & Decisions"** section (§13) overrides anything in the original draft.

---

## 1. Brand Identity

### 1.1 Name & Tagline
- **Name:** FIA Job Prep
- **Tagline:** Prepare Smart, Get Selected
- **Trust badge:** Trusted FIA Preparation Platform

### 1.2 Logo (SVG — save as `public/logo.svg`)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="120" height="140" role="img" aria-label="FIA Job Prep logo">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <linearGradient id="innerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#064e3b" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Shield body -->
  <path d="M60 6 L108 22 L108 66 C108 96 88 122 60 134 C32 122 12 96 12 66 L12 22 Z"
        fill="url(#shieldGrad)" stroke="#065f46" stroke-width="2" filter="url(#softShadow)"/>

  <!-- Inner highlight -->
  <path d="M60 14 L100 27 L100 64 C100 90 84 112 60 123 C36 112 20 90 20 64 L20 27 Z"
        fill="url(#innerGrad)"/>

  <!-- Checkmark -->
  <path d="M36 70 L54 88 L86 52"
        fill="none" stroke="#ffffff" stroke-width="9"
        stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Subtle ring at top -->
  <circle cx="60" cy="22" r="3" fill="#ffffff" opacity="0.85"/>
</svg>
```

Also generate a **monochrome dark variant** (`logo-dark.svg`) by swapping the shield gradient to slate `#0f172a → #1e293b` and keeping the check white, for use on white backgrounds.

### 1.3 Color Tokens (Tailwind `tailwind.config.ts`)

```ts
colors: {
  primary: {
    DEFAULT: '#10b981',   // emerald-500
    dark:    '#047857',   // emerald-700
    light:   '#d1fae5',   // emerald-100
  },
  surface: {
    DEFAULT: '#ffffff',
    muted:   '#f8fafc',   // slate-50
    dark:    '#0f172a',   // slate-900
  },
  ink: {
    DEFAULT: '#0f172a',
    muted:   '#475569',   // slate-600
    soft:    '#94a3b8',   // slate-400
  },
  success: '#10b981',
  warning: '#f59e0b',
  danger:  '#ef4444',
}
```

### 1.4 Typography
- **Display / Headings:** `Plus Jakarta Sans` (weights 600, 700, 800)
- **Body:** `Inter` (400, 500, 600)
- **Monospace (timers, scores):** `JetBrains Mono` (500)

Load via `next/font/google`.

### 1.5 Spacing & Radius
- Card radius: `rounded-2xl` (1rem)
- Button radius: `rounded-xl` (0.75rem)
- Section padding: `py-16 md:py-24`
- Container: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`

---

## 2. Tech Stack & Project Setup

### 2.1 Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for SEO, RSC for fast pages, API routes built-in |
| Language | TypeScript (strict) | Type safety across DB → API → UI |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, accessible |
| Auth | NextAuth v5 (credentials) | Simple email/password since registration is manual |
| ORM | Prisma | Type-safe DB access |
| DB | PostgreSQL (Neon or Supabase) | Free tier, serverless-friendly |
| Validation | Zod | Server + client validation |
| Forms | react-hook-form + zod resolver | Standard, performant |
| State | React Server Components + minimal client state | Avoid Redux/Zustand unless needed |
| Icons | lucide-react | Clean, consistent |
| Deploy | Vercel | Zero-config for Next.js |

### 2.2 Initial Commands

```bash
npx create-next-app@latest fia-job-prep --typescript --tailwind --app --eslint --src-dir
cd fia-job-prep
npm i next-auth@beta @auth/prisma-adapter bcryptjs prisma @prisma/client zod react-hook-form @hookform/resolvers lucide-react clsx tailwind-merge class-variance-authority
npm i -D @types/bcryptjs
npx shadcn@latest init
npx shadcn@latest add button input label card dialog toast badge progress tabs select
npx prisma init
```

### 2.3 Folder Structure

```
src/
  app/
    (marketing)/
      page.tsx                  # Landing
      layout.tsx
    (auth)/
      login/page.tsx
      register/page.tsx          # Renders WhatsApp redirect, NOT a form
    (app)/
      dashboard/page.tsx
      subjects/page.tsx
      subjects/[slug]/page.tsx
      tests/[testId]/page.tsx    # Quiz engine
      tests/[testId]/result/page.tsx
      progress/page.tsx
      layout.tsx                 # Protected layout
    api/
      auth/[...nextauth]/route.ts
  components/
    ui/                          # shadcn primitives
    brand/Logo.tsx
    quiz/QuestionCard.tsx
    quiz/Timer.tsx
    quiz/ProgressBar.tsx
    dashboard/StatCard.tsx
    dashboard/SubjectCard.tsx
  lib/
    auth.ts
    db.ts
    whatsapp.ts                  # Builds the wa.me link
    utils.ts
  prisma/
    schema.prisma
    seed.ts
```

---

## 3. Registration Flow (WhatsApp-Gated) — **CRITICAL**

Self-service signup is **disabled**. The "Register" CTA must always lead to a WhatsApp deep link to the owner.

### 3.1 The WhatsApp Helper

`src/lib/whatsapp.ts`:

```ts
export const OWNER_WHATSAPP = "923415298183"; // no '+' for wa.me

export function buildRegistrationLink(opts?: { name?: string; email?: string }) {
  const lines = [
    "Assalam-o-Alaikum! I'd like to register for FIA Job Prep.",
    opts?.name  ? `Name: ${opts.name}`   : "Name: ",
    opts?.email ? `Email: ${opts.email}` : "Email: ",
    "City: ",
    "Exam I'm preparing for: ",
    "Please create my account. Shukriya!",
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${OWNER_WHATSAPP}?text=${text}`;
}
```

### 3.2 The Register Page (`/register`)

This page is **not a signup form**. It's a friendly explainer + a big WhatsApp button + an optional pre-fill mini-form (name/email) that only customizes the WhatsApp message — it does NOT create any account.

**UI spec:**

- Centered card, max-w-md
- Logo at top
- Heading: *"Registration is manual to keep quality high"*
- Sub: *"Tap below to message us on WhatsApp. We verify and activate your account within a few hours."*
- Optional inputs: Full Name, Email (both optional, used only to pre-fill the message)
- Primary button (full-width, emerald): **"Continue on WhatsApp →"** — `target="_blank" rel="noopener"`
- Secondary text link: *"Already have an account? Sign in"*
- Small trust line: *"We reply during 9 AM – 11 PM PKT."*

**Important:** Do not show "Create password" fields. Do not POST to any endpoint. The button is a plain `<a href={buildRegistrationLink(...)}>` styled as a button.

### 3.3 Owner Workflow (document this in the README)

1. Owner receives WhatsApp message.
2. Owner runs an admin command or visits `/admin/users/new` to create the user (name, email, generated password).
3. Owner sends credentials back to the user on WhatsApp.
4. User signs in at `/login`. On first login, force a password change (redirect to `/account/change-password` if `mustChangePassword === true`).

---

## 4. Authentication (Login)

### 4.1 `/login` Page

- Card, max-w-md, centered
- Logo + heading: *"Sign in to your account"*
- Inputs: Email, Password (with show/hide eye icon)
- Checkbox: Remember me (30-day session vs 1-day default)
- Primary button: **"Sign In →"**
- Below: *"Don't have an account? **Register on WhatsApp**"* → links to `/register`
- Validation (Zod):
  - Email: required, valid email
  - Password: required, min 8 chars
- Errors render inline under the field, plus a top-of-form toast for auth failures.

### 4.2 NextAuth Credentials Provider

`src/lib/auth.ts`:

```ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const parsed = loginSchema.safeParse(creds);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user || !user.passwordHash || !user.isActive) return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, mustChangePassword: user.mustChangePassword };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.mustChangePassword = (user as any).mustChangePassword;
      return token;
    },
    async session({ session, token }) {
      (session.user as any).mustChangePassword = token.mustChangePassword;
      return session;
    },
  },
});
```

### 4.3 Forgot Password
Also routes to WhatsApp: *"Forgot password? Message us on WhatsApp to reset."*

---

## 5. Landing Page (`/`)

### 5.1 Sections (top → bottom)

1. **Sticky nav** — Logo left, links (Features, Subjects, Pricing-if-any), `Sign In` ghost button, `Register on WhatsApp` solid emerald button.
2. **Hero** —
   - Headline: *"Crack Your FIA Jobs Exam With Confidence"*
   - Sub: *"Practice real-style MCQs, timed mocks, and past papers. Track progress like a future officer — not a doom-scroller."*
   - Primary CTA: **"Start Free Demo Test →"** (links to a public demo quiz, 10 Qs, no login)
   - Secondary CTA: **"Register on WhatsApp"**
   - Right-side: an illustrated mockup or the logo over a soft emerald radial-gradient blob (no stock photos of generic students)
3. **Trust strip** — 3 small badges: *Trusted FIA Prep Platform • 5,000+ MCQs • Updated Past Papers*
4. **Feature grid (3 cards)** —
   - 5,000+ MCQs · Real exam feel
   - Timed Mocks · Pressure-tested practice
   - Smart Progress · See exactly where you're weak
5. **Subjects preview** — Five subject cards (see §6.1) with a "See all" link.
6. **How it works (3 steps)** — Register on WhatsApp → Get credentials → Start practicing.
7. **Sample question demo** — A live interactive sample MCQ that grades on submit. Encourages signup.
8. **Final CTA banner** — *"Ready for the real FIA exam?"* + WhatsApp button.
9. **Footer** — Logo, short blurb, links (About, Contact, Privacy, Terms), © year FIA Job Prep.

### 5.2 Tone
Confident, no-nonsense Pakistani exam-prep tone. Avoid "guaranteed selection" or marketing fluff. Don't use the original line about "useless reels" — replace with the cleaner sub above.

---

## 6. Dashboard (`/dashboard`) — Authenticated

### 6.1 Layout

- **Top bar:** Logo · spacer · greeting *"Assalam-o-Alaikum, {firstName}"* · avatar dropdown (Profile, Progress, Logout)
- **Welcome card:** *"Pick up where you left off"* + button to last attempted test, or "Start a new test" if none.
- **Stat row (4 cards):**
  - Total Questions Attempted
  - Correct
  - Accuracy %
  - Current Streak (days)
- **Subjects grid (5 cards):** English, General Knowledge, Pakistan Studies, Computer, Islamic Studies — each links to `/subjects/[slug]`.
- **Recommended tests:** 3-card carousel based on weakest subject.
- **Motivational banner (bottom):** *"Consistency beats motivation. One test a day, every day."* Emerald gradient, check icon.

### 6.2 Stat Card Spec

```
┌────────────────────────────┐
│  Icon            Trend ↑   │
│  100                       │
│  Total Questions           │
└────────────────────────────┘
```
- Number in JetBrains Mono, `text-3xl font-bold`
- Label in `text-sm text-ink-muted`
- Trend pill only if previous-period delta exists

---

## 7. Subjects & Test Catalog

### 7.1 Subjects

| Slug | Title | Contents |
|---|---|---|
| `english` | English | Grammar, Vocabulary, Synonyms, Antonyms, Comprehension |
| `general-knowledge` | General Knowledge | World facts, Current affairs, Capitals, Awards |
| `pakistan-studies` | Pakistan Studies | History, Politics, Geography, Constitution |
| `computer` | Computer | Basic IT, MS Office, Internet, Hardware, Shortcuts |
| `islamic-studies` | Islamic Studies | Quran, Hadith, Fiqh, Seerah, Islamic history |

### 7.2 `/subjects/[slug]` — Test List

- **Header:** Subject title + short description + chip showing total tests and total MCQs.
- **Toolbar:** Search input (`Search tests…`), Difficulty filter (All / Easy / Medium / Hard), Sort (Newest / Most attempted / Hardest).
- **Test cards:** Title, badge for difficulty, "50 Questions · 30 min · Instant result + explanations", green "Start Test" button.
- **Empty state:** *"No tests match your filters."* with a Reset Filters button.

### 7.3 Naming convention (FIX)
Tests are numbered **sequentially with no gaps**: `Test 1, Test 2, Test 3 …`. The original draft had gaps (Islamic Studies missing Test 5, GK missing 1/2/4/6/10) — these were data omissions, not intentional. Seed the DB with contiguous numbering and only display gaps if a test is actually disabled.

---

## 8. Quiz Engine (`/tests/[testId]`)

### 8.1 Pre-quiz screen
- Title, subject, # questions, duration, marking scheme (e.g., +1 / -0.25 if negative marking is on, otherwise just +1), instructions.
- Big **Start Test** button. Once tapped, the timer starts and cannot be paused.

### 8.2 In-quiz UI
- **Top bar:** Test title (left) · `Timer 28:42` in mono (center) · Question `7 / 50` (right)
- **Question card:**
  - Question text — `text-lg leading-relaxed`
  - 4 options as large tappable cards (full width on mobile, 2×2 grid on ≥md). Selected = emerald border + light emerald background.
  - **Single answer per question.** Tap to select; tap a different option to change.
- **Footer bar:** `← Previous` · `Mark for Review ★` · `Save & Next →`. On the last question: `Save & Submit`.
- **Question palette (collapsible drawer on mobile, sidebar on desktop):** Grid of question numbers, color-coded:
  - Gray = not visited
  - Blue = visited, not answered
  - Green = answered
  - Yellow = marked for review
  - Yellow+Green = answered & marked

### 8.3 Submission rules
- Auto-submit when timer hits 0.
- Confirm dialog on manual submit: *"You've answered X of N. Submit?"*
- Network-safe: persist answers to server on every Save & Next (debounced), so a refresh doesn't lose progress.

### 8.4 Result page (`/tests/[testId]/result`)
- **Score hero:** big score (e.g., `38 / 50`), accuracy %, time used, percentile (if enough data).
- **Per-question review:** Every question with the user's answer, the correct answer, and an explanation. Color-code right (green) / wrong (red) / skipped (gray).
- Buttons: `Retake Test`, `Back to Subject`, `Share Result` (copy link, not social).
- Save attempt to DB → feeds the progress page.

### 8.5 Sample Questions (cleaned & completed — original had truncated options)

These are the four samples from the original, fixed so each has **four options**, one marked correct, with an explanation. Use as seed data.

```ts
[
  {
    subject: "english",
    text: "Choose the correct synonym for 'ABANDON'.",
    options: ["Keep", "Forsake", "Retain", "Maintain"],
    correctIndex: 1,
    explanation: "'Abandon' means to leave or give up — 'forsake' is the closest synonym.",
    difficulty: "easy",
  },
  {
    subject: "pakistan-studies",
    text: "The Pakistan Resolution was passed in?",
    options: ["1940", "1930", "1947", "1956"],
    correctIndex: 0,
    explanation: "The Pakistan Resolution (Lahore Resolution) was passed on 23 March 1940 at Minto Park, Lahore.",
    difficulty: "easy",
  },
  {
    subject: "islamic-studies",
    text: "Who has the nickname 'Sahib-us-Sirr' (Keeper of the Secret)?",
    options: ["Hazrat Abu Bakr (RA)", "Hazrat Umar (RA)", "Hazrat Hudhaifa ibn al-Yaman (RA)", "Hazrat Ali (RA)"],
    correctIndex: 2,
    explanation: "Hazrat Hudhaifa ibn al-Yaman (RA) was given the title Sahib-us-Sirr by the Prophet ﷺ as he was entrusted with the names of the hypocrites.",
    difficulty: "medium",
  },
  {
    subject: "english",
    text: "What is the antonym of 'Niggardly'?",
    options: ["Yield", "Permit", "Obedient", "Generous"],
    correctIndex: 3,
    explanation: "'Niggardly' means stingy or miserly. Its antonym is 'generous'.",
    difficulty: "medium",
  },
]
```

---

## 9. Progress Page (`/progress`)

- **Overall accuracy** big number + trend over last 30 days (sparkline).
- **Per-subject breakdown:** bar chart of accuracy by subject; identify weakest.
- **Recent attempts table:** Test, Date, Score, Accuracy, Time, action: "Review".
- **Streak calendar:** GitHub-style heatmap of test-attempt days for last 12 weeks.

---

## 10. Database Schema (Prisma)

```prisma
generator client { provider = "prisma-client-js" }
datasource db   { provider = "postgresql"; url = env("DATABASE_URL") }

model User {
  id                  String   @id @default(cuid())
  email               String   @unique
  name                String
  passwordHash        String
  mustChangePassword  Boolean  @default(true)
  isActive            Boolean  @default(true)
  role                Role     @default(STUDENT)
  createdAt           DateTime @default(now())
  attempts            Attempt[]
}

enum Role { STUDENT ADMIN }

model Subject {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String
  tests       Test[]
  order       Int      @default(0)
}

model Test {
  id           String     @id @default(cuid())
  subjectId    String
  subject      Subject    @relation(fields: [subjectId], references: [id])
  number       Int        // 1, 2, 3 ... per subject
  title        String     // e.g., "English Test 1"
  difficulty   Difficulty @default(MEDIUM)
  durationMin  Int        @default(30)
  isPublished  Boolean    @default(true)
  questions    Question[]
  attempts     Attempt[]
  createdAt    DateTime   @default(now())

  @@unique([subjectId, number])
}

enum Difficulty { EASY MEDIUM HARD }

model Question {
  id           String   @id @default(cuid())
  testId       String
  test         Test     @relation(fields: [testId], references: [id], onDelete: Cascade)
  order        Int
  text         String
  options      String[] // exactly 4
  correctIndex Int      // 0..3
  explanation  String
}

model Attempt {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  testId      String
  test        Test     @relation(fields: [testId], references: [id])
  answers     Json     // [{ questionId, selectedIndex|null, markedForReview }]
  score       Int
  total       Int
  accuracy    Float
  startedAt   DateTime
  submittedAt DateTime?
  createdAt   DateTime @default(now())
}
```

Run: `npx prisma migrate dev --name init && npx prisma db seed`.

---

## 11. Admin (Phase 2 — build after MVP works)

Routes under `/admin` guarded by `role === 'ADMIN'`:
- `/admin/users` — list, create user (sets temp password, `mustChangePassword = true`), deactivate.
- `/admin/subjects` — CRUD.
- `/admin/tests` — CRUD + question editor (CSV import + manual).
- `/admin/analytics` — DAU, attempts/day, hardest questions (lowest correctness).

---

## 12. UI / UX Guidelines

1. **Mobile-first.** Most users will be on Android. Test at 360px width first.
2. **Tap targets ≥ 44×44 px.** Especially MCQ options.
3. **No layout shift.** Reserve space for images, timers, badges.
4. **Loading states:** skeletons, not spinners, for lists and cards.
5. **Empty states:** friendly copy + a CTA. Never a blank screen.
6. **Accessibility:**
   - All interactive elements keyboard-reachable.
   - Color contrast AA minimum (the emerald on white at body sizes passes; check button text).
   - Proper `aria-label` on icon-only buttons.
7. **Dark mode:** Optional for v1. If included, swap `surface` and `ink` and slightly lighten the primary.
8. **Localization:** UI English now; leave room for Urdu copy via a `t()` helper using `next-intl` (don't ship Urdu in v1 unless asked).
9. **No autoplay sounds, no popups, no exit-intent modals.**
10. **Microcopy in buttons:** action verbs — "Start Test", "Save & Next", not "Click here".

---

## 13. Bug Fixes & Decisions (Overrides the Original Draft)

| # | Issue in original | Decision |
|---|---|---|
| 1 | Self-registration form with email/password fields | **Removed.** `/register` is a WhatsApp redirect page only. |
| 2 | "Face ID auto-fill" mentioned on login | Removed; not a control we render. The browser/OS handles autofill natively. |
| 3 | Test numbering gaps (e.g., Islamic Studies missing Test 5; GK skipping 1/2/4/6/10) | **Numbered contiguously** in the DB. Render only published tests. |
| 4 | Sample Q1 ("ABANDON") only had 2 options visible | Filled to 4 options in §8.5. |
| 5 | Sample Q3 ("Sahib-us-Sirr") had no options | Provided 4 options + correct answer in §8.5. |
| 6 | Sample Q4 ("Niggardly") missing the correct antonym in visible options | Added "Generous" as the correct fourth option. |
| 7 | "Top Results: [Status/Metrics]" placeholder on dashboard | Replaced with concrete 4-stat row (Attempted, Correct, Accuracy, Streak). |
| 8 | Tagline *"Stop scrolling useless reels…"* | Replaced with cleaner copy (see §5.1) — keeps the spirit, avoids sounding preachy. |
| 9 | Logo described only as "shield with checkmark" with no asset | Full SVG provided in §1.2 + dark variant noted. |
| 10 | "Instant Result + Explanations" written on every test card with no source of truth | Made a real feature — every test has explanations stored in `Question.explanation`. |
| 11 | No forgot-password flow described | Routes to WhatsApp (§4.3). |
| 12 | Search bar with no behavior defined | Searches test titles (case-insensitive, debounced 250ms). |
| 13 | No timer behavior, no auto-submit, no progress persistence | All defined in §8. |
| 14 | "Filter Difficulty" with no values | Set to Easy / Medium / Hard (§7.2). |

---

## 14. Environment Variables

`.env.local`:

```
DATABASE_URL=postgresql://...
AUTH_SECRET=          # openssl rand -base64 32
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_OWNER_WHATSAPP=923415298183
```

The WhatsApp number is also hardcoded in `lib/whatsapp.ts` as a fallback. Keep both in sync.

---

## 15. Implementation Checklist (in order)

- [ ] Project bootstrap, Tailwind theme, fonts, Logo component using the SVG in §1.2
- [ ] Prisma schema + initial migration + seed (5 subjects, ~3 tests each with the §8.5 samples expanded)
- [ ] NextAuth credentials provider
- [ ] `/login` page + validation + error toasts
- [ ] `/register` WhatsApp redirect page
- [ ] Protected `(app)` layout with top bar + auth check
- [ ] `/dashboard` with stat cards and subject grid
- [ ] `/subjects/[slug]` with filters and test cards
- [ ] Quiz engine: pre-quiz, in-quiz UI, timer, palette, persistence
- [ ] Result page with per-question review
- [ ] `/progress` with charts (use `recharts`)
- [ ] First-login forced password change
- [ ] Landing page sections in §5
- [ ] Admin user-creation page (single page is enough for v1)
- [ ] SEO: metadata per route, sitemap, robots, OG image using the logo
- [ ] Analytics (Plausible or Vercel Analytics)
- [ ] Deploy to Vercel + Neon, point a domain, enable HTTPS

---

## 16. Acceptance Criteria (Definition of Done)

1. A new visitor lands on `/`, clicks **Register on WhatsApp**, and WhatsApp opens with the pre-filled message to **+92 341 5298183**.
2. The owner can create a user via `/admin/users/new`; the user receives credentials.
3. The user logs in at `/login`, is forced to change password, lands on `/dashboard`.
4. The user starts a test, answers questions, the timer auto-submits, and the result page shows score + per-question explanations.
5. The user's attempt appears on `/progress` with accurate stats.
6. All pages are responsive at 360px, 768px, and 1280px.
7. Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on the landing page.
8. No console errors, no TypeScript errors, no Prisma warnings on `npm run build`.

---

**End of spec.** When in doubt, prefer simplicity, accessibility, and shipping over cleverness.
