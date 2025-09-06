// src/components/SessionClient.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function SessionClient() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return (
      <div>
        <p>Not signed in</p>
        <button
          onClick={() => signIn()}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>Hello {session.user?.email}</p>
      <button
        onClick={() => signOut()}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
