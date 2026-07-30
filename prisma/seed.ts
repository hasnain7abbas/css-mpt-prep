/**
 * CSS MPT Prep — database seed.
 *
 * Builds the whole question bank from three sources:
 *   1. `generators.ts`         — deterministic MCQs over curated factual datasets
 *   2. `data/handwritten.ts`   — hand-written past-paper MCQs
 *   3. `data/verified/*.json`  — written-then-blind-verified banks (see content/)
 *
 * and assembles four kinds of paper:
 *   PRACTICE   — 50-question subject tests
 *   DRILL      — 15-question topic drills for weak-area work
 *   MOCK       — 200-question, 200-minute full MPT simulations
 *   PAST_PAPER — recalled FPSC MPT papers
 *
 * Existing User rows are never touched: the seed replaces content only.
 *
 * Run: npm run db:seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { generatedBySlug } from "./generators";
import { dedupeByText } from "./lib/mcq";
import {
  englishMCQs,
  gkMCQs,
  pakStudiesMCQs,
  computerMCQs,
  islamicStudiesMCQs,
} from "./data/handwritten";

// Instantiated lazily so importing this file (for the dry-run report) never
// needs a database connection or a generated query engine.
let _prisma: PrismaClient | undefined;
const db = () => (_prisma ??= new PrismaClient());
const HERE = dirname(fileURLToPath(import.meta.url));
const VERIFIED_DIR = join(HERE, "data/verified");

type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type MCQ = {
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  difficulty: Difficulty;
  topic?: string;
  subjectSlug?: string;
};

// ─────────────────────────────────────────────
// SUBJECTS — official FPSC MPT weighting (200 marks)
// ─────────────────────────────────────────────

export const subjects = [
  {
    slug: "general-science-ability",
    title: "General Science & Ability",
    description:
      "Everyday science, arithmetic, algebra and geometry, number series, analytical and logical reasoning — the heaviest section of the paper.",
    order: 1,
    mptMarks: 60,
  },
  {
    slug: "english",
    title: "English",
    description:
      "Vocabulary, grammar, sentence correction, idioms and phrasal verbs, and comprehension.",
    order: 2,
    mptMarks: 50,
  },
  {
    slug: "pakistan-affairs",
    title: "Pakistan Affairs",
    description:
      "Freedom movement, constitutional history, geography, economy and post-1947 Pakistan.",
    order: 3,
    mptMarks: 20,
  },
  {
    slug: "current-affairs",
    title: "Current Affairs",
    description:
      "National and international developments, summits and organisations, economy, awards and sport.",
    order: 4,
    mptMarks: 20,
  },
  {
    slug: "islamic-studies",
    title: "Islamic Studies",
    description:
      "Quran, Hadith, Seerah, Fiqh and Islamic history — with Civics & Ethics items for non-Muslim candidates.",
    order: 5,
    mptMarks: 20,
  },
  {
    slug: "urdu",
    title: "Urdu",
    description: "اردو قواعد، ترجمہ، محاورات و ضرب الامثال اور اردو ادب۔",
    order: 6,
    mptMarks: 20,
  },
  {
    slug: "general-knowledge",
    title: "General Knowledge",
    description:
      "Capitals and currencies, international organisations, geography superlatives, books, inventions and world facts.",
    order: 7,
    mptMarks: 10,
  },
];

export const SUBJECT_SLUGS = subjects.map((s) => s.slug);

// ─────────────────────────────────────────────
// BANK ASSEMBLY
// ─────────────────────────────────────────────

/** Hand-written past-paper MCQs, re-pointed at their MPT subject. */
const handWritten: Record<string, MCQ[]> = {
  english: englishMCQs.map((q) => ({ ...q, topic: q.topic ?? "past-paper" })),
  "general-knowledge": gkMCQs.map((q) => ({ ...q, topic: q.topic ?? "world-facts" })),
  "pakistan-affairs": pakStudiesMCQs.map((q) => ({ ...q, topic: q.topic ?? "pakistan-facts" })),
  "general-science-ability": computerMCQs.map((q) => ({ ...q, topic: q.topic ?? "technology" })),
  "islamic-studies": islamicStudiesMCQs.map((q) => ({ ...q, topic: q.topic ?? "islamiat" })),
};

/** Verified banks compiled from content/verified by scripts/compile-bank.mjs. */
function verifiedBank(slug: string): MCQ[] {
  const file = join(VERIFIED_DIR, `${slug}.json`);
  if (!existsSync(file)) return [];
  try {
    const rows = JSON.parse(readFileSync(file, "utf8")) as MCQ[];
    return Array.isArray(rows) ? rows : [];
  } catch {
    console.warn(`  ! could not parse the verified bank for ${slug}`);
    return [];
  }
}

const generated = generatedBySlug();

/** Everything available for one subject, de-duplicated by question text. */
export function bankFor(slug: string): MCQ[] {
  const all = [
    ...((generated[slug] ?? []) as MCQ[]),
    ...(handWritten[slug] ?? []),
    ...verifiedBank(slug),
  ];
  return dedupeByText(all).map((q) => ({ ...q, subjectSlug: slug }));
}

