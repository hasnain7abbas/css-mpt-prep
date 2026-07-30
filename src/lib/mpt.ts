/**
 * Facts about the FPSC MCQ-Based Preliminary Test (MPT) — the screening stage
 * candidates must clear before they can sit the CSS written examination.
 *
 * Sources: FPSC public notice for CSS Competitive Examination 2027 and the
 * FPSC MPT syllabus. Update EXAM when FPSC announces the next cycle.
 */

export const EXAM = {
  /** Cycle the site is currently pointed at. */
  cycle: "CSS 2027",
  /** Test day, Pakistan Standard Time. */
  testDate: "2026-09-27",
  /** Online application window. */
  applyOpens: "2026-08-03",
  applyCloses: "2026-08-20",
  /** Written examination for those who clear the MPT. */
  writtenExamDate: "2027-01-27",
  totalQuestions: 200,
  durationMin: 200,
  passMarks: 66,
  passPercent: 33,
  negativeMarking: false,
  applyUrl: "https://www.fpsc.gov.pk/",
} as const;

/** Official FPSC weighting — the numbers add up to the 200-mark paper. */
export const MPT_WEIGHTING: { slug: string; marks: number }[] = [
  { slug: "general-science-ability", marks: 60 },
  { slug: "english", marks: 50 },
  { slug: "pakistan-affairs", marks: 20 },
  { slug: "current-affairs", marks: 20 },
  { slug: "islamic-studies", marks: 20 },
  { slug: "urdu", marks: 20 },
  { slug: "general-knowledge", marks: 10 },
];

export const marksFor = (slug: string) =>
  MPT_WEIGHTING.find((w) => w.slug === slug)?.marks ?? 0;

/** Whole days from `from` until the test (negative once it has passed). */
export function daysUntilTest(from: Date = new Date()): number {
  const test = new Date(`${EXAM.testDate}T09:00:00+05:00`);
  const ms = test.getTime() - from.getTime();
  return Math.ceil(ms / 86_400_000);
}

/** Is the FPSC application window open right now? */
export function applicationWindow(now: Date = new Date()) {
  const opens = new Date(`${EXAM.applyOpens}T00:00:00+05:00`);
  const closes = new Date(`${EXAM.applyCloses}T23:59:59+05:00`);
  if (now < opens) return { state: "upcoming" as const, opens, closes };
  if (now > closes) return { state: "closed" as const, opens, closes };
  return { state: "open" as const, opens, closes };
}

/** Did this score clear the 66/200 bar (scaled to any test length)? */
export function clearsCutoff(score: number, total: number) {
  if (total <= 0) return false;
  return score / total >= EXAM.passMarks / EXAM.totalQuestions;
}

/** Marks needed on a test of `total` questions to be on the pass line. */
export function cutoffFor(total: number) {
  return Math.ceil((EXAM.passMarks / EXAM.totalQuestions) * total);
}

export const formatExamDate = (iso: string) =>
  new Date(`${iso}T12:00:00+05:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Karachi",
  });
