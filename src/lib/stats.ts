import { prisma } from "@/lib/db";
import { pct } from "@/lib/utils";

export type SubjectStat = {
  slug: string;
  title: string;
  attempted: number;
  correct: number;
  accuracy: number;
};

export type TopicStat = {
  topic: string;
  subjectSlug: string;
  attempted: number;
  correct: number;
  accuracy: number;
};

export type RecentAttempt = {
  id: string;
  testId: string;
  testTitle: string;
  kind: string;
  subjectSlug: string | null;
  date: Date;
  score: number;
  total: number;
  accuracy: number;
  timeSec: number | null;
};

export type UserStats = {
  totalAttempts: number;
  attemptedQuestions: number;
  correct: number;
  accuracy: number;
  streak: number;
  perSubject: SubjectStat[];
  weakest: SubjectStat | null;
  weakTopics: TopicStat[];
  recent: RecentAttempt[];
  /** attempt dates (YYYY-MM-DD) for the streak heatmap */
  activeDays: string[];
  /** best full-length mock, for the pass-line gauge */
  bestMock: { score: number; total: number; accuracy: number } | null;
};

type StoredAnswer = {
  questionId: string;
  selectedIndex: number | null;
  markedForReview?: boolean;
};

const dayKey = (d: Date) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(
    x.getDate(),
  ).padStart(2, "0")}`;
};

/** Count consecutive days (ending today or yesterday) that have an attempt. */
function computeStreak(days: Set<string>): number {
  if (days.size === 0) return 0;
  const cursor = new Date();
  // The streak stays alive if they practised today OR yesterday.
  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * Per-subject and per-topic accuracy is computed from the questions themselves
 * (each carries `subjectSlug`), so a mixed 200-question mock feeds every
 * subject it touches instead of counting as one undifferentiated attempt.
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  const attempts = await prisma.attempt.findMany({
    where: { userId, submittedAt: { not: null } },
    orderBy: { submittedAt: "desc" },
    include: {
      test: {
        select: {
          title: true,
          kind: true,
          subject: { select: { slug: true, title: true } },
          questions: {
            select: { id: true, correctIndex: true, subjectSlug: true, topic: true },
          },
        },
      },
    },
  });

  const subjectTitles = new Map(
    (await prisma.subject.findMany({ select: { slug: true, title: true } })).map((s) => [
      s.slug,
      s.title,
    ]),
  );

  let attemptedQuestions = 0;
  let correct = 0;
  const days = new Set<string>();
  const bySubject = new Map<string, SubjectStat>();
  const byTopic = new Map<string, TopicStat>();

  for (const a of attempts) {
    attemptedQuestions += a.total;
    correct += a.score;
    days.add(dayKey(a.submittedAt ?? a.createdAt));

    const answers = (a.answers as unknown as StoredAnswer[]) ?? [];
    const chosen = new Map(answers.map((x) => [x.questionId, x.selectedIndex]));

    for (const q of a.test.questions) {
      const slug = q.subjectSlug ?? a.test.subject?.slug;
      if (!slug) continue;
      const picked = chosen.get(q.id);
      const isCorrect = picked !== null && picked !== undefined && picked === q.correctIndex;

      const s: SubjectStat = bySubject.get(slug) ?? {
        slug,
        title: subjectTitles.get(slug) ?? a.test.subject?.title ?? slug,
        attempted: 0,
        correct: 0,
        accuracy: 0,
      };
      s.attempted += 1;
      if (isCorrect) s.correct += 1;
      bySubject.set(slug, s);

      if (q.topic) {
        const key = `${slug}:${q.topic}`;
        const t: TopicStat = byTopic.get(key) ?? {
          topic: q.topic,
          subjectSlug: slug,
          attempted: 0,
          correct: 0,
          accuracy: 0,
        };
        t.attempted += 1;
        if (isCorrect) t.correct += 1;
        byTopic.set(key, t);
      }
    }
  }

  const perSubject = [...bySubject.values()].map((s) => ({
    ...s,
    accuracy: pct(s.correct, s.attempted),
  }));

  const weakest =
    perSubject.length > 0 ? [...perSubject].sort((a, b) => a.accuracy - b.accuracy)[0] : null;

  // A topic needs a reasonable sample before we call it a weakness.
  const weakTopics = [...byTopic.values()]
    .filter((t) => t.attempted >= 5)
    .map((t) => ({ ...t, accuracy: pct(t.correct, t.attempted) }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 6);

  const recent: RecentAttempt[] = attempts.slice(0, 10).map((a) => ({
    id: a.id,
    testId: a.testId,
    testTitle: a.test.title,
    kind: a.test.kind,
    subjectSlug: a.test.subject?.slug ?? null,
    date: a.submittedAt ?? a.createdAt,
    score: a.score,
    total: a.total,
    accuracy: a.accuracy,
    timeSec:
      a.submittedAt != null
        ? Math.round((a.submittedAt.getTime() - a.startedAt.getTime()) / 1000)
        : null,
  }));

  const best = attempts
    .filter((a) => a.test.kind === "MOCK")
    .sort((a, b) => b.accuracy - a.accuracy)[0];

  return {
    totalAttempts: attempts.length,
    attemptedQuestions,
    correct,
    accuracy: pct(correct, attemptedQuestions),
    streak: computeStreak(days),
    perSubject,
    weakest,
    weakTopics,
    recent,
    activeDays: [...days],
    bestMock: best ? { score: best.score, total: best.total, accuracy: best.accuracy } : null,
  };
}

/** A test the user started but never submitted — powers "resume". */
export async function getInProgressAttempt(userId: string) {
  return prisma.attempt.findFirst({
    where: { userId, submittedAt: null },
    orderBy: { createdAt: "desc" },
    include: { test: { include: { subject: true } } },
  });
}