/** Recalled FPSC past papers, one entry per paper. */
type PastPaper = { key: string; title: string; year: number; questions: MCQ[] };

type PastPaperRow = MCQ & { source?: string; paperYear?: number; paperTitle?: string };

function pastPapers(): PastPaper[] {
  const file = join(VERIFIED_DIR, "past-papers.json");
  if (!existsSync(file)) return [];
  try {
    const rows = JSON.parse(readFileSync(file, "utf8")) as PastPaperRow[];
    const byPaper = new Map<string, PastPaper>();
    for (const q of rows) {
      const key = q.source ?? `paper-${q.paperYear ?? "unknown"}`;
      const year = q.paperYear ?? Number(String(key).match(/(20\d{2})/)?.[1] ?? 0);
      if (!byPaper.has(key)) {
        byPaper.set(key, {
          key,
          title: q.paperTitle ?? `MPT ${year} — Solved Past Paper`,
          year,
          questions: [],
        });
      }
      byPaper.get(key)!.questions.push({
        ...q,
        subjectSlug: SUBJECT_SLUGS.includes(q.topic ?? "") ? q.topic : q.subjectSlug,
      });
    }
    return [...byPaper.values()]
      .filter((p) => p.questions.length >= 10)
      .sort((a, b) => b.year - a.year);
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
// DETERMINISTIC SHUFFLE (stable across re-seeds)
// ─────────────────────────────────────────────

function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let s = h >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Split into chunks of `size`; a short tail is folded into the previous chunk. */
function chunk<T>(arr: T[], size: number, min: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  while (out.length > 1 && out[out.length - 1].length < min) {
    const tail = out.pop()!;
    out[out.length - 1].push(...tail);
  }
  return out.filter((c) => c.length >= min);
}

function modalDifficulty(qs: MCQ[]): Difficulty {
  const n: Record<Difficulty, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  for (const q of qs) n[q.difficulty] = (n[q.difficulty] ?? 0) + 1;
  if (n.HARD > n.MEDIUM && n.HARD > n.EASY) return "HARD";
  if (n.EASY > n.MEDIUM && n.EASY > n.HARD) return "EASY";
  return "MEDIUM";
}

export function topicLabel(topic: string) {
  return topic
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─────────────────────────────────────────────
// PAPER ASSEMBLY
// ─────────────────────────────────────────────

const PRACTICE_SIZE = 50;
const DRILL_SIZE = 15;
const MOCK_SIZE = 200;
const MOCK_DURATION = 200;
const MAX_MOCKS = 10;
const MAX_DRILLS_PER_TOPIC = 3;

export type TestSeed = {
  key: string;
  subjectSlug: string | null;
  kind: "PRACTICE" | "DRILL" | "MOCK" | "PAST_PAPER";
  topic?: string | null;
  number: number;
  title: string;
  difficulty: Difficulty;
  durationMin: number;
  paperYear?: number | null;
  questions: MCQ[];
};

export function buildTests(): TestSeed[] {
  const tests: TestSeed[] = [];
  const banks = new Map<string, MCQ[]>();
  for (const s of subjects) banks.set(s.slug, bankFor(s.slug));

  // 1. Subject practice tests — 50 questions, one minute per question.
  for (const s of subjects) {
    const bank = seededShuffle(banks.get(s.slug) ?? [], `practice:${s.slug}`);
    chunk(bank, PRACTICE_SIZE, 20).forEach((qs, i) => {
      tests.push({
        key: `${s.slug}-${i + 1}`,
        subjectSlug: s.slug,
        kind: "PRACTICE",
        number: i + 1,
        title: `${s.title} — Test ${i + 1}`,
        difficulty: modalDifficulty(qs),
        durationMin: Math.max(10, qs.length),
        questions: qs,
      });
    });
  }

  // 2. Topic drills — short, focused, recommended from weak areas.
  for (const s of subjects) {
    const byTopic = new Map<string, MCQ[]>();
    for (const q of banks.get(s.slug) ?? []) {
      const t = q.topic || "general";
      if (!byTopic.has(t)) byTopic.set(t, []);
      byTopic.get(t)!.push(q);
    }
    for (const [topic, qs] of [...byTopic.entries()].sort()) {
      if (qs.length < DRILL_SIZE) continue;
      const shuffled = seededShuffle(qs, `drill:${s.slug}:${topic}`);
      chunk(shuffled, DRILL_SIZE, DRILL_SIZE)
        .slice(0, MAX_DRILLS_PER_TOPIC)
        .forEach((batch, i) => {
          tests.push({
            key: `drill-${s.slug}-${topic}-${i + 1}`,
            subjectSlug: s.slug,
            kind: "DRILL",
            topic,
            number: i + 1,
            title: `${topicLabel(topic)} drill ${i + 1}`,
            difficulty: modalDifficulty(batch),
            durationMin: DRILL_SIZE,
            questions: batch,
          });
        });
    }
  }

  // 3. Full-length mocks — exact FPSC weighting, 200 questions in 200 minutes.
  const weighting = subjects.map((s) => ({ slug: s.slug, marks: s.mptMarks }));
  const pools = new Map(
    weighting.map((w) => [w.slug, seededShuffle(banks.get(w.slug) ?? [], `mock:${w.slug}`)]),
  );
  const possible = Math.min(
    MAX_MOCKS,
    ...weighting.map((w) => Math.floor((pools.get(w.slug)?.length ?? 0) / w.marks)),
  );
  for (let m = 0; m < Math.max(0, possible); m++) {
    const paper: MCQ[] = [];
    for (const w of weighting) {
      const pool = pools.get(w.slug) ?? [];
      paper.push(...pool.slice(m * w.marks, (m + 1) * w.marks));
    }
    if (paper.length < MOCK_SIZE) continue;
    tests.push({
      key: `mock-${m + 1}`,
      subjectSlug: null,
      kind: "MOCK",
      number: m + 1,
      title: `Full-Length MPT Mock ${m + 1}`,
      difficulty: "MEDIUM",
      durationMin: MOCK_DURATION,
      questions: seededShuffle(paper, `mock-order:${m}`),
    });
  }

  // 4. Recalled past papers.
  pastPapers().forEach((p, i) => {
    tests.push({
      key: p.key,
      subjectSlug: null,
      kind: "PAST_PAPER",
      number: i + 1,
      title: p.title,
      difficulty: "MEDIUM",
      durationMin: Math.max(20, Math.min(MOCK_DURATION, p.questions.length)),
      paperYear: p.year,
      questions: p.questions,
    });
  });

  return tests;
}

// ─────────────────────────────────────────────
// SEEDING
// ─────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding CSS MPT Prep…\n");

  const tests = buildTests();
  const totalQs = tests.reduce((n, t) => n + t.questions.length, 0);

  const existingUsers = await db().user.count();
  console.log(`👤 ${existingUsers} existing account(s) kept — content only is replaced.\n`);

  // Wipe content (questions + attempts cascade from tests).
  await db().test.deleteMany({});
  await db().subject.deleteMany({ where: { slug: { notIn: SUBJECT_SLUGS } } });

  for (const s of subjects) {
    const subject = await db().subject.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        description: s.description,
        order: s.order,
        mptMarks: s.mptMarks,
      },
      create: s,
    });

    const mine = tests.filter((t) => t.subjectSlug === s.slug);
    for (const t of mine) await createTest(t, subject.id);
    console.log(
      `📚 ${s.title.padEnd(28)} ${String(s.mptMarks).padStart(2)} marks · ` +
        `${mine.filter((t) => t.kind === "PRACTICE").length} tests · ` +
        `${mine.filter((t) => t.kind === "DRILL").length} drills · ` +
        `${mine.reduce((n, t) => n + t.questions.length, 0)} MCQs`,
    );
  }

  for (const t of tests.filter((x) => x.subjectSlug === null)) {
    await createTest(t, null);
  }
  const mocks = tests.filter((t) => t.kind === "MOCK").length;
  const papers = tests.filter((t) => t.kind === "PAST_PAPER").length;
  console.log(`\n🧪 ${mocks} full-length mock(s) · 📄 ${papers} recalled past paper(s)`);

  await seedAccounts();

  console.log("\n✅ Seeding complete.");
  console.log("━".repeat(52));
  console.log(
    `📊 ${totalQs.toLocaleString()} questions across ${tests.length} papers, ${subjects.length} subjects.`,
  );
  console.log("━".repeat(52));
}

