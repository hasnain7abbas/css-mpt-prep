import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Flame, ListChecks, Play, Target } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getUserStats, getInProgressAttempt } from "@/lib/stats";
import { getSubjectsOverview, getSubjectWithTests } from "@/lib/queries";
import { firstName } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/app/StatCard";
import { SubjectCard } from "@/components/app/SubjectCard";
import { TestCard } from "@/components/app/TestCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const [stats, inProgress, subjects] = await Promise.all([
    getUserStats(user.id),
    getInProgressAttempt(user.id),
    getSubjectsOverview(),
  ]);

  // Recommend tests from the weakest subject, else from the first subject.
  const focusSlug = stats.weakest?.slug ?? subjects[0]?.slug;
  const focus = focusSlug ? await getSubjectWithTests(focusSlug) : null;
  const recommended = (focus?.tests ?? []).slice(0, 3).map((t) => ({
    id: t.id,
    title: t.title,
    difficulty: t.difficulty,
    durationMin: t.durationMin,
    questionCount: t.questionCount,
    subjectTitle: focus?.title,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Assalam-o-Alaikum, {firstName(user.name)}
        </h1>
        <p className="mt-1 text-ink-muted">
          {stats.totalAttempts > 0
            ? "Here's how your preparation is going."
            : "Let's get your first test on the board."}
        </p>
      </div>

      {/* Resume / start card */}
      <Card className="flex flex-col gap-4 bg-gradient-to-br from-primary to-primary-dark p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">
            {inProgress ? "Pick up where you left off" : "Start a new test"}
          </h2>
          <p className="mt-1 text-sm text-emerald-50">
            {inProgress
              ? `You have an unfinished test: ${inProgress.test.title}.`
              : "Pick a subject and run a timed, exam-style mock."}
          </p>
        </div>
        <Link
          href={inProgress ? `/tests/${inProgress.testId}` : "/subjects"}
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-white text-primary-dark hover:bg-emerald-50",
          )}
        >
          <Play className="size-4" />
          {inProgress ? "Resume test" : "Browse subjects"}
        </Link>
      </Card>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={ListChecks} value={stats.attemptedQuestions} label="Questions Attempted" />
        <StatCard
          icon={CheckCircle2}
          value={stats.correct}
          label="Correct Answers"
          accent="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          icon={Target}
          value={`${stats.accuracy}%`}
          label="Accuracy"
          accent="bg-sky-50 text-sky-700"
        />
        <StatCard
          icon={Flame}
          value={stats.streak}
          label={stats.streak === 1 ? "Day Streak" : "Day Streak"}
          accent="bg-amber-50 text-amber-700"
        />
      </div>

      {/* Subjects grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">Subjects</h2>
          <Link href="/subjects" className="text-sm font-semibold text-primary-dark hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <SubjectCard key={s.slug} {...s} />
          ))}
        </div>
      </section>

      {/* Recommended tests */}
      {recommended.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-ink">
              Recommended for you
            </h2>
            <p className="text-sm text-ink-muted">
              {stats.weakest
                ? `Your weakest area right now is ${stats.weakest.title} (${stats.weakest.accuracy}% accuracy).`
                : `Start with ${focus?.title}.`}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {recommended.map((t) => (
              <TestCard key={t.id} test={t} />
            ))}
          </div>
        </section>
      )}

      {/* Motivational banner */}
      <Card className="flex items-center gap-4 border-primary/20 bg-primary-light/40 p-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
          <CheckCircle2 className="size-6" />
        </div>
        <div>
          <p className="font-display font-bold text-ink">
            Consistency beats motivation.
          </p>
          <p className="text-sm text-ink-muted">One test a day, every day.</p>
        </div>
        {stats.totalAttempts > 0 && (
          <Button asChild variant="outline" size="sm" className="ml-auto hidden shrink-0 sm:inline-flex">
            <Link href="/progress">View progress</Link>
          </Button>
        )}
      </Card>
    </div>
  );
}
