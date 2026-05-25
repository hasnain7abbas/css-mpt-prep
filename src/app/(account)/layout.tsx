import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { requireUser } from "@/lib/auth-helpers";

// Minimal centered shell for account flows (e.g. forced password change).
// Deliberately separate from the (app) group so the "must change password"
// gate there can redirect here without creating a loop.
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="bg-hero-blob pointer-events-none absolute inset-x-0 top-0 -z-10 h-80"
      />
      <Link href="/dashboard" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
