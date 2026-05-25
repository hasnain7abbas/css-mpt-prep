"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import { pct } from "@/lib/utils";

export type AnswerInput = {
  questionId: string;
  selectedIndex: number | null;
  markedForReview: boolean;
};

/** Begin (or resume) an attempt, then render the quiz runner. */
export async function startAttempt(testId: string) {
  const session = await requireUser();
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: { _count: { select: { questions: true } } },
  });
  if (!test || !test.isPublished) redirect("/subjects");

  const existing = await prisma.attempt.findFirst({
    where: { userId: session.user.id, testId, submittedAt: null },
  });

  if (!existing) {
    await prisma.attempt.create({
      data: {
        userId: session.user.id,
        testId,
        answers: [],
        score: 0,
        total: test._count.questions,
        accuracy: 0,
        startedAt: new Date(),
      },
    });
  }

  revalidatePath(`/tests/${testId}`);
  redirect(`/tests/${testId}`);
}

/** Debounced autosave of in-progress answers. Returns silently on conflict. */
export async function saveProgress(attemptId: string, answers: AnswerInput[]) {
  const session = await requireUser();
  const attempt = await prisma.attempt.findUnique({ where: { id: attemptId } });
  if (!attempt || attempt.userId !== session.user.id || attempt.submittedAt) {
    return { ok: false };
  }
  await prisma.attempt.update({
    where: { id: attemptId },
    data: { answers: answers as object[] },
  });
  return { ok: true };
}

/** Finalize an attempt: score it server-side (authoritative) and redirect to the result. */
export async function submitAttempt(attemptId: string, answers: AnswerInput[]) {
  const session = await requireUser();
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: { test: { include: { questions: true } } },
  });
  if (!attempt || attempt.userId !== session.user.id) redirect("/dashboard");
  if (attempt!.submittedAt) redirect(`/tests/${attempt!.testId}/result?attempt=${attemptId}`);

  const questions = attempt!.test.questions;
  let score = 0;
  const normalized: AnswerInput[] = questions.map((q) => {
    const a = answers.find((x) => x.questionId === q.id);
    const selectedIndex =
      a && typeof a.selectedIndex === "number" ? a.selectedIndex : null;
    if (selectedIndex !== null && selectedIndex === q.correctIndex) score++;
    return {
      questionId: q.id,
      selectedIndex,
      markedForReview: a?.markedForReview ?? false,
    };
  });

  const total = questions.length;
  await prisma.attempt.update({
    where: { id: attemptId },
    data: {
      answers: normalized as object[],
      score,
      total,
      accuracy: pct(score, total),
      submittedAt: new Date(),
    },
  });

  redirect(`/tests/${attempt!.testId}/result?attempt=${attemptId}`);
}
