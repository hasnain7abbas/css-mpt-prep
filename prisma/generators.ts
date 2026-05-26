// Assembles generated MCQs per subject from the curated factual datasets.
// All questions are original phrasings over public facts, with auto-selected
// plausible distractors. Returns GenMCQ[] (order is assigned later at chunking).

import { buildMCQ, fromPairs, dedupeByText, type GenMCQ, type Difficulty } from "./lib/mcq";
import { CAPITALS, CURRENCIES } from "./data/world";
import { ELEMENTS } from "./data/science";
import { BOOKS, INVENTIONS, CURATED_GK, type Curated } from "./data/gk-misc";
import { VOCAB, ONE_WORD, SPELLING } from "./data/english";
import { ACRONYMS, SHORTCUTS, EXTENSIONS, CURATED_COMPUTER } from "./data/computer";
import { PROVINCE_CAPITALS, DAMS, CURATED_PAK } from "./data/pakstudies";
import { CURATED_ISLAMIC } from "./data/islamic";

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

export function generatedBySlug(): Record<string, GenMCQ[]> {
  return {
    "english": generateEnglish(),
    "general-knowledge": generateGK(),
    "pakistan-studies": generatePakStudies(),
    "computer": generateComputer(),
    "islamic-studies": generateIslamic(),
  };
}
