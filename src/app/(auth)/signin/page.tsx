"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";



export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
    const router = useRouter();

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (res?.ok) {
    toast.success("Logged in successfully!");
    setTimeout(() => router.push("/"), 1500); // redirect manually
  } else {
    toast.error("Invalid email or password.");
  }}

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--clay)] px-4">
      <form onSubmit={handleEmailSignIn} className="max-w-md w-full bg-[var(--soft-dark)] p-6 rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-semibold text-[var(--forest)]">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-[var(--forest)] rounded-3xl bg-[var(--soft) ] text-[var(--charcoal)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-[var(--forest)] rounded-3xl bg-[var(--soft) ] text-[var(--charcoal)]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[var(--forest)] text-[var(--soft)] rounded-3xl hover:bg-[var(--sage)] transition"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
