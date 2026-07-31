# MPT pivot — where things stand

Working notes for picking this up again. **Merged into `main` and deployed** on
31 July 2026 — the live site now serves the MPT app. The repo and Vercel project
were renamed from `fia-job-prep` to `css-mpt-prep` at the same time.

## What the app is now

A preparation platform for the **FPSC MCQ-Based Preliminary Test (MPT)**, the
screening stage for CSS.

| Fact | Value |
| --- | --- |
| Cycle | CSS 2027 |
| Applications | 3–20 August 2026 |
| Test day | 27 September 2026 |
| Written exam | 27 January 2027 |
| Paper | 200 MCQs / 200 minutes |
| Pass mark | 66 / 200 (33%) |
| Negative marking | none |
| Marks count toward merit | no — screening only |

Official weighting (in `src/lib/mpt.ts`, single source of truth):
General Science & Ability 60 · English 50 · Pakistan Affairs 20 ·
Current Affairs 20 · Islamic Studies 20 · Urdu 20 · General Knowledge 10.

## Done

**Design direction — "Examination Paper".** Institutional editorial: the FPSC
notification and the OMR answer sheet, not a SaaS dashboard.

- Palette: paper `#fbf9f4`, ink `#12161c`, seal green `#14563c`, exam red `#b3122b`. Light is the default; dark is a night-study mode.
- Type: Fraunces (display), IBM Plex Sans (text), IBM Plex Mono (timers/scores/figures), Noto Nastaliq Urdu (Urdu items render in proper Nastaliq, RTL).
- 4px corners everywhere, hairline rules instead of cards-with-shadows, 3.5% paper grain, one easing token (`--ease-out-expo`).
- **Signature move:** every answer option is an OMR bubble that fills with ink when chosen (`src/components/app/OptionRow.tsx`); the question palette is a miniature answer sheet.

**Schema** (`prisma/schema.prisma`) — `Test.kind` (PRACTICE / DRILL / MOCK /
PAST_PAPER), `Test.key` for stable seeding, nullable `subjectId` so a mixed
200-question mock is one paper, `Test.paperYear`, and `Question.subjectSlug` +
`Question.topic` so a mock feeds per-section and per-topic analytics.

**Pages** — landing (countdown, syllabus table, live sample, calendar),
dashboard (weak-area list + drills + resume), sections, section detail,
`/mocks`, `/past-papers`, progress (per-section table, projected MPT score
against the 66-mark line, weak topics), demo (15 questions), quiz runner,
result sheet (pass-line gauge, per-section breakdown, blank-answer warning).

**Seed** (`prisma/seed.ts`) — builds practice tests, topic drills, weighted
200-question mocks and past papers from three sources, and **preserves existing
User rows** while replacing all content.

**Content pipeline** — `scripts/mcq-blind.mjs` (strips the answer key),
`scripts/mcq-merge.mjs` (keeps only questions an independent checker answered
the same way), `scripts/compile-bank.mjs` (writes `prisma/data/verified/`).

## Question bank

Assembled today: **3,923 questions across 99 papers** (69 practice tests, 30 drills).

| Source | Questions |
| --- | --- |
| Deterministic generators over curated fact tables | 2,699 |
| Hand-written past-paper MCQs (re-pointed at MPT subjects) | 250 |
| New, written and blind-verified | 533 |
| **Written but not yet verified** (in `content/raw/`) | **1,827** |

Verification result so far: of ~540 questions checked by an independent agent,
7 disagreed with the answer key and were dropped — a 99% agreement rate.

## Next, in order

1. **Verify the 1,827 pending questions.** They sit in `content/raw/<subject>/*.json`.
   Run a verifier over each unit (`node scripts/mcq-blind.mjs <file> <start> <count>`,
   answers to `content/answers/<unit>.v1.json`), then `node scripts/mcq-merge.mjs`
   and `node scripts/compile-bank.mjs`.
2. **Urdu and Current Affairs banks are the blockers for mocks.** The mock builder
   needs at least 20 verified questions in each to assemble a 200-question paper;
   both are currently at 0 verified. Urdu units are written but unverified;
   Current Affairs has 240 written (of 500 planned).
3. **Past papers** — the research pass for MPT 2025/2026 recalled papers did not finish.
4. **Audit the inherited bank** — the 2,699 generated + 250 hand-written questions
   carried over from the FIA app have not been fact-checked against MPT standards.
5. **Deploy** — see below.

## Deploying (do not skip step 1)

The schema changed, so the production database must be migrated *before* the new
code goes live, or every page will error.

```bash
# 1. migrate + reseed production (keeps user accounts, replaces all content)
DATABASE_URL="<neon-url>" npx prisma db push
DATABASE_URL="<neon-url>" npm run db:seed

# 2. then merge the branch — Vercel deploys on push to main
git checkout main && git merge mpt-pivot && git push
```

Set `NEXT_PUBLIC_SITE_URL` in Vercel to the real domain (metadata, sitemap and
robots read it). Seeded accounts default to `admin@cssmptprep.com` /
`demo@cssmptprep.com`; override with `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`,
`SEED_DEMO_EMAIL`, `SEED_DEMO_PASSWORD` and change them before launch.

## Sandbox notes

- `prisma generate` cannot download its engines here; generate types with
  `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 PRISMA_SCHEMA_ENGINE_BINARY=/bin/true PRISMA_QUERY_ENGINE_LIBRARY=/bin/true npx prisma generate --no-engine`.
  CI and Vercel are unaffected.
- `next build` cannot fetch Google Fonts here, so the production build was not run
  locally. Typecheck and lint are clean. CI runs the real build.
