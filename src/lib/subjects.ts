import {
  Atom,
  BookOpen,
  Globe2,
  Landmark,
  Languages,
  Moon,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import { marksFor } from "@/lib/mpt";

// Display metadata for the seven MPT subjects. The DB holds the authoritative
// titles/descriptions + tests; this drives icons, blurbs and accent colours.
export type SubjectMeta = {
  slug: string;
  title: string;
  short: string;
  blurb: string;
  icon: LucideIcon;
  accent: string; // tailwind classes for the icon chip
};

export const SUBJECTS: SubjectMeta[] = [
  {
    slug: "general-science-ability",
    title: "General Science & Ability",
    short: "Science & Ability",
    blurb: "Everyday science, arithmetic, algebra, series, analytical and logical reasoning",
    icon: Atom,
    accent: "bg-primary/10 text-primary-dark dark:bg-primary/20 dark:text-primary-light",
  },
  {
    slug: "english",
    title: "English",
    short: "English",
    blurb: "Vocabulary, grammar, sentence correction, idioms and comprehension",
    icon: BookOpen,
    accent: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  },
  {
    slug: "pakistan-affairs",
    title: "Pakistan Affairs",
    short: "Pakistan Affairs",
    blurb: "Freedom movement, constitution, geography, economy and post-1947 history",
    icon: Landmark,
    accent: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  {
    slug: "current-affairs",
    title: "Current Affairs",
    short: "Current Affairs",
    blurb: "Pakistan and world developments, summits, economy, awards and sport",
    icon: Newspaper,
    accent: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  },
  {
    slug: "islamic-studies",
    title: "Islamic Studies",
    short: "Islamiat",
    blurb: "Quran, Hadith, Seerah, Fiqh — with Civics & Ethics for non-Muslim candidates",
    icon: Moon,
    accent: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  },
  {
    slug: "urdu",
    title: "Urdu",
    short: "اردو",
    blurb: "قواعد، ترجمہ، محاورات و ضرب الامثال اور اردو ادب",
    icon: Languages,
    accent: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
  {
    slug: "general-knowledge",
    title: "General Knowledge",
    short: "GK",
    blurb: "Capitals, currencies, organisations, geography superlatives and world facts",
    icon: Globe2,
    accent: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  },
];

export function subjectMeta(slug: string): SubjectMeta | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}

/** Subjects in paper order, heaviest first — matches MPT_WEIGHTING. */
export const subjectsByWeight = () =>
  [...SUBJECTS].sort((a, b) => marksFor(b.slug) - marksFor(a.slug));
