// Assembles generated MCQs per subject from the curated factual datasets.
// All questions are original phrasings over public facts, with auto-selected
// plausible distractors. Returns GenMCQ[] (order is assigned later at chunking).

import { buildMCQ, fromPairs, dedupeByText, type GenMCQ } from "./lib/mcq";
import { CAPITALS, CURRENCIES } from "./data/world";
import { ELEMENTS } from "./data/science";
import { BOOKS, INVENTIONS, CURATED_GK, type Curated } from "./data/gk-misc";
import { VOCAB, ONE_WORD, SPELLING } from "./data/english";
import { ACRONYMS, SHORTCUTS, EXTENSIONS, CURATED_COMPUTER } from "./data/computer";
import { PROVINCE_CAPITALS, DAMS, CURATED_PAK } from "./data/pakstudies";
import { CURATED_ISLAMIC } from "./data/islamic";
import {
  PERCENTS,
  AVERAGE_SETS,
  SIMPLE_INTEREST,
  RATIO_PAIRS,
  SPEED_SETS,
  NUM_PAIRS,
  BASE_NUMS,
  PERFECT_SQUARES,
  SIMPLIFY,
  PROFIT_LOSS,
  SERIES,
  CURATED_IQ,
} from "./data/iq-math";

function curatedToGen(items: Curated[]): GenMCQ[] {
  return items.map((c) => ({ ...c, order: 0 }));
}

export function generateGK(): GenMCQ[] {
  const countries = CAPITALS.map(([c]) => c);
  const out: GenMCQ[] = [];

  // Capital of <country>?
  out.push(
    ...fromPairs(CAPITALS, {
      seedTag: "cap-fwd",
      prompt: (c) => `What is the capital of ${c}?`,
      explain: (c, cap) => `${cap} is the capital of ${c}.`,
      difficulty: "MEDIUM",
    }),
  );

  // Of which country is <capital> the capital?
  for (const [country, capital] of CAPITALS) {
    const q = buildMCQ({
      seedKey: `cap-rev:${capital}`,
      text: `${capital} is the capital of which country?`,
      correct: country,
      pool: countries,
      explanation: `${capital} is the capital of ${country}.`,
      difficulty: "MEDIUM",
    });
    if (q) out.push(q);
  }

  // Currency of <country>? (forward only — reverse is ambiguous for shared currencies)
  out.push(
    ...fromPairs(CURRENCIES, {
      seedTag: "cur",
      prompt: (c) => `What is the currency of ${c}?`,
      explain: (c, cur) => `The currency of ${c} is the ${cur}.`,
      difficulty: "MEDIUM",
    }),
  );

  // Element ↔ symbol, both directions.
  const symbols = ELEMENTS.map(([, s]) => s);
  const names = ELEMENTS.map(([n]) => n);
  for (const [name, symbol] of ELEMENTS) {
    const q1 = buildMCQ({
      seedKey: `el-sym:${name}`,
      text: `What is the chemical symbol for ${name}?`,
      correct: symbol,
      pool: symbols,
      explanation: `The chemical symbol for ${name} is ${symbol}.`,
      difficulty: "MEDIUM",
    });
    if (q1) out.push(q1);
    const q2 = buildMCQ({
      seedKey: `el-name:${symbol}`,
      text: `Which element has the chemical symbol '${symbol}'?`,
      correct: name,
      pool: names,
      explanation: `The symbol ${symbol} represents ${name}.`,
      difficulty: "HARD",
    });
    if (q2) out.push(q2);
  }

  // Who wrote <book>?
  out.push(
    ...fromPairs(BOOKS, {
      seedTag: "book",
      prompt: (b) => `Who is the author of "${b}"?`,
      explain: (b, a) => `"${b}" was written by ${a}.`,
      difficulty: "MEDIUM",
    }),
  );

  // Who invented <thing>?
  out.push(
    ...fromPairs(INVENTIONS, {
      seedTag: "inv",
      prompt: (t) => `Who is credited with inventing/discovering ${t}?`,
      explain: (t, p) => `${p} is credited with ${t}.`,
      difficulty: "MEDIUM",
    }),
  );

  out.push(...curatedToGen(CURATED_GK));
  return dedupeByText(out);
}

