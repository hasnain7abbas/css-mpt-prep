import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { TopBar } from "@/components/app/TopBar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // First-login forced password change (gate reads the DB, so the change-password
  // page — which lives in the separate (account) group — won't loop).
  if (user.mustChangePassword) redirect("/account/change-password");

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar name={user.name} email={user.email} isAdmin={user.role === "ADMIN"} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
