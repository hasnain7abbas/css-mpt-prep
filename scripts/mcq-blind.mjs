#!/usr/bin/env node
/**
 * Print a slice of an MCQ unit file WITHOUT the answers, so a verifier agent
 * can answer each question independently from its own knowledge.
 *
 * Usage: node scripts/mcq-blind.mjs content/raw/<subject>/<unit>.json [start] [count]
 */
import { readFileSync } from "node:fs";

const [, , file, startArg = "0", countArg = "1000"] = process.argv;
if (!file) {
  console.error("usage: node scripts/mcq-blind.mjs <unit.json> [start] [count]");
  process.exit(1);
}

const unit = JSON.parse(readFileSync(file, "utf8"));
const start = Number(startArg);
const count = Number(countArg);
const slice = unit.questions.slice(start, start + count);

console.log(`UNIT: ${unit.unit}`);
console.log(`SUBJECT: ${unit.subject}`);
console.log(`RANGE: indices ${start}..${start + slice.length - 1} (${slice.length} questions)`);
console.log("");

const LETTERS = ["A", "B", "C", "D"];
slice.forEach((q, n) => {
  const i = start + n;
  console.log(`[${i}] ${q.text}`);
  q.options.forEach((o, k) => console.log(`   ${LETTERS[k]}. ${o}`));
  console.log("");
});