export function generateEnglish(): GenMCQ[] {
  const out: GenMCQ[] = [];
  const synPool = VOCAB.map(([, syn]) => syn);
  const antPool = VOCAB.map(([, , ant]) => ant);

  for (const [word, syn, ant] of VOCAB) {
    // Synonym: distractors drawn from antonyms (never valid synonyms) → unambiguous.
    const s = buildMCQ({
      seedKey: `syn:${word}`,
      text: `Choose the correct synonym of '${word.toUpperCase()}'.`,
      correct: syn,
      pool: antPool,
      explanation: `'${word}' is closest in meaning to '${syn}'.`,
      difficulty: "MEDIUM",
    });
    if (s) out.push(s);

    // Antonym: distractors drawn from synonyms → unambiguous.
    const a = buildMCQ({
      seedKey: `ant:${word}`,
      text: `Choose the correct antonym of '${word.toUpperCase()}'.`,
      correct: ant,
      pool: synPool,
      explanation: `The antonym of '${word}' is '${ant}'.`,
      difficulty: "MEDIUM",
    });
    if (a) out.push(a);
  }

  // One-word substitution.
  out.push(
    ...fromPairs(ONE_WORD, {
      seedTag: "oneword",
      prompt: (def) => `${def} is called a/an:`,
      explain: (def, word) => `'${word}' means: ${def.toLowerCase()}.`,
      difficulty: "MEDIUM",
    }),
  );

  // Spelling: correct word among misspellings.
  SPELLING.forEach((item, i) => {
    const r = buildMCQ({
      seedKey: `spell:${item.correct}`,
      text: "Choose the correctly spelled word:",
      correct: item.correct,
      pool: item.wrong,
      explanation: `The correct spelling is '${item.correct}'.`,
      difficulty: "HARD",
    });
    // Every spelling prompt is otherwise identical, so tag each with its number
    // to keep them distinct through the dedupe-by-text step.
    if (r) out.push({ ...r, text: `Choose the correctly spelled word (Q.${i + 1}):` });
  });

  return dedupeByText(out);
}

export function generateComputer(): GenMCQ[] {
  const out: GenMCQ[] = [];
  const fullForms = ACRONYMS.map(([, f]) => f);

  for (const [acr, full] of ACRONYMS) {
    const q = buildMCQ({
      seedKey: `acr:${acr}:${full}`,
      text: `What does '${acr}' stand for?`,
      correct: full,
      pool: fullForms,
      explanation: `${acr} stands for ${full}.`,
      difficulty: "EASY",
    });
    if (q) out.push(q);
  }

  out.push(
    ...fromPairs(SHORTCUTS, {
      seedTag: "sc",
      prompt: (keys) => `Which action does the shortcut '${keys}' perform?`,
      explain: (keys, action) => `'${keys}' performs: ${action}.`,
      difficulty: "EASY",
    }),
  );

  out.push(
    ...fromPairs(EXTENSIONS, {
      seedTag: "ext",
      prompt: (ext) => `A file with the extension '${ext}' is a:`,
      explain: (ext, type) => `'${ext}' indicates a ${type}.`,
      difficulty: "EASY",
    }),
  );

  out.push(...curatedToGen(CURATED_COMPUTER));
  return dedupeByText(out);
}

export function generatePakStudies(): GenMCQ[] {
  const out: GenMCQ[] = [];

  out.push(
    ...fromPairs(PROVINCE_CAPITALS, {
      seedTag: "prov",
      prompt: (p) => `What is the provincial capital of ${p}?`,
      explain: (p, cap) => `${cap} is the capital of ${p}.`,
      difficulty: "MEDIUM",
    }),
  );

  out.push(
    ...fromPairs(DAMS, {
      seedTag: "dam",
      prompt: (d) => `${d} is built on which river?`,
      explain: (d, r) => `${d} is built on the ${r} River.`,
      difficulty: "MEDIUM",
    }),
  );

  out.push(...curatedToGen(CURATED_PAK));
  return dedupeByText(out);
}

export function generateIslamic(): GenMCQ[] {
  return dedupeByText(curatedToGen(CURATED_ISLAMIC));
}

// ── IQ & Mathematics ─────────────────────────────────────────────────────────

// Greatest common divisor / least common multiple.
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

