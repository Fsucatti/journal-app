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
  const [version, setVersion] = useState(0);
  const { data: session, status, } = useSession();
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
  }, [status, searchParams, version]);

  // A new entry doesn't change the URL, so the form announces it with an event.
  useEffect(() => {
    const reload = () => setVersion((v) => v + 1);
    window.addEventListener("journal:changed", reload);
    return () => window.removeEventListener("journal:changed", reload);
  }, []);

  if (status === "loading") return <p>Loading...</p>;

  if (status !== "authenticated") {
    return (
      <section className="max-w-xl mx-auto mt-16 rounded-2xl bg-[var(--soft-dark)] p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-[var(--forest)]">Your private journal</h1>
        <p className="mt-3 text-[var(--charcoal)]">
          Write entries in Markdown, organize them with tags, search them anytime, and export them whenever you like.
          Only you can read what you write.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/signin" className="rounded-3xl bg-[var(--forest)] px-5 py-2 text-[var(--soft)] transition hover:bg-[var(--clay)]">
            Sign in
          </Link>
          <Link href="/register" className="rounded-3xl border border-[var(--forest)] px-5 py-2 text-[var(--forest)] transition hover:bg-[var(--sage)]">
            Create an account
          </Link>
        </div>
      </section>
    );
  }

  if (loading) return <p>Loading...</p>;

  return (
    <section className="mt-12 max-w-5xl mx-auto px-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-[var(--forest)]">Your Journal Entries</h2>
        {entries.length > 0 && (
          // A file download, not a page: next/link would try to navigate to it.
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a
            href="/api/entries/export"
            className="rounded-3xl border border-[var(--forest)] px-4 py-1.5 text-sm text-[var(--forest)] transition hover:bg-[var(--sage)]"
          >
            Export to Markdown
          </a>
        )}
      </div>
      
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
              window.dispatchEvent(new Event("journal:changed"));
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
