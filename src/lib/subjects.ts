import { BookOpen, Calculator, Globe, Landmark, Laptop, Moon, Scale, type LucideIcon } from "lucide-react";

// Display metadata for the five fixed subjects. The DB holds the authoritative
// titles/descriptions + tests; this drives icons and accent colours in the UI.
export type SubjectMeta = {
  slug: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  accent: string; // tailwind classes for the icon chip
};

export const SUBJECTS: SubjectMeta[] = [
  {
    slug: "english",
    title: "English",
    blurb: "Grammar, Vocabulary, Synonyms, Antonyms, Comprehension",
    icon: BookOpen,
    accent: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  {
    slug: "general-knowledge",
    title: "General Knowledge",
    blurb: "World facts, Current affairs, Capitals, Awards",
    icon: Globe,
    accent: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  },
  {
    slug: "pakistan-studies",
    title: "Pakistan Studies",
    blurb: "History, Politics, Geography, Constitution",
    icon: Landmark,
    accent: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  {
    slug: "computer",
    title: "Computer",
    blurb: "Basic IT, MS Office, Internet, Hardware, Shortcuts",
    icon: Laptop,
    accent: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
  {
    slug: "islamic-studies",
    title: "Islamic Studies",
    blurb: "Quran, Hadith, Fiqh, Seerah, Islamic history",
    icon: Moon,
    accent: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
  },
  {
    slug: "iq-math",
    title: "IQ & Mathematics",
    blurb: "Arithmetic, Number series, Analytical & Logical reasoning",
    icon: Calculator,
    accent: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  },
  {
    slug: "fia-act",
    title: "FIA Act & Laws",
    blurb: "FIA Act 1974, powers & wings, PECA, immigration & related laws",
    icon: Scale,
    accent: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  },
];

export function subjectMeta(slug: string): SubjectMeta | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}