// Trim a number to a clean string (no trailing ".00").
function num(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(2)));
}

// Build a numeric MCQ: the answer plus plausible nearby distractors. `extra`
// adds problem-specific wrong answers (e.g. common mistakes). buildMCQ picks 3
// distinct distractors deterministically, so a generous pool is fine.
function numericMCQ(opts: {
  seedKey: string;
  text: string;
  answer: number;
  explanation: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  extra?: number[];
}): GenMCQ | null {
  const a = opts.answer;
  const candidates = new Set<number>();
  const offsets = [1, 2, 3, 5, 10, -1, -2, -3, -5, -10];
  for (const d of offsets) {
    const v = a + d;
    if (v > 0 && v !== a) candidates.add(v);
  }
  candidates.add(Math.round(a * 2));
  candidates.add(Math.round(a / 2));
  candidates.add(Math.round(a * 1.5));
  for (const e of opts.extra ?? []) {
    if (e > 0 && e !== a) candidates.add(e);
  }
  const pool = [...candidates].filter((v) => v > 0 && v !== a).map(num);
  return buildMCQ({
    seedKey: opts.seedKey,
    text: opts.text,
    correct: num(a),
    pool,
    explanation: opts.explanation,
    difficulty: opts.difficulty ?? "MEDIUM",
  });
}

