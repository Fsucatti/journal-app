"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";

/** Hides tools that only work with an account, instead of letting them fail on submit. */
export default function SignedInOnly({ children }: { children: ReactNode }) {
  const { status } = useSession();
  return status === "authenticated" ? <>{children}</> : null;
}
