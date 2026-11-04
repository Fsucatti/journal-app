"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { CatIcon, PORTFOLIO_URL } from "@/components/ProjectFooter";

export default function Layout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[var(--soft)] text-[var(--charcoal)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--forest)] text-[var(--soft)] p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <a
            href={PORTFOLIO_URL}
            aria-label="Back to portfolio"
            title="Back to portfolio"
            className="flex items-center gap-2 rounded-3xl border border-[var(--soft)]/40 px-3 py-1 text-sm transition hover:bg-[var(--clay)]"
          >
            <CatIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Back to portfolio</span>
          </a>
          <Link href="/" className="text-xl font-semibold">
            🌿 Journal App
          </Link>
        </div>
        <div className="text-sm">
            {session?.user?.email ? (
                <button
                onClick={() => signOut()}
                className="bg-[var(--clay)] text-[var(--soft)] px-3 py-1 rounded-3xl hover:bg-[var(--sage)] transition"
                >
                Sign out ({session.user.email})
                </button>
            ) : (
                <>
              <Link
                href="/signin"
                className="bg-[var(--clay)] text-[var(--soft)] px-4 py-2 m-1 rounded-3xl hover:bg-[var(--sage)] transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-[var(--moss)] text-[var(--soft)] px-4 py-2 m-1 rounded-3xl hover:bg-[var(--sage)] transition"
              >
                Register
              </Link>
            </> 
            )}
            </div>
      </header>


      {/* Main Content */}
      <main className="flex-1 p-6 w-full space-y-6">
        {children}
      </main>
    </div>
  );
}
