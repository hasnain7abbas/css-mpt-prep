import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Register on WhatsApp",
  description:
    "Registration for FIA Job Prep is manual to keep quality high. Message us on WhatsApp and we activate your account within a few hours.",
};

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Registration is manual to keep quality high
        </CardTitle>
        <CardDescription>
          Tap below to message us on WhatsApp. We verify and activate your
          account within a few hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary-dark hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
