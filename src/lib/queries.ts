import { prisma } from "@/lib/db";

export type Options = [string, string, string, string];

/** Parse the Json `options` column back into a typed 4-tuple. */
export function parseOptions(raw: unknown): Options {
  if (Array.isArray(raw)) return raw.map(String) as Options;
  return ["", "", "", ""];
}

export type TestKind = "PRACTICE" | "DRILL" | "MOCK" | "PAST_PAPER";

/** Subjects with practice-test and question counts, for the catalog grid. */
export async function getSubjectsOverview() {
  const subjects = await prisma.subject.findMany({
    orderBy: { order: "asc" },
    include: {
      tests: {
        where: { isPublished: true },
        select: { kind: true, _count: { select: { questions: true } } },
      },
    },
  });

  return subjects.map((s) => {
    const practice = s.tests.filter((t) => t.kind === "PRACTICE");
    const drills = s.tests.filter((t) => t.kind === "DRILL");
    return {
      id: s.id,
      slug: s.slug,
      title: s.title,
      description: s.description,
      mptMarks: s.mptMarks,
      testCount: practice.length,
      drillCount: drills.length,
      questionCount: practice.reduce((n, t) => n + t._count.questions, 0),
    };
  });
}

/** A subject with its practice tests and topic drills, for /subjects/[slug]. */
export async function getSubjectWithTests(slug: string) {
  const subject = await prisma.subject.findUnique({
    where: { slug },
    include: {
      tests: {
        where: { isPublished: true },
        orderBy: [{ kind: "asc" }, { number: "asc" }],
        include: { _count: { select: { questions: true, attempts: true } } },
      },
    },
  });
  if (!subject) return null;

  const shape = (t: (typeof subject.tests)[number]) => ({
    id: t.id,
    number: t.number,
    title: t.title,
    kind: t.kind as TestKind,
    topic: t.topic,
    difficulty: t.difficulty,
    durationMin: t.durationMin,
    questionCount: t._count.questions,
    attemptsCount: t._count.attempts,
    createdAt: t.createdAt,
  });

  const tests = subject.tests.filter((t) => t.kind === "PRACTICE").map(shape);
  const drills = subject.tests.filter((t) => t.kind === "DRILL").map(shape);

  return {
    id: subject.id,
    slug: subject.slug,
    title: subject.title,
    description: subject.description,
    mptMarks: subject.mptMarks,
    tests,
    drills,
    questionCount: tests.reduce((n, t) => n + t.questionCount, 0),
  };
}

/** Full-length 200-question mocks. */
export async function getMocks() {
  const mocks = await prisma.test.findMany({
    where: { kind: "MOCK", isPublished: true },
    orderBy: { number: "asc" },
    include: { _count: { select: { questions: true, attempts: true } } },
  });
  return mocks.map((t) => ({
    id: t.id,
    number: t.number,
    title: t.title,
    durationMin: t.durationMin,
    questionCount: t._count.questions,
    attemptsCount: t._count.attempts,
  }));
}

/** Recalled FPSC past papers, newest year first. */
export async function getPastPapers() {
  const papers = await prisma.test.findMany({
    where: { kind: "PAST_PAPER", isPublished: true },
    orderBy: [{ paperYear: "desc" }, { number: "asc" }],
    include: { _count: { select: { questions: true, attempts: true } } },
  });
  return papers.map((t) => ({
    id: t.id,
    title: t.title,
    year: t.paperYear,
    durationMin: t.durationMin,
    questionCount: t._count.questions,
    attemptsCount: t._count.attempts,
  }));
}

/** Drills for one subject — powers weak-area recommendations. */
export async function getDrillsForSubject(subjectSlug: string, limit = 6) {
  const drills = await prisma.test.findMany({
    where: { kind: "DRILL", isPublished: true, subject: { slug: subjectSlug } },
    orderBy: [{ topic: "asc" }, { number: "asc" }],
    take: limit,
    include: { _count: { select: { questions: true } } },
  });
  return drills.map((t) => ({
    id: t.id,
    title: t.title,
    topic: t.topic,
    durationMin: t.durationMin,
    questionCount: t._count.questions,
  }));
}

/** Full test with ordered questions (quiz engine + result review). */
export async function getTestWithQuestions(testId: string) {
  return prisma.test.findUnique({
    where: { id: testId },
    include: {
      subject: true,
      questions: { orderBy: { order: "asc" } },
    },
  });
}

/** Headline counts for the landing page. */
export async function getBankStats() {
  const [questions, mocks, papers, subjects, drills] = await Promise.all([
    prisma.question.count(),
    prisma.test.count({ where: { kind: "MOCK", isPublished: true } }),
    prisma.test.count({ where: { kind: "PAST_PAPER", isPublished: true } }),
    prisma.subject.count(),
    prisma.test.count({ where: { kind: "DRILL", isPublished: true } }),
  ]);
  return { questions, mocks, papers, subjects, drills };
}