export function generateIQMath(): GenMCQ[] {
  const out: GenMCQ[] = [];
  const push = (q: GenMCQ | null) => {
    if (q) out.push(q);
  };

  // Percentages.
  for (const [p, n] of PERCENTS) {
    const ans = (p * n) / 100;
    push(
      numericMCQ({
        seedKey: `pct:${p}:${n}`,
        text: `What is ${p}% of ${n}?`,
        answer: ans,
        explanation: `${p}% of ${n} = (${p} ÷ 100) × ${n} = ${num(ans)}.`,
        difficulty: "EASY",
        extra: [Math.round((n * 100) / p), n - ans],
      }),
    );
  }

  // Averages.
  AVERAGE_SETS.forEach((set, i) => {
    const sum = set.reduce((s, x) => s + x, 0);
    const ans = sum / set.length;
    push(
      numericMCQ({
        seedKey: `avg:${i}:${set.join(",")}`,
        text: `What is the average of ${set.join(", ")}?`,
        answer: ans,
        explanation: `Sum = ${sum}, count = ${set.length}, average = ${sum} ÷ ${set.length} = ${num(ans)}.`,
        difficulty: "MEDIUM",
        extra: [sum],
      }),
    );
  });

  // Simple interest.
  for (const [P, R, T] of SIMPLE_INTEREST) {
    const ans = (P * R * T) / 100;
    push(
      numericMCQ({
        seedKey: `si:${P}:${R}:${T}`,
        text: `Find the simple interest on Rs. ${P} at ${R}% per annum for ${T} year${T > 1 ? "s" : ""}.`,
        answer: ans,
        explanation: `SI = (P × R × T) ÷ 100 = (${P} × ${R} × ${T}) ÷ 100 = Rs. ${num(ans)}.`,
        difficulty: "MEDIUM",
        extra: [P + ans, Math.round((P * R) / 100)],
      }),
    );
  }

  // Ratio simplification (answer is a string "x:y").
  for (const [a, b] of RATIO_PAIRS) {
    const g = gcd(a, b);
    const correct = `${a / g}:${b / g}`;
    const pool = [
      `${a}:${b}`,
      `${b / g}:${a / g}`,
      `${a / g + 1}:${b / g}`,
      `${a / g}:${b / g + 1}`,
      `${Math.round(a / g) + 2}:${Math.round(b / g)}`,
      `2:3`,
      `1:2`,
      `3:4`,
    ];
    push(
      buildMCQ({
        seedKey: `ratio:${a}:${b}`,
        text: `Simplify the ratio ${a} : ${b}.`,
        correct,
        pool,
        explanation: `Divide both terms by their HCF (${g}): ${a} : ${b} = ${correct}.`,
        difficulty: "MEDIUM",
      }),
    );
  }

  // Speed = distance ÷ time.
  for (const [dist, time] of SPEED_SETS) {
    const ans = dist / time;
    push(
      numericMCQ({
        seedKey: `speed:${dist}:${time}`,
        text: `A vehicle covers ${dist} km in ${time} hours. What is its speed in km/h?`,
        answer: ans,
        explanation: `Speed = distance ÷ time = ${dist} ÷ ${time} = ${num(ans)} km/h.`,
        difficulty: "MEDIUM",
        extra: [dist * time, dist - time],
      }),
    );
  }

  // LCM and HCF for each pair.
  for (const [a, b] of NUM_PAIRS) {
    const h = gcd(a, b);
    const l = lcm(a, b);
    push(
      numericMCQ({
        seedKey: `hcf:${a}:${b}`,
        text: `What is the HCF (greatest common divisor) of ${a} and ${b}?`,
        answer: h,
        explanation: `The HCF of ${a} and ${b} is ${h}.`,
        difficulty: "MEDIUM",
        extra: [l, a, b],
      }),
    );
    push(
      numericMCQ({
        seedKey: `lcm:${a}:${b}`,
        text: `What is the LCM (least common multiple) of ${a} and ${b}?`,
        answer: l,
        explanation: `The LCM of ${a} and ${b} is ${l}.`,
        difficulty: "MEDIUM",
        extra: [h, a * b],
      }),
    );
  }

  // Squares and cubes.
  for (const n of BASE_NUMS) {
    push(
      numericMCQ({
        seedKey: `sq:${n}`,
        text: `What is the square of ${n} (i.e. ${n}²)?`,
        answer: n * n,
        explanation: `${n}² = ${n} × ${n} = ${n * n}.`,
        difficulty: "EASY",
        extra: [n * n * n, n + n],
      }),
    );
    push(
      numericMCQ({
        seedKey: `cube:${n}`,
        text: `What is the cube of ${n} (i.e. ${n}³)?`,
        answer: n * n * n,
        explanation: `${n}³ = ${n} × ${n} × ${n} = ${n * n * n}.`,
        difficulty: "MEDIUM",
        extra: [n * n, n * 3],
      }),
    );
  }

  // Square roots of perfect squares.
  for (const sq of PERFECT_SQUARES) {
    const root = Math.round(Math.sqrt(sq));
    push(
      numericMCQ({
        seedKey: `sqrt:${sq}`,
        text: `What is the square root of ${sq} (i.e. √${sq})?`,
        answer: root,
        explanation: `√${sq} = ${root}, because ${root} × ${root} = ${sq}.`,
        difficulty: "MEDIUM",
        extra: [sq / 2, root * root],
      }),
    );
  }

  // BODMAS / simplification.
  SIMPLIFY.forEach(([expr, ans], i) => {
    push(
      numericMCQ({
        seedKey: `simp:${i}:${expr}`,
        text: `Simplify: ${expr}`,
        answer: ans,
        explanation: `Applying order of operations (BODMAS), ${expr} = ${ans}.`,
        difficulty: "MEDIUM",
      }),
    );
  });

  // Profit / loss percentage.
  for (const [cp, sp] of PROFIT_LOSS) {
    const profit = sp >= cp;
    const pct = (Math.abs(sp - cp) / cp) * 100;
    const ans = Math.round(pct);
    push(
      numericMCQ({
        seedKey: `pl:${cp}:${sp}`,
        text: `An item bought for Rs. ${cp} is sold for Rs. ${sp}. What is the ${profit ? "profit" : "loss"} percentage?`,
        answer: ans,
        explanation: `${profit ? "Profit" : "Loss"} = |${sp} − ${cp}| = ${Math.abs(sp - cp)}; percentage = (${Math.abs(sp - cp)} ÷ ${cp}) × 100 = ${ans}%.`,
        difficulty: "MEDIUM",
        extra: [Math.abs(sp - cp)],
      }),
    );
  }

  // Curated series + reasoning MCQs.
  out.push(...curatedToGen(SERIES));
  out.push(...curatedToGen(CURATED_IQ));

  return dedupeByText(out);
}

export function generatedBySlug(): Record<string, GenMCQ[]> {
  return {
    "english": generateEnglish(),
    "general-knowledge": generateGK(),
    "pakistan-studies": generatePakStudies(),
    "computer": generateComputer(),
    "islamic-studies": generateIslamic(),
    "iq-math": generateIQMath(),
  };
}
