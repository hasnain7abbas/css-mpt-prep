import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const SITE = "https://fiajobprep.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "FIA Job Prep — Prepare Smart, Get Selected",
    template: "%s · FIA Job Prep",
  },
  description:
    "Mobile-first MCQ practice for FIA (Federal Investigation Agency) jobs in Pakistan. 250+ past-paper MCQs, timed mocks, instant explanations, and progress tracking.",
  keywords: [
    "FIA jobs",
    "FIA test preparation",
    "FPSC MCQs",
    "FIA inspector past papers",
    "Pakistan job test prep",
  ],
  applicationName: "FIA Job Prep",
  openGraph: {
    title: "FIA Job Prep — Prepare Smart, Get Selected",
    description:
      "Practice real-style MCQs, timed mocks, and past papers. Track progress like a future officer.",
    url: SITE,
    siteName: "FIA Job Prep",
    locale: "en_PK",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "FIA Job Prep" },
  icons: { icon: "/logo.svg" },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-muted text-ink">
        {children}
        <Toaster richColors position="top-center" closeButton />
      </body>
    </html>
  );
}
