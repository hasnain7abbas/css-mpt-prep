import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Display: a serif with optical sizing — gazette masthead, not SaaS sans.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  axes: ["SOFT", "WONK"],
  display: "swap",
});

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Timers, scores and the countdown are set in mono — they are instrument
// readings, not prose.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Urdu MCQs render in proper Nastaliq rather than a fallback Naskh.
const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "600"],
  display: "swap",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cssmptprep.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "CSS MPT Prep — Clear the FPSC screening test",
    template: "%s · CSS MPT Prep",
  },
  description:
    "Preparation for the FPSC MCQ-Based Preliminary Test (MPT) for CSS 2027 — 27 September 2026. Full-length 200-question mocks on the exact FPSC weighting, verified MCQs across all seven subjects, recalled past papers and weak-area drills.",
  keywords: [
    "CSS MPT",
    "MPT preparation",
    "FPSC screening test",
    "CSS 2027",
    "MCQ based preliminary test",
    "CSS MPT past papers",
    "CSS screening test Pakistan",
  ],
  applicationName: "CSS MPT Prep",
  openGraph: {
    title: "CSS MPT Prep — Clear the FPSC screening test",
    description:
      "200-question mocks on the official FPSC weighting, verified MCQs in all seven subjects, and recalled past papers. Built for the 27 September 2026 MPT.",
    url: SITE,
    siteName: "CSS MPT Prep",
    locale: "en_PK",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "CSS MPT Prep" },
  icons: { icon: "/logo.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#12161c" },
    { media: "(prefers-color-scheme: light)", color: "#fbf9f4" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint. Paper (light) is the default; "dark" is an explicit
// choice for night study, saved by the toggle. Prevents a theme flash.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${plex.variable} ${plexMono.variable} ${nastaliq.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <div className="grain" aria-hidden />
        {children}
        <Toaster richColors position="top-center" closeButton theme="system" />
      </body>
    </html>
  );
}
