import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Require a signed-in user. Redirects to /login if not authenticated.
 * Use at the top of every protected page / server action.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

/** Require an ADMIN. Sends students to their dashboard. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  mustChangePassword: boolean;
};

/**
 * The authoritative current user, read from the DB (not the stale JWT).
 * Memoised per-request via React cache. Redirects to /login if the session
 * is missing or the account has been deactivated/deleted.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  const session = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      mustChangePassword: true,
      isActive: true,
    },
  });
  if (!user || !user.isActive) redirect("/login");
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
  };
});
