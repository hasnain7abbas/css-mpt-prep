"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

const schema = z.object({
  name: z.string().min(2, "Enter the student's full name."),
  email: z.email("Enter a valid email address."),
  password: z.string().optional(),
});

export type CreateUserState = {
  ok?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  created?: { name: string; email: string; tempPassword: string };
};

// Readable temp password (no ambiguous chars), always ≥8 with letters + digits.
function genTempPassword() {
  const letters = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
  const digits = "23456789";
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  let body = "";
  for (let i = 0; i < 5; i++) body += pick(letters);
  for (let i = 0; i < 2; i++) body += pick(digits);
  return `Fia-${body}`;
}

export async function createUser(
  _prev: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") || undefined,
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const name = parsed.data.name.trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: ["A user with this email already exists."] } };
  }

  const supplied = parsed.data.password?.trim();
  if (supplied && supplied.length < 8) {
    return { errors: { password: ["Password must be at least 8 characters."] } };
  }
  const tempPassword = supplied && supplied.length >= 8 ? supplied : genTempPassword();
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      mustChangePassword: true,
      isActive: true,
      role: "STUDENT",
    },
  });

  return { ok: true, created: { name, email, tempPassword } };
}
