"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, type ChangePasswordState } from "./actions";

function PasswordField({
  id,
  label,
  autoComplete,
  errors,
}: {
  id: string;
  label: string;
  autoComplete: string;
  errors?: string[];
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          className="pr-11"
          aria-invalid={!!errors}
          required
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {errors?.map((e) => (
        <p key={e} className="text-xs font-medium text-danger">
          {e}
        </p>
      ))}
    </div>
  );
}

export function ChangePasswordForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ChangePasswordState, FormData>(
    changePassword,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      toast.success("Password updated. Welcome aboard!");
      router.push("/dashboard");
      router.refresh();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <PasswordField
        id="currentPassword"
        label="Current password"
        autoComplete="current-password"
        errors={state.errors?.currentPassword}
      />
      <PasswordField
        id="newPassword"
        label="New password"
        autoComplete="new-password"
        errors={state.errors?.newPassword}
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        errors={state.errors?.confirmPassword}
      />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="animate-spin" /> Updating…
          </>
        ) : (
          "Update password →"
        )}
      </Button>
    </form>
  );
}
