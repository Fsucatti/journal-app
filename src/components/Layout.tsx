"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { CatIcon, PORTFOLIO_URL } from "@/components/ProjectFooter";

// Buttons never wrap, so the header stays on one line on phones.
const button = "whitespace-nowrap rounded-3xl px-3 py-1.5 text-[var(--soft)] transition hover:bg-[var(--sage)] sm:px-4 sm:py-2";

export default function Layout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[var(--soft)] text-[var(--charcoal)] flex flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-[var(--forest)] p-3 text-[var(--soft)] shadow-md sm:p-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <a
            href={PORTFOLIO_URL}
            aria-label="Back to portfolio"
            title="Back to portfolio"
            className="flex shrink-0 items-center gap-2 rounded-3xl border border-[var(--soft)]/40 px-3 py-1 text-sm transition hover:bg-[var(--clay)]"
          >
            <CatIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Back to portfolio</span>
          </a>
          <Link href="/" className="whitespace-nowrap text-lg font-semibold sm:text-xl">
            🌿 Journal<span className="hidden sm:inline"> App</span>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-sm">
          {session?.user?.email ? (
            <button onClick={() => signOut()} title={`Signed in as ${session.user.email}`} className={`${button} bg-[var(--clay)]`}>
              Sign out
              <span className="hidden md:inline"> ({session.user.email})</span>
            </button>
          ) : (
            <>
              <Link href="/signin" className={`${button} bg-[var(--clay)]`}>
                Sign in
              </Link>
              <Link href="/register" className={`${button} bg-[var(--moss)]`}>
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 w-full space-y-6">{children}</main>
    </div>
  );
}
