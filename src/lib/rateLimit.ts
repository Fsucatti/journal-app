// src/lib/rateLimit.ts
// Attempts are stored in the database because serverless functions don't share memory.
import { prisma } from "./prisma";

export async function isBlocked(key: string, max: number, windowMs: number) {
  const count = await prisma.authAttempt.count({
    where: { key, createdAt: { gt: new Date(Date.now() - windowMs) } },
  });
  return count >= max;
}

export async function recordAttempt(key: string, windowMs: number) {
  await prisma.authAttempt.create({ data: { key } });
  // Keeps the collection small without a scheduled job.
  await prisma.authAttempt.deleteMany({
    where: { key, createdAt: { lt: new Date(Date.now() - windowMs) } },
  });
}

export async function clearAttempts(key: string) {
  await prisma.authAttempt.deleteMany({ where: { key } });
}

/** Vercel sets this header itself, so the first address is the visitor's. */
export function clientIp(headers?: Record<string, unknown> | Headers) {
  const value =
    headers instanceof Headers ? headers.get("x-forwarded-for") : headers?.["x-forwarded-for"];
  return String(value ?? "unknown").split(",")[0].trim();
}
