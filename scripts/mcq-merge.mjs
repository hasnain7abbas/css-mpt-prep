#!/usr/bin/env node
/**
 * Compare independent verifier answers against each unit's stated correctIndex.
 *
 *   content/raw/<subject>/<unit>.json          generated questions (with answers)
 *   content/answers/<unit>.<verifier>.json     a verifier's blind answers
 *
 * A question is KEPT only when every verifier that saw it chose the same option
 * the generator marked correct. Anything else lands in content/flagged/ for a
 * separate adjudication pass — it is never silently kept.
 *
 * Usage: node scripts/mcq-merge.mjs [subjectFilter]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const RAW = join(ROOT, "content/raw");
const ANS = join(ROOT, "content/answers");
const OUT = join(ROOT, "content/verified");
const FLAG = join(ROOT, "content/flagged");
const REPORTS = join(ROOT, "content/reports");
for (const d of [OUT, FLAG, REPORTS]) if (!existsSync(d)) mkdirSync(d, { recursive: true });

const subjectFilter = process.argv[2];

const norm = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();

/** Load every verifier answer file for a unit → Map<index, number[]> */
function answersFor(unitName) {
  const byIndex = new Map();
  if (!existsSync(ANS)) return byIndex;
  for (const f of readdirSync(ANS)) {
    if (!f.startsWith(`${unitName}.`) || !f.endsWith(".json")) continue;
    let payload;
    try {
      payload = JSON.parse(readFileSync(join(ANS, f), "utf8"));
    } catch {
      console.error(`  ! unreadable answer file: ${f}`);
      continue;
    }
    const list = Array.isArray(payload) ? payload : payload.answers || [];
    for (const a of list) {
      const i = a.i ?? a.index;
      const choice = a.a ?? a.answer ?? a.correctIndex;
      if (typeof i !== "number" || typeof choice !== "number") continue;
      if (!byIndex.has(i)) byIndex.set(i, []);
      byIndex.get(i).push(choice);
    }
  }
  return byIndex;
}

function structurallyValid(q) {
  if (!q || typeof q.text !== "string" || q.text.trim().length < 8) return "bad text";
  if (!Array.isArray(q.options) || q.options.length !== 4) return "needs exactly 4 options";
  if (q.options.some((o) => typeof o !== "string" || !o.trim())) return "empty option";
  if (new Set(q.options.map(norm)).size !== 4) return "duplicate options";
  if (![0, 1, 2, 3].includes(q.correctIndex)) return "correctIndex out of range";
  if (typeof q.explanation !== "string" || q.explanation.trim().length < 10) return "missing explanation";
  return null;
}

const globalSeen = new Map(); // normalised text → unit it first appeared in
const summary = [];

const subjects = existsSync(RAW)
  ? readdirSync(RAW).filter((s) => !subjectFilter || s === subjectFilter)
  : [];

for (const subject of subjects) {
  const dir = join(RAW, subject);
  const kept = [];
  const flagged = [];
  let total = 0;
  let unverified = 0;
  let structural = 0;
  let dupes = 0;

  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
    const unit = JSON.parse(readFileSync(join(dir, file), "utf8"));
    const votes = answersFor(unit.unit);

    unit.questions.forEach((q, i) => {
      total++;
      const problem = structurallyValid(q);
      if (problem) {
        structural++;
        flagged.push({ unit: unit.unit, index: i, reason: problem, question: q });
        return;
      }
      const key = norm(q.text);
      if (globalSeen.has(key)) {
        dupes++;
        return;
      }
      const cast = votes.get(i) || [];
      if (cast.length === 0) {
        unverified++;
        flagged.push({ unit: unit.unit, index: i, reason: "no verifier answer", question: q });
        return;
      }
      const disagree = cast.filter((c) => c !== q.correctIndex);
      if (disagree.length > 0) {
        flagged.push({
          unit: unit.unit,
          index: i,
          reason: "verifier disagreement",
          claimed: q.correctIndex,
          verifierChoices: cast,
          question: q,
        });
        return;
      }
      globalSeen.set(key, unit.unit);
      kept.push({
        text: q.text.trim(),
        options: q.options.map((o) => o.trim()),
        correctIndex: q.correctIndex,
        explanation: q.explanation.trim(),
        difficulty: q.difficulty || "MEDIUM",
        topic: q.topic || unit.topic || "general",
        source: unit.unit,
      });
    });
  }

  writeFileSync(join(OUT, `${subject}.json`), JSON.stringify(kept, null, 1));
  writeFileSync(join(FLAG, `${subject}.json`), JSON.stringify(flagged, null, 1));
  summary.push({ subject, total, kept: kept.length, flagged: flagged.length, unverified, structural, dupes });
}

console.table(summary);
writeFileSync(join(REPORTS, "merge-summary.json"), JSON.stringify(summary, null, 2));
const totals = summary.reduce(
  (acc, s) => ({ total: acc.total + s.total, kept: acc.kept + s.kept, flagged: acc.flagged + s.flagged }),
  { total: 0, kept: 0, flagged: 0 },
);
console.log(
  `\nTOTAL generated ${totals.total} · kept ${totals.kept} · flagged ${totals.flagged}` +
    ` (${totals.total ? Math.round((totals.kept / totals.total) * 100) : 0}% pass rate)`,
);
