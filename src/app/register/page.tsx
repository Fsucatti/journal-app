"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Account created! You can now sign in.");
      setTimeout(() => router.push("/signin"), 1500);
    } else {
      toast.error(data.error || "Registration failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-[var(--soft-dark)] p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-[var(--forest)] mb-4">Create an Account</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-[var(--forest)] rounded-3xl bg-[var(--soft)] text-[var(--charcoal)]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-[var(--forest)] rounded-3xl bg-[var(--soft)] text-[var(--charcoal)]"
          required
        />
        <button
          type="submit"
          className="w-full bg-[var(--forest)] text-[var(--soft)] px-4 py-2 rounded-3xl hover:bg-[var(--sage)] transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
