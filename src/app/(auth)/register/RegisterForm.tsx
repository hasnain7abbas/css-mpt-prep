"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { buildRegistrationLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// IMPORTANT: this is NOT a signup form. The inputs only customise the
// pre-filled WhatsApp message — nothing is POSTed and no account is created.
export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const href = buildRegistrationLink({
    name: name.trim() || undefined,
    email: email.trim() || undefined,
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Full name <span className="font-normal text-ink-soft">(optional)</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ahmed Khan"
            autoComplete="name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <span className="font-normal text-ink-soft">(optional)</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ size: "lg" }), "w-full")}
      >
        <MessageCircle />
        Continue on WhatsApp →
      </a>

      <p className="text-center text-xs text-ink-soft">
        We reply during 9 AM – 11 PM PKT.
      </p>
    </div>
  );
}
