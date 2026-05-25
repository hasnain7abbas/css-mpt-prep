"use client";

import { useActionState, useState } from "react";
import { Check, Copy, Loader2, RotateCcw, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser, type CreateUserState } from "./actions";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-surface px-3 py-2 ring-1 ring-ink/10">
      <div className="min-w-0">
        <p className="text-xs text-ink-soft">{label}</p>
        <p className="truncate font-mono text-sm font-semibold text-ink">{value}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="shrink-0 rounded-lg p-2 text-ink-soft hover:bg-surface-muted hover:text-ink"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState<CreateUserState, FormData>(
    createUser,
    {},
  );

  if (state.ok && state.created) {
    const { name, email, tempPassword } = state.created;
    const message = `Assalam-o-Alaikum ${name}! Your FIA Job Prep account is ready.\n\nLogin: ${typeof window !== "undefined" ? window.location.origin : ""}/login\nEmail: ${email}\nTemporary password: ${tempPassword}\n\nYou'll be asked to set a new password on first login.`;
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 font-semibold text-emerald-800">
            <Check className="size-4" /> Account created for {name}
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            Share these credentials with the student. They must change the password on first login.
          </p>
        </div>

        <CopyRow label="Email" value={email} />
        <CopyRow label="Temporary password" value={tempPassword} />

        <Button
          variant="secondary"
          className="w-full"
          onClick={async () => {
            await navigator.clipboard.writeText(message);
            toast.success("Credentials message copied — paste it into WhatsApp.");
          }}
        >
          <Copy /> Copy WhatsApp message
        </Button>

        <Button variant="outline" className="w-full" onClick={() => location.reload()}>
          <RotateCcw /> Create another user
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {state.message}
        </p>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" placeholder="Ahmed Khan" aria-invalid={!!state.errors?.name} required />
        {state.errors?.name?.map((e) => (
          <p key={e} className="text-xs font-medium text-danger">{e}</p>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="student@example.com"
          aria-invalid={!!state.errors?.email}
          required
        />
        {state.errors?.email?.map((e) => (
          <p key={e} className="text-xs font-medium text-danger">{e}</p>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">
          Temporary password{" "}
          <span className="font-normal text-ink-soft">(optional — auto-generated if blank)</span>
        </Label>
        <Input id="password" name="password" placeholder="Leave blank to auto-generate" aria-invalid={!!state.errors?.password} />
        {state.errors?.password?.map((e) => (
          <p key={e} className="text-xs font-medium text-danger">{e}</p>
        ))}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="animate-spin" /> Creating…
          </>
        ) : (
          <>
            <UserPlus /> Create user
          </>
        )}
      </Button>
    </form>
  );
}
