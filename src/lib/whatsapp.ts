// WhatsApp-gated registration. Self-service signup is disabled — every
// "Register" CTA deep-links to the owner's WhatsApp with a pre-filled message.

// No leading '+' for wa.me. Env var wins; the literal is a safe fallback.
export const OWNER_WHATSAPP =
  process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "923415298183";

/** Pretty "+92 341 5298183" for display. */
export const OWNER_WHATSAPP_DISPLAY = "+92 341 5298183";

export function buildRegistrationLink(opts?: { name?: string; email?: string }) {
  const lines = [
    "Assalam-o-Alaikum! I'd like to register for CSS MPT Prep.",
    opts?.name ? `Name: ${opts.name}` : "Name: ",
    opts?.email ? `Email: ${opts.email}` : "Email: ",
    "City: ",
    "Exam I'm preparing for: ",
    "Please create my account. Shukriya!",
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${OWNER_WHATSAPP}?text=${text}`;
}

/** Used by the "Forgot password?" link. */
export function buildPasswordResetLink(email?: string) {
  const lines = [
    "Assalam-o-Alaikum! I need to reset my CSS MPT Prep password.",
    email ? `Account email: ${email}` : "Account email: ",
  ];
  return `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(
    lines.join("\n"),
  )}`;
}
