<div align="center">

<img src="./public/logo.svg" alt="CSS MPT Prep" width="96" />

# CSS MPT Prep

### Clear the screening test.

A mobile-first MCQ practice platform for the **FPSC MCQ-Based Preliminary Test (MPT)** — the screening stage candidates must clear before sitting the CSS written examination. Timed mocks on the real 200-question format, instant explanations, and per-subject progress tracking.

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000?logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white">
  <img alt="Auth.js" src="https://img.shields.io/badge/Auth.js-v5-000?logo=auth0&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
</p>

<p>
  <a href="https://github.com/hasnain7abbas/css-mpt-prep/actions/workflows/ci.yml">
    <img alt="CI" src="https://github.com/hasnain7abbas/css-mpt-prep/actions/workflows/ci.yml/badge.svg">
  </a>
</p>

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhasnain7abbas%2Fcss-mpt-prep&env=AUTH_SECRET,DATABASE_URL,NEXT_PUBLIC_OWNER_WHATSAPP&envDescription=Auth%20secret%2C%20a%20Postgres%20connection%20string%2C%20and%20the%20owner%20WhatsApp%20number">
  <img alt="Deploy with Vercel" src="https://vercel.com/button">
</a>

</div>

---

## Overview

CSS MPT Prep is a complete, exam-style practice app. Registration is **manual and WhatsApp-gated** — candidates can't self-register; the owner creates accounts and shares credentials over WhatsApp. Students then take **timed, auto-graded MCQ tests** with instant per-question explanations and watch their accuracy, streak, and weak areas improve over time.

The bank ships with **2,343 verified MCQs** across the six examinable MPT subjects — General Science & Ability, English, Pakistan Affairs, Current Affairs, Islamic Studies, and Urdu. Every question was put through a blind re-answer pass; the 17 that failed are quarantined in `content/flagged/` rather than shipped.

Mocks follow the real paper: **200 MCQs / 200 minutes, pass mark 66 (33%), no negative marking.** FPSC's official subject weighting lives in `src/lib/mpt.ts` as the single source of truth.

## Highlights

- 🔐 **WhatsApp-gated onboarding** — no public sign-up; the owner provisions accounts and the first login forces a password change.
- ⏱️ **Timed quiz engine** — server-anchored countdown (survives refreshes), auto-submit at zero, mark-for-review, and a colour-coded question palette.
- 💾 **Crash-safe progress** — answers autosave; reloading never loses work.
- ✅ **Server-side scoring** — the correct answer never reaches the browser until the result page, with full explanations for every question.
- 📊 **Progress tracking** — overall accuracy, 30-day trend, per-subject breakdown, a 12-week activity heatmap, and a recent-attempts table.
- 🧑‍💼 **Admin** — create student accounts with auto-generated temporary passwords and a copy-ready WhatsApp message.
- 🧪 **Public demo** — a 10-question sampler at `/demo`, no login required.
- 📱 **Mobile-first & accessible** — built for 360 px first, keyboard-reachable, AA contrast.

## Quick start

```bash
git clone https://github.com/hasnain7abbas/css-mpt-prep.git
cd css-mpt-prep
npm install
cp .env.example .env        # set DATABASE_URL to your Postgres URL (Neon/Supabase)
npm run db:push             # creates the tables in your database
npm run db:seed             # 2,343 verified MCQs + admin & demo accounts
npm run dev                 # http://localhost:3000
```

### Seeded accounts

| Role  | Email                  | Password         | Notes                                   |
| ----- | ---------------------- | ---------------- | --------------------------------------- |
| Admin | `admin@cssmptprep.com` | `Admin@MPT2026!` | Create users at `/admin/users/new`      |
| Demo  | `demo@cssmptprep.com`  | `Demo@1234`      | Forced to set a new password on login   |

> **Change these before going live.** Update the seeded admin password and generate a fresh `AUTH_SECRET`.

## How registration works (owner flow)

1. A visitor taps **Register on WhatsApp** → WhatsApp opens with a pre-filled message to the owner.
2. The owner signs in as admin → **`/admin/users/new`** → creates the account (temporary password auto-generated).
3. The owner taps **Copy WhatsApp message** and sends the credentials.
4. The student signs in, is forced to set a new password, and lands on the dashboard.

The owner number lives in `NEXT_PUBLIC_OWNER_WHATSAPP` with a fallback in `src/lib/whatsapp.ts`.

## Tech stack

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Framework  | Next.js 16 (App Router, RSC, Server Actions)        |
| Language   | TypeScript (strict)                                 |
| Styling    | Tailwind CSS v4 (`@theme` tokens) + Radix primitives|
| Auth       | Auth.js / NextAuth v5 (credentials, JWT sessions)   |
| ORM / DB   | Prisma · PostgreSQL (Neon/Supabase)                 |
| Validation | Zod + react-hook-form                               |
| Icons      | lucide-react · Toasts: sonner                       |

## Project structure

```
src/
  app/
    (marketing)/   # public landing  → /
    (auth)/        # /login, /register (WhatsApp redirect)
    (account)/     # /account/change-password (first-login gate)
    (app)/         # protected: dashboard, subjects, progress, admin
    (quiz)/        # focused: /tests/[id] + /tests/[id]/result
    demo/          # public 10-question sampler
    sitemap.ts · robots.ts · opengraph-image.tsx
  components/ (brand · ui · app · marketing)
  lib/ (auth · db · queries · stats · attempt-actions · whatsapp · subjects)
prisma/
  schema.prisma · seed.ts
  lib/mcq.ts · generators.ts
  data/verified/*.json · data/handwritten.ts   # verified bank + hand-written items
content/
  raw/ · answers/ · verified/ · flagged/   # generation + verification pipeline
```

## Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the dev server                     |
| `npm run build`    | Production build                         |
| `npm run lint`     | ESLint                                   |
| `npm run db:seed`  | Seed subjects, tests, MCQs, and accounts |
| `npm run db:push`  | Sync the schema to the database          |
| `npm run db:reset` | Drop, recreate, and re-seed              |
| `npm run db:studio`| Browse data in Prisma Studio             |

## Deployment

> ⚠️ **Not GitHub Pages.** This is a full-stack app (auth, database, server actions), so it needs a Node.js host — GitHub Pages serves static files only. Deploy to **Vercel** (recommended) or any Node host, backed by a managed **PostgreSQL** database.

**Vercel + Neon/Supabase (recommended):**

1. Create a Postgres database (e.g. [Neon](https://neon.tech) free tier) and copy its connection string.
2. Click **Deploy with Vercel** above (or import the repo in Vercel) and set the env vars:
   - `DATABASE_URL` — your Postgres connection string
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `AUTH_URL` — your deployment URL (e.g. `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_OWNER_WHATSAPP` — owner number (no `+`, e.g. `923415298183`)
3. After the first deploy, create the tables and seed the DB:
   ```bash
   DATABASE_URL="<your-postgres-url>" npx prisma db push
   DATABASE_URL="<your-postgres-url>" npm run db:seed
   ```

## Growing the question bank

The bank combines the original hand-written MCQs with a deterministic generator (`prisma/lib/mcq.ts`) over curated factual datasets in `prisma/data/`. Add entries to those datasets (or new `Curated[]` arrays) and run `npm run db:seed` to regenerate. See `MCQ_Scraper_Instructions.md` for the longer-term expansion plan.

## License

[MIT](./LICENSE) © hasnain7abbas