async function createTest(t: TestSeed, subjectId: string | null) {
  const test = await db().test.create({
    data: {
      key: t.key,
      subjectId,
      kind: t.kind,
      topic: t.topic ?? null,
      number: t.number,
      title: t.title,
      difficulty: t.difficulty,
      durationMin: t.durationMin,
      paperYear: t.paperYear ?? null,
      isPublished: true,
    },
  });

  await db().question.createMany({
    data: t.questions.map((q, i) => ({
      testId: test.id,
      order: i + 1,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      subjectSlug: q.subjectSlug ?? t.subjectSlug,
      topic: q.topic ?? t.topic ?? null,
    })),
  });
}

async function seedAccounts() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@cssmptprep.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@MPT2026!";
  const demoEmail = process.env.SEED_DEMO_EMAIL ?? "demo@cssmptprep.com";
  const demoPassword = process.env.SEED_DEMO_PASSWORD ?? "Demo@1234";

  await db().user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", isActive: true },
    create: {
      email: adminEmail,
      name: "Site Owner",
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
      mustChangePassword: true,
      isActive: true,
    },
  });

  await db().user.upsert({
    where: { email: demoEmail },
    update: { isActive: true },
    create: {
      email: demoEmail,
      name: "Demo Candidate",
      passwordHash: await bcrypt.hash(demoPassword, 10),
      role: "STUDENT",
      mustChangePassword: true,
      isActive: true,
    },
  });

  console.log(`\n🔑 Admin: ${adminEmail} · Demo: ${demoEmail}`);
  console.log("   Both are forced to change their password on first login.");
}

// Only write to the database when run directly (importing this file for a
// dry-run/validation never touches Postgres).
const isDirectRun =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main()
    .then(async () => {
      await db().$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await db().$disconnect();
      process.exit(1);
    });
}
