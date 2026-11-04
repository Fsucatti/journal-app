// src/lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";   // ✅ add this
import { clearAttempts, clientIp, isBlocked, recordAttempt } from "./rateLimit";

const SIGN_IN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_EMAIL = 10;
const MAX_FAILURES_PER_IP = 30;
export const TOO_MANY_ATTEMPTS = "TooManyAttempts";

export const authOptions: NextAuthOptions = {       // ✅ annotate type
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailKey = `signin:email:${credentials.email.toLowerCase()}`;
        const ipKey = `signin:ip:${clientIp(req?.headers)}`;
        if (
          (await isBlocked(emailKey, MAX_FAILURES_PER_EMAIL, SIGN_IN_WINDOW_MS)) ||
          (await isBlocked(ipKey, MAX_FAILURES_PER_IP, SIGN_IN_WINDOW_MS))
        ) {
          throw new Error(TOO_MANY_ATTEMPTS);
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        const isValid = !!user && (await compare(credentials.password, user.password));

        if (!isValid) {
          await recordAttempt(emailKey, SIGN_IN_WINDOW_MS);
          await recordAttempt(ipKey, SIGN_IN_WINDOW_MS);
          return null;
        }

        await clearAttempts(emailKey);
        return { id: user.id, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
