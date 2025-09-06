"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import MarkdownRenderer from "./MarkdownRenderer";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";


type Entry = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  entryTags: { tag: { name: string } }[];
};

export default function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchEntries() {
      const query = searchParams.get("q") || "";
      const tag = searchParams.get("tag") || "";

      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (tag) params.set("tag", tag);

      const res = await fetch(`/api/entries?${params.toString()}`);
      if (!res.ok) {
        setEntries([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setEntries(data);
      setLoading(false);
    }

    setLoading(true);
    fetchEntries();
  }, [status, searchParams]);

  if (status === "loading" || loading) return <p>Loading...</p>;

  if (status !== "authenticated") {
    return (
      <p>
        Please{" "}
        <Link href="/api/auth/signin" className="underline text-[var(--charcoal)] hover:text-[var(--sage)] transition">
          sign in
        </Link>{" "}
        to view your journal.
      </p>
    );
  }

  return (
    <section className="mt-12 max-w-5xl mx-auto px-4">
      <h2 className="text-2xl font-semibold text-[var(--forest)] mb-4">Your Journal Entries</h2>
      
      {entries.length === 0 ? (
        <p className="text-[var(--charcoal)]">No entries yet.</p>
      ) : (
        <>
        <div className="columns-[320px] gap-6 space-y-6">
  {entries.map((entry) => (
    <div
      key={entry.id}
      className="inline-block w-full break-inside-avoid bg-[var(--soft-dark)] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 animate-fadeIn"
    >
      <h3 className="text-lg font-bold text-[var(--charcoal)]">{entry.title}</h3>
      <p className="text-xs text-[var(--charcoal)] mb-2">
        {new Date(entry.createdAt).toLocaleString()}
      </p>

      <div className="mt-2 p-3 border rounded bg-white text-[var(--charcoal)] prose prose-sm max-w-none break-words whitespace-pre-wrap">
        <MarkdownRenderer>{entry.content}</MarkdownRenderer>
      </div>

      <div className="flex flex-wrap gap-2 mt-2 text-xs">
        {entry.entryTags.map((et) => (
          <button
            key={et.tag.name}
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set("tag", et.tag.name);
              router.push(`/?${params.toString()}`);
            }}
            className="bg-[var(--sage)] text-[var(--charcoal)] px-2 py-1 rounded hover:bg-[var(--forest)] hover:text-[var(--soft)] transition"
          >
            #{et.tag.name}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-4">
        <Link
          href={`/entries/${entry.id}/edit`}
          className="flex items-center text-[var(--forest)] hover:underline"
        >
          <PencilSquareIcon className="h-5 w-5 mr-1" />
          <span>Edit</span>
        </Link>

        <button
          onClick={async () => {
            const res = await fetch(`/api/entries/${entry.id}`, {
              method: "DELETE",
            });
            if (res.ok) {
              setEntries((prev) => prev.filter((e) => e.id !== entry.id));
            }
          }}
          className="flex items-center text-red-600 hover:underline"
        >
          <TrashIcon className="h-5 w-5 mr-1" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  ))}
</div>

        </>
      )}
    </section>
  );
}
