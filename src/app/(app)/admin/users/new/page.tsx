import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreateUserForm } from "./CreateUserForm";

export const metadata: Metadata = { title: "Create user" };

export default async function NewUserPage() {
  await requireAdmin();

  const [studentCount, recent] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, name: true, email: true, mustChangePassword: true, createdAt: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-surface-dark text-white">
          <Shield className="size-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Admin · Create user</h1>
          <p className="text-sm text-ink-muted">
            {studentCount} student {studentCount === 1 ? "account" : "accounts"} so far.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New student account</CardTitle>
            <CardDescription>
              The student must change this password on first login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateUserForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently created</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-ink-muted">No student accounts yet.</p>
            ) : (
              <ul className="divide-y divide-ink/8">
                {recent.map((u) => (
                  <li key={u.id} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{u.name}</p>
                      <p className="truncate text-xs text-ink-soft">{u.email}</p>
                    </div>
                    <span
                      className={
                        u.mustChangePassword
                          ? "shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700"
                          : "shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"
                      }
                    >
                      {u.mustChangePassword ? "Pending first login" : "Active"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
