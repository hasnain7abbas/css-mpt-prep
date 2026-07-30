#!/usr/bin/env node
/**
 * Compile the verified banks in content/verified/ into prisma/data/verified/,
 * which is what the seed reads (and what gets committed — the content/ working
 * area with raw generations and verifier answers stays out of the repo).
 *
 * Usage: node scripts/compile-bank.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "content/verified");
const DEST = join(ROOT, "prisma/data/verified");
if (!existsSync(DEST)) mkdirSync(DEST, { recursive: true });

const SUBJECTS = [
  "general-science-ability",
  "english",
  "pakistan-affairs",
  "current-affairs",
  "islamic-studies",
  "urdu",
  "general-knowledge",
];

const PAPER_TITLES = {
  "paper-mpt-2025": { title: "MPT 2025 — Recalled Paper (CSS 2025)", year: 2025 },
  "paper-mpt-2026": { title: "MPT 2026 — Recalled Paper (CSS 2026)", year: 2026 },
};

if (!existsSync(SRC)) {
  console.error("No content/verified directory — run scripts/mcq-merge.mjs first.");
  process.exit(1);
}

const summary = [];

for (const file of readdirSync(SRC).filter((f) => f.endsWith(".json"))) {
  const subject = file.replace(/\.json$/, "");
  const rows = JSON.parse(readFileSync(join(SRC, file), "utf8"));
  if (!Array.isArray(rows) || rows.length === 0) continue;

  if (subject === "past-papers") {
    const out = rows.map((q) => {
      const meta = PAPER_TITLES[q.source] || {};
      return {
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        difficulty: q.difficulty || "MEDIUM",
        // For a past paper `topic` carries the MPT subject the item belongs to.
        topic: q.topic,
        subjectSlug: SUBJECTS.includes(q.topic) ? q.topic : undefined,
        source: q.source,
        paperYear: meta.year,
        paperTitle: meta.title,
      };
    });
    writeFileSync(join(DEST, "past-papers.json"), JSON.stringify(out, null, 1));
    summary.push({ bank: "past-papers", questions: out.length });
    continue;
  }

  if (!SUBJECTS.includes(subject)) {
    console.warn(`  ! skipping unknown subject bank: ${subject}`);
    continue;
  }

  const out = rows.map((q) => ({
    text: q.text,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    difficulty: q.difficulty || "MEDIUM",
    topic: q.topic || "general",
  }));
  writeFileSync(join(DEST, `${subject}.json`), JSON.stringify(out, null, 1));
  summary.push({ bank: subject, questions: out.length });
}

console.table(summary);
console.log(`Compiled ${summary.reduce((n, s) => n + s.questions, 0)} verified questions into prisma/data/verified/`);
