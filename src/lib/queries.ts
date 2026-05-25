import { prisma } from "@/lib/db";

export type Options = [string, string, string, string];

/** Parse the Json `options` column back into a typed 4-tuple. */
export function parseOptions(raw: unknown): Options {
  if (Array.isArray(raw)) return raw.map(String) as Options;
  return ["", "", "", ""];
}

/** Subjects with published-test counts + total question counts, for catalog grids. */
export async function getSubjectsOverview() {
  const subjects = await prisma.subject.findMany({
    orderBy: { order: "asc" },
    include: {
      tests: {
        where: { isPublished: true },
        select: { _count: { select: { questions: true } } },
      },
    },
  });

  return subjects.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.description,
    testCount: s.tests.length,
    questionCount: s.tests.reduce((n, t) => n + t._count.questions, 0),
  }));
}

/** A subject + its published tests (with question counts), for /subjects/[slug]. */
export async function getSubjectWithTests(slug: string) {
  const subject = await prisma.subject.findUnique({
    where: { slug },
    include: {
      tests: {
        where: { isPublished: true },
        orderBy: { number: "asc" },
        include: { _count: { select: { questions: true, attempts: true } } },
      },
    },
  });
  if (!subject) return null;

  const tests = subject.tests.map((t) => ({
    id: t.id,
    number: t.number,
    title: t.title,
    difficulty: t.difficulty,
    durationMin: t.durationMin,
    questionCount: t._count.questions,
    attemptsCount: t._count.attempts,
    createdAt: t.createdAt,
  }));

  return {
    id: subject.id,
    slug: subject.slug,
    title: subject.title,
    description: subject.description,
    tests,
    questionCount: tests.reduce((n, t) => n + t.questionCount, 0),
  };
}

/** Full test with ordered questions (used by the quiz engine + result review). */
export async function getTestWithQuestions(testId: string) {
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      subject: true,
      questions: { orderBy: { order: "asc" } },
    },
  });
  if (!test) return null;
  return test;
}
