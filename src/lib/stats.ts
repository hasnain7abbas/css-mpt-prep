import { prisma } from "@/lib/db";
import { pct } from "@/lib/utils";

export type SubjectStat = {
  slug: string;
  title: string;
  attempted: number;
  correct: number;
  accuracy: number;
};

export type RecentAttempt = {
  id: string;
  testId: string;
  testTitle: string;
  subjectSlug: string;
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
  recent: RecentAttempt[];
  /** test dates (YYYY-MM-DD) for the streak heatmap */
  activeDays: string[];
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
  // Allow the streak to be "alive" if they practiced today OR yesterday.
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

export async function getUserStats(userId: string): Promise<UserStats> {
  const attempts = await prisma.attempt.findMany({
    where: { userId, submittedAt: { not: null } },
    orderBy: { submittedAt: "desc" },
    include: { test: { include: { subject: true } } },
  });

  let attemptedQuestions = 0;
  let correct = 0;
  const days = new Set<string>();
  const bySubject = new Map<string, SubjectStat>();

  for (const a of attempts) {
    attemptedQuestions += a.total;
    correct += a.score;
    days.add(dayKey(a.submittedAt ?? a.createdAt));

    const slug = a.test.subject.slug;
    const cur =
      bySubject.get(slug) ??
      { slug, title: a.test.subject.title, attempted: 0, correct: 0, accuracy: 0 };
    cur.attempted += a.total;
    cur.correct += a.score;
    bySubject.set(slug, cur);
  }

  const perSubject = [...bySubject.values()].map((s) => ({
    ...s,
    accuracy: pct(s.correct, s.attempted),
  }));

  const weakest =
    perSubject.length > 0
      ? [...perSubject].sort((a, b) => a.accuracy - b.accuracy)[0]
      : null;

  const recent: RecentAttempt[] = attempts.slice(0, 10).map((a) => ({
    id: a.id,
    testId: a.testId,
    testTitle: a.test.title,
    subjectSlug: a.test.subject.slug,
    date: a.submittedAt ?? a.createdAt,
    score: a.score,
    total: a.total,
    accuracy: a.accuracy,
    timeSec:
      a.submittedAt != null
        ? Math.round((a.submittedAt.getTime() - a.startedAt.getTime()) / 1000)
        : null,
  }));

  return {
    totalAttempts: attempts.length,
    attemptedQuestions,
    correct,
    accuracy: pct(correct, attemptedQuestions),
    streak: computeStreak(days),
    perSubject,
    weakest,
    recent,
    activeDays: [...days],
  };
}

/** A test the user started but never submitted — powers "pick up where you left off". */
export async function getInProgressAttempt(userId: string) {
  return prisma.attempt.findFirst({
    where: { userId, submittedAt: null },
    orderBy: { createdAt: "desc" },
    include: { test: { include: { subject: true } } },
  });
}
