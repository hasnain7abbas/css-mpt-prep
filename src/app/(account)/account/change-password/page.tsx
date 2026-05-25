import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth-helpers";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const metadata: Metadata = { title: "Change password" };

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();
  const forced = user.mustChangePassword;

  return (
    <Card>
      <CardHeader className="text-center">
        {forced && (
          <span className="mx-auto mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
            <ShieldCheck className="size-3.5" /> First-time setup
          </span>
        )}
        <CardTitle className="text-2xl">
          {forced ? "Set a new password" : "Change your password"}
        </CardTitle>
        <CardDescription>
          {forced
            ? "Your account was created with a temporary password. Choose a new one to continue."
            : "Pick a strong password you don't use elsewhere."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}
