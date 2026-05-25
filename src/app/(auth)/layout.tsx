import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      {/* soft brand glow */}
      <div
        aria-hidden
        className="bg-hero-blob pointer-events-none absolute inset-x-0 top-0 -z-10 h-80"
      />
      <Link href="/" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-center text-xs text-ink-soft">
        Trusted FIA Preparation Platform
      </p>
    </div>
  );
}
