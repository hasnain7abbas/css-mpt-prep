# FIA Job Prep

> **Prepare Smart, Get Selected.** A mobile-first MCQ practice platform for candidates preparing for FIA (Federal Investigation Agency) jobs in Pakistan.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Prisma · NextAuth v5**.

Registration is **manual and WhatsApp-gated** — students can't self-register. The owner creates accounts and shares credentials over WhatsApp (**+92 341 5298183**).

---

## Quick start

```bash
npm install
cp .env.example .env        # AUTH_SECRET is pre-filled for local dev
npx prisma migrate dev      # create the SQLite database
npx prisma db seed          # 250 MCQs · 10 tests · 5 subjects · demo + admin users
npm run dev                 # http://localhost:3000
```

### Seeded accounts

| Role  | Email                   | Password         | Notes                                  |
| ----- | ----------------------- | ---------------- | -------------------------------------- |
| Admin | `admin@fiajobprep.com`  | `Admin@FIA2024!` | Can create users at `/admin/users/new` |
| Demo  | `demo@fiajobprep.com`   | `Demo@1234`      | Forced to set a new password on login  |

---

## How registration works (owner workflow)

1. A visitor taps **Register on WhatsApp** on the landing page → WhatsApp opens with a pre-filled message to the owner.
2. The owner signs in as admin and visits **`/admin/users/new`** to create the account. A temporary password is generated automatically.
3. The owner taps **Copy WhatsApp message** and sends the credentials to the student.
4. The student signs in at `/login`. Because `mustChangePassword` is `true`, they're redirected to `/account/change-password` before they can use the app.

The owner number lives in `NEXT_PUBLIC_OWNER_WHATSAPP` (`.env`) with a fallback in `src/lib/whatsapp.ts` — keep both in sync.

---

## Scripts

| Command            | Description                                       |
| ------------------ | ------------------------------------------------- |
| `npm run dev`      | Start the dev server                              |
| `npm run build`    | Production build                                  |
| `npm run lint`     | ESLint                                            |
| `npm run db:migrate` | `prisma migrate dev`                            |
| `npm run db:seed`  | Seed subjects, tests, MCQs, and accounts          |
| `npm run db:reset` | Drop, re-migrate, and re-seed the database        |
| `npm run db:studio`| Browse the data in Prisma Studio                  |

---

## Project structure

```
src/
  app/
    (marketing)/        # public landing page  →  /
    (auth)/             # /login, /register (WhatsApp redirect)
    (account)/          # /account/change-password (first-login gate target)
    (app)/              # protected: /dashboard, /subjects, /progress, /admin
    (quiz)/             # focused, full-bleed: /tests/[id], /tests/[id]/result
    demo/               # public 10-question sampler  →  /demo
    api/auth/[...nextauth]/route.ts
    sitemap.ts · robots.ts · opengraph-image.tsx
  components/
    brand/ ui/ app/ marketing/
  lib/
    auth.ts auth-helpers.ts db.ts queries.ts stats.ts
    attempt-actions.ts whatsapp.ts subjects.ts utils.ts
prisma/
  schema.prisma · seed.ts · dev.db (generated)
```

### Auth & route protection

- `src/lib/auth.ts` — NextAuth v5 credentials provider, JWT sessions.
- Protected pages call `getCurrentUser()` / `requireAdmin()` (server-side, DB-authoritative).
- The first-login password gate reads `mustChangePassword` from the **database** (not the JWT), so changing the password and navigating to `/dashboard` just works — no token refresh needed.

### Quiz engine

- Server actions in `src/lib/attempt-actions.ts` (`startAttempt`, `saveProgress`, `submitAttempt`).
- The timer is derived from `attempt.startedAt`, so a refresh never resets it; answers autosave (debounced) so progress survives reloads.
- **Scoring is always done server-side** — the client never receives `correctIndex` until the result page.

---

## Switching to PostgreSQL (production)

The schema is Postgres-portable on purpose: `options`/`answers` use `Json` and enums are stored as `String`, so only the datasource changes.

1. In `prisma/schema.prisma`, set `provider = "postgresql"`.
2. Set `DATABASE_URL` to your Neon/Supabase connection string.
3. `npx prisma migrate dev --name init && npx prisma db seed`.
4. Deploy to Vercel. Set `AUTH_SECRET` (`openssl rand -base64 32`), `AUTH_URL` (your domain), `DATABASE_URL`, and `NEXT_PUBLIC_OWNER_WHATSAPP` in the project env.

---

## Adding more questions

The seed currently ships **50 MCQs per subject** (250 total), split into two 25-question tests each. To grow the bank, append to the arrays in `prisma/seed.ts` and re-run `npm run db:seed`. See `MCQ_Scraper_Instructions.md` for the planned scraping pipeline (target ~1,200 MCQs / 24 tests).
