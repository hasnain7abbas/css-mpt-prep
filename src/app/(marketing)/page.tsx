import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { buttonVariants } from "@/components/ui/button";
import { SampleQuiz } from "@/components/marketing/SampleQuiz";
import { Countdown } from "@/components/marketing/Countdown";
import { Reveal } from "@/components/marketing/Reveal";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { getBankStats } from "@/lib/queries";
import { SUBJECTS } from "@/lib/subjects";
import { EXAM, MPT_WEIGHTING, applicationWindow, daysUntilTest, formatExamDate } from "@/lib/mpt";
import { buildRegistrationLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// Reads live bank counts, so it renders at request time.
export const dynamic = "force-dynamic";

const TIMELINE = [
  { when: `${EXAM.applyOpens.slice(8)}–${EXAM.applyCloses.slice(8)} August 2026`, what: "FPSC online applications for the MPT" },
  { when: formatExamDate(EXAM.testDate), what: "MPT — 200 MCQs in 200 minutes" },
  { when: formatExamDate(EXAM.writtenExamDate), what: "CSS written examination, for those who clear" },
];

export default async function LandingPage() {
  const stats = await getBankStats().catch(() => ({
    questions: 0,
    mocks: 0,
    papers: 0,
    subjects: 7,
    drills: 0,
  }));
  const days = daysUntilTest();
  const window = applicationWindow();
  const registerLink = buildRegistrationLink();

  return (
    <>
      {/* ── Masthead ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-ink/15 bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="CSS MPT Prep home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-ink-muted md:flex">
            <a className="transition-colors hover:text-ink" href="#paper">The paper</a>
            <a className="transition-colors hover:text-ink" href="#syllabus">Syllabus</a>
            <a className="transition-colors hover:text-ink" href="#practice">Practice</a>
            <a className="transition-colors hover:text-ink" href="#timeline">Dates</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Sign in
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
              Get access
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1120px] px-4 pt-12 sm:px-6 sm:pt-16">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
            FPSC · MCQ-Based Preliminary Test · {EXAM.cycle}
          </p>
          <div className="rule-double mt-3" />

          <div className="grid gap-10 pt-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <div>
              <h1 className="text-[clamp(2.6rem,7vw,5rem)] font-bold leading-[0.95] text-ink">
                Two hundred questions
                <br />
                stand between you
                <br />
                and the CSS exam.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                The MPT is a screening test: 66 out of 200 gets you through, the marks
                never count again, and a wrong answer costs nothing. This site is built
                for exactly that paper — full-length mocks on the official FPSC weighting,
                a verified question bank in all seven subjects, and drills aimed at
                whatever you keep getting wrong.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/demo" className={cn(buttonVariants({ size: "lg" }))}>
                  Take a 15-question demo <ArrowRight />
                </Link>
                <a
                  href={registerLink}
                  target="_blank"
                  rel="noopener"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  <MessageCircle /> Get access on WhatsApp
                </a>
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                No sign-up form — accounts are opened by hand, one message at a time.
              </p>
            </div>

            {/* Countdown + application status */}
            <aside className="lg:pt-2">
              <Countdown testDateIso={EXAM.testDate} initialDays={days} />
              <dl className="mt-8 divide-y divide-border border-y border-border">
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-ink-muted">Test day</dt>
                  <dd className="font-mono text-sm font-medium text-ink">
                    {formatExamDate(EXAM.testDate)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-ink-muted">Applications</dt>
                  <dd className="font-mono text-sm font-medium text-ink">
                    {window.state === "open"
                      ? "Open now"
                      : window.state === "upcoming"
                        ? `Open ${EXAM.applyOpens.slice(8)} Aug`
                        : "Closed"}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-ink-muted">Pass mark</dt>
                  <dd className="font-mono text-sm font-medium text-ink">
                    {EXAM.passMarks} / {EXAM.totalQuestions}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-ink-muted">Negative marking</dt>
                  <dd className="font-mono text-sm font-medium text-ink">None</dd>
                </div>
              </dl>
              <a
                href={EXAM.applyUrl}
                target="_blank"
                rel="noopener"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink underline decoration-accent decoration-2 underline-offset-4"
              >
                Apply on the FPSC portal <ArrowUpRight className="size-3.5" />
              </a>
            </aside>
          </div>
        </section>

        {/* ── What the paper is ──────────────────────────────── */}
        <section id="paper" className="mx-auto mt-24 max-w-[1120px] px-4 sm:px-6">
          <Reveal>
            <h2 className="text-3xl font-bold text-ink sm:text-4xl">Three facts that should shape how you prepare</h2>
          </Reveal>
          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-3">
            {[
              {
                n: "33%",
                h: "The bar is low, the volume is not",
                p: "66 of 200 clears it. Most candidates who fail do so on time and coverage, not difficulty — the paper is wide and shallow.",
              },
              {
                n: "0",
                h: "Nothing is deducted for a wrong answer",
                p: "Leaving a bubble empty is strictly worse than guessing. Every mock here enforces that habit by scoring blanks as zero, never negative.",
              },
              {
                n: "60",
                h: "General Science & Ability is the paper",
                p: "It carries 60 of 200 marks — more than Pakistan Affairs, Current Affairs and Islamiat combined. The bank is weighted the same way.",
              },
            ].map((f, i) => (
              <Reveal key={f.n} delay={i * 80} className="bg-surface p-7">
                <span className="font-mono text-5xl font-medium tracking-tight text-primary tabular-nums">
                  {f.n}
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{f.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.p}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Syllabus table ─────────────────────────────────── */}
        <section id="syllabus" className="mx-auto mt-24 max-w-[1120px] px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <h2 className="text-3xl font-bold text-ink sm:text-4xl">The syllabus, marked out</h2>
              <p className="mt-3 max-w-2xl text-ink-muted">
                Official FPSC weighting for the {EXAM.cycle} MPT, with what the bank
                currently holds against each section.
              </p>
            </Reveal>
            {stats.questions > 0 && (
              <p className="font-mono text-sm text-ink-soft tabular-nums">
                {stats.questions.toLocaleString()} questions in the bank
              </p>
            )}
          </div>

          <table className="mt-8 w-full border-collapse text-left">
            <thead>
              <tr className="border-y border-ink/25">
                <th className="py-3 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                  Section
                </th>
                <th className="hidden py-3 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft sm:table-cell">
                  What it covers
                </th>
                <th className="py-3 text-right font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                  Marks
                </th>
              </tr>
            </thead>
            <tbody>
              {MPT_WEIGHTING.map((w) => {
                const meta = SUBJECTS.find((s) => s.slug === w.slug);
                return (
                  <tr key={w.slug} className="border-b border-border align-top">
                    <td className="py-4 pr-4 font-display text-lg font-bold text-ink">
                      {meta?.title ?? w.slug}
                    </td>
                    <td
                      className="hidden py-4 pr-4 text-sm text-ink-muted sm:table-cell"
                      {...(w.slug === "urdu" ? { lang: "ur", dir: "rtl" } : {})}
                    >
                      {meta?.blurb}
                    </td>
                    <td className="py-4 text-right font-mono text-lg font-medium text-ink tabular-nums">
                      {w.marks}
                    </td>
                  </tr>
                );
              })}
              <tr className="border-b-2 border-ink">
                <td className="py-4 pr-4 font-display text-lg font-bold text-ink">Total</td>
                <td className="hidden sm:table-cell" />
                <td className="py-4 text-right font-mono text-lg font-bold text-ink tabular-nums">
                  {EXAM.totalQuestions}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ── What's inside ──────────────────────────────────── */}
        <section id="practice" className="mx-auto mt-24 max-w-[1120px] px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div>
              <Reveal>
                <h2 className="text-3xl font-bold text-ink sm:text-4xl">
                  Four ways to sit the paper
                </h2>
              </Reveal>
              <ol className="mt-8 divide-y divide-border border-y border-border">
                {[
                  {
                    k: "01",
                    h: `Full-length mocks${stats.mocks ? ` · ${stats.mocks} available` : ""}`,
                    p: "200 questions, 200 minutes, exact section weighting, one server-anchored timer that keeps running if your phone dies. Scored against the 66-mark line.",
                  },
                  {
                    k: "02",
                    h: "Subject tests",
                    p: "Fifty questions at a time when you want to grind one section rather than sit the whole paper.",
                  },
                  {
                    k: "03",
                    h: `Recalled past papers${stats.papers ? ` · ${stats.papers} papers` : ""}`,
                    p: "Questions candidates recalled from previous MPT sittings, answered and explained. Labelled as recalled — FPSC does not release official papers.",
                  },
                  {
                    k: "04",
                    h: `Topic drills${stats.drills ? ` · ${stats.drills} drills` : ""}`,
                    p: "Fifteen questions on one weakness — number series, Seerah, محاورات, whatever your last three attempts say you keep missing.",
                  },
                ].map((row, i) => (
                  <Reveal as="li" key={row.k} delay={i * 60} className="flex gap-5 py-5">
                    <span className="font-mono text-sm text-ink-soft tabular-nums">{row.k}</span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink">{row.h}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{row.p}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            <div className="lg:pt-4">
              <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
                Try one now
              </p>
              <SampleQuiz />
            </div>
          </div>
        </section>

        {/* ── Timeline ───────────────────────────────────────── */}
        <section id="timeline" className="mx-auto mt-24 max-w-[1120px] px-4 sm:px-6">
          <Reveal>
            <h2 className="text-3xl font-bold text-ink sm:text-4xl">The {EXAM.cycle} calendar</h2>
          </Reveal>
          <ol className="mt-8 border-t border-ink/25">
            {TIMELINE.map((t, i) => (
              <Reveal
                as="li"
                key={t.what}
                delay={i * 70}
                className="flex flex-col gap-1 border-b border-border py-5 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <span className="w-56 shrink-0 font-mono text-sm font-medium text-ink tabular-nums">
                  {t.when}
                </span>
                <span className="text-ink-muted">{t.what}</span>
              </Reveal>
            ))}
          </ol>
          <p className="mt-4 text-xs text-ink-soft">
            Dates as announced by FPSC. Always confirm on fpsc.gov.pk before you rely on them.
          </p>
        </section>

        {/* ── Access ─────────────────────────────────────────── */}
        <section className="mx-auto mt-24 max-w-[1120px] px-4 sm:px-6">
          <div className="border-2 border-ink bg-ink px-6 py-12 text-surface sm:px-12 sm:py-16">
            <h2 className="max-w-2xl text-3xl font-bold leading-tight text-surface sm:text-[2.75rem]">
              Accounts are opened by hand.
            </h2>
            <p className="mt-4 max-w-xl text-surface/70">
              Message on WhatsApp with your name and email. You get credentials back,
              set your own password on first login, and start with a full mock the same day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={registerLink}
                target="_blank"
                rel="noopener"
                className="inline-flex h-12 items-center gap-2 rounded-sm bg-surface px-7 text-base font-semibold text-ink transition-transform duration-200 ease-[var(--ease-out-expo)] active:translate-y-px"
              >
                <MessageCircle className="size-4" /> Message on WhatsApp
              </a>
              <Link
                href="/demo"
                className="inline-flex h-12 items-center gap-2 rounded-sm border border-surface/40 px-7 text-base font-semibold text-surface transition-colors hover:bg-surface/10"
              >
                Try the demo first
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-20 w-full max-w-[1120px] px-4 pb-10 sm:px-6">
        <div className="rule-double" />
        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p className="max-w-md text-xs leading-relaxed text-ink-soft">
            An independent preparation site. Not affiliated with the Federal Public
            Service Commission. Exam dates and the syllabus follow FPSC notifications —
            verify them at fpsc.gov.pk.
          </p>
          <p className="font-mono text-xs text-ink-soft">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  );
}
