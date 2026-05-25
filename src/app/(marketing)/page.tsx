import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookMarked,
  FileText,
  MessageCircle,
  Timer,
  TrendingUp,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { SampleQuiz } from "@/components/marketing/SampleQuiz";
import { SUBJECTS } from "@/lib/subjects";
import { buildRegistrationLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const waLink = buildRegistrationLink();

function WhatsAppButton({
  className,
  variant = "primary",
  children = "Register on WhatsApp",
}: {
  className?: string;
  variant?: "primary" | "outline" | "secondary";
  children?: React.ReactNode;
}) {
  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant }), className)}
    >
      <MessageCircle />
      {children}
    </a>
  );
}

export default function LandingPage() {
  return (
    <>
      {/* ── Sticky nav ─────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-ink/8 bg-surface/85 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="FIA Job Prep home">
            <Logo />
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-ink-muted md:flex">
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#subjects" className="hover:text-ink">Subjects</a>
            <a href="#how" className="hover:text-ink">How it works</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Sign In
            </Link>
            <WhatsAppButton variant="primary" className="h-9 px-3.5 text-sm">
              <span className="hidden sm:inline">Register on WhatsApp</span>
              <span className="sm:hidden">Register</span>
            </WhatsAppButton>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="bg-hero-blob pointer-events-none absolute right-[-10%] top-[-10%] -z-10 h-[28rem] w-[28rem]" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
                <BadgeCheck className="size-3.5" /> Trusted FIA Preparation Platform
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] text-ink sm:text-5xl">
                Crack Your FIA Jobs Exam{" "}
                <span className="text-primary-dark">With Confidence</span>
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
                Practice real-style MCQs, timed mocks, and past papers. Track
                progress like a future officer — not a doom-scroller.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/demo" className={cn(buttonVariants({ size: "lg" }))}>
                  Start Free Demo Test <ArrowRight />
                </Link>
                <WhatsAppButton variant="outline" className="h-12 px-7 text-base" />
              </div>
            </div>

            {/* Right-side interactive sample */}
            <div className="relative">
              <SampleQuiz />
            </div>
          </div>
        </section>

        {/* ── Trust strip ──────────────────────────── */}
        <section className="border-y border-ink/8 bg-surface-muted">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-4 py-5 text-sm font-medium text-ink-muted sm:flex-row sm:gap-8 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="size-4 text-primary" /> Trusted FIA Prep Platform
            </span>
            <span className="hidden h-4 w-px bg-ink/10 sm:block" />
            <span className="inline-flex items-center gap-2">
              <FileText className="size-4 text-primary" /> 250+ past-paper MCQs
            </span>
            <span className="hidden h-4 w-px bg-ink/10 sm:block" />
            <span className="inline-flex items-center gap-2">
              <BookMarked className="size-4 text-primary" /> Updated Past Papers
            </span>
          </div>
        </section>

        {/* ── Feature grid ─────────────────────────── */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-ink">
              Everything you need to pass
            </h2>
            <p className="mt-3 text-ink-muted">
              No fluff. Just focused practice that mirrors the real exam.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "250+ MCQs",
                desc: "Real exam feel, drawn from FIA/FPSC past papers (2018–2024).",
              },
              {
                icon: Timer,
                title: "Timed Mocks",
                desc: "Pressure-tested practice with auto-submit, just like the real thing.",
              },
              {
                icon: BarChart3,
                title: "Smart Progress",
                desc: "See exactly where you're weak and fix it before exam day.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-ink/8 bg-surface p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                  <f.icon className="size-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-ink-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Subjects preview ─────────────────────── */}
        <section id="subjects" className="border-y border-ink/8 bg-surface-muted">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold text-ink">Five core subjects</h2>
                <p className="mt-3 text-ink-muted">
                  The full FIA syllabus, organised into focused test banks.
                </p>
              </div>
              <Link
                href="/login"
                className="text-sm font-semibold text-primary-dark hover:underline"
              >
                See all subjects →
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SUBJECTS.map((s) => (
                <div
                  key={s.slug}
                  className="rounded-2xl border border-ink/8 bg-surface p-6 shadow-sm"
                >
                  <div className={cn("flex size-11 items-center justify-center rounded-xl", s.accent)}>
                    <s.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{s.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────── */}
        <section id="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-ink">How it works</h2>
            <p className="mt-3 text-ink-muted">
              Accounts are created manually to keep quality high. Three quick steps.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { n: "1", t: "Register on WhatsApp", d: "Tap the button and send us a quick message. No forms, no spam." },
              { n: "2", t: "Get your credentials", d: "We verify and activate your account, then send your login details." },
              { n: "3", t: "Start practicing", d: "Sign in, set a new password, and begin your first timed test." },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-ink/8 bg-surface p-7 shadow-sm">
                <div className="flex size-10 items-center justify-center rounded-full bg-surface-dark font-mono text-base font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{s.t}</h3>
                <p className="mt-2 text-ink-muted">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <WhatsAppButton variant="primary" className="h-12 px-7 text-base" />
          </div>
        </section>

        {/* ── Final CTA banner ─────────────────────── */}
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark px-8 py-14 text-center shadow-lg">
            <TrendingUp className="mx-auto size-10 text-white/90" />
            <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">
              Ready for the real FIA exam?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-emerald-50">
              Join candidates preparing the smart way. Consistency beats motivation.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-primary-dark hover:bg-emerald-50",
                )}
              >
                <MessageCircle /> Register on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="border-t border-ink/8 bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm text-ink-muted">
              Mobile-first MCQ practice for FIA jobs in Pakistan. Prepare Smart,
              Get Selected.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-muted">
            <Link href="/login" className="hover:text-ink">Sign In</Link>
            <Link href="/register" className="hover:text-ink">Register</Link>
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#subjects" className="hover:text-ink">Subjects</a>
          </div>
        </div>
        <div className="border-t border-ink/8 py-5 text-center text-xs text-ink-soft">
          © {new Date().getFullYear()} FIA Job Prep. All rights reserved.
        </div>
      </footer>
    </>
  );
}
