// Deterministic MCQ generator. Turns curated factual datasets into questions
// with correct answers + auto-selected plausible distractors + explanations.
// Deterministic (seeded PRNG) so re-seeding produces identical options/order.

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type GenMCQ = {
  order: number;
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  difficulty: Difficulty;
};

// mulberry32 PRNG
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function strSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffle<T>(arr: T[], r: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build one MCQ. `pool` is the set of plausible wrong answers (the correct
 * answer is excluded automatically). Returns null if there aren't 3 distinct
 * distractors available.
 */
export function buildMCQ(opts: {
  seedKey: string;
  text: string;
  correct: string;
  pool: string[];
  explanation: string;
  difficulty?: Difficulty;
}): GenMCQ | null {
  const r = rng(strSeed(opts.seedKey));
  const unique = [...new Set(opts.pool)].filter(
    (x) => x && x.trim() && x !== opts.correct,
  );
  if (unique.length < 3) return null;
  const distractors = shuffle(unique, r).slice(0, 3);
  const options = shuffle([opts.correct, ...distractors], r);
  const correctIndex = options.indexOf(opts.correct) as 0 | 1 | 2 | 3;
  return {
    order: 0,
    text: opts.text,
    options: options as [string, string, string, string],
    correctIndex,
    explanation: opts.explanation,
    difficulty: opts.difficulty ?? "MEDIUM",
  };
}

/** Drop questions whose text duplicates an earlier one (case/space-insensitive). */
export function dedupeByText<T extends { text: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of items) {
    const key = it.text.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

/** Generate "forward" MCQs from [key, value] pairs (ask about key → value). */
export function fromPairs(
  pairs: [string, string][],
  cfg: {
    prompt: (key: string) => string;
    explain: (key: string, value: string) => string;
    difficulty?: Difficulty | ((key: string, value: string) => Difficulty);
    seedTag: string;
  },
): GenMCQ[] {
  const pool = pairs.map(([, v]) => v);
  const out: GenMCQ[] = [];
  for (const [key, value] of pairs) {
    const difficulty =
      typeof cfg.difficulty === "function"
        ? cfg.difficulty(key, value)
        : cfg.difficulty;
    const q = buildMCQ({
      seedKey: `${cfg.seedTag}:${key}`,
      text: cfg.prompt(key),
      correct: value,
      pool,
      explanation: cfg.explain(key, value),
      difficulty,
    });
    if (q) out.push(q);
  }
  return out;
}
