import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";

// Focused, full-bleed shell for taking tests and viewing results — no app nav,
// so the in-quiz experience stays distraction-free. Still gated by auth + the
// first-login password change.
export default async function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user.mustChangePassword) redirect("/account/change-password");
  return <div className="min-h-dvh bg-surface-muted">{children}</div>;
}
