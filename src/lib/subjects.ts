import { BookOpen, Globe, Landmark, Laptop, Moon, type LucideIcon } from "lucide-react";

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
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    slug: "general-knowledge",
    title: "General Knowledge",
    blurb: "World facts, Current affairs, Capitals, Awards",
    icon: Globe,
    accent: "bg-sky-50 text-sky-700",
  },
  {
    slug: "pakistan-studies",
    title: "Pakistan Studies",
    blurb: "History, Politics, Geography, Constitution",
    icon: Landmark,
    accent: "bg-amber-50 text-amber-700",
  },
  {
    slug: "computer",
    title: "Computer",
    blurb: "Basic IT, MS Office, Internet, Hardware, Shortcuts",
    icon: Laptop,
    accent: "bg-violet-50 text-violet-700",
  },
  {
    slug: "islamic-studies",
    title: "Islamic Studies",
    blurb: "Quran, Hadith, Fiqh, Seerah, Islamic history",
    icon: Moon,
    accent: "bg-teal-50 text-teal-700",
  },
];

export function subjectMeta(slug: string): SubjectMeta | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}
