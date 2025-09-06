"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "./MarkdownRenderer";

export default function EntryForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);
  const [charLimit] = useState(2000); // Optional character limit
  const router = useRouter();

  const localStorageKey = "draftEntryContent";

  useEffect(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) setContent(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKey, content);
  }, [content]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Entry saved successfully!");
      setTitle("");
      setContent("");
      setTags("");
      localStorage.removeItem(localStorageKey);
      router.push("/");
    } else {
      setMessage(data.error || "Something went wrong.");
    }

    setLoading(false);
  }

  const insertMarkdown = (prefix: string, suffix = "") => {
    const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);

    const updated =
      content.slice(0, start) + prefix + selected + suffix + content.slice(end);

    setContent(updated);

    // Maintain cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = end + prefix.length;
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold">New Journal Entry</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border border-[var(--forest)] rounded-3xl bg-[var(--soft)] text-[var(--charcoal)]"
        required
      />

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Content (Markdown supported)</label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-xs text-[var(--forest)] hover:underline"
          >
            {preview ? "Edit" : "Preview"}
          </button>
        </div>

        {!preview && (
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              type="button"
              onClick={() => insertMarkdown("**", "**")}
              className="px-2 py-1 text-sm font-medium rounded-md border border-[var(--moss)] text-[var(--soft)] bg-[var(--moss)] hover:bg-[var(--sage)] hover:text-[var(--charcoal)] transition"
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("*", "*")}
              className="px-2 py-1 text-sm font-medium rounded-md border border-[var(--moss)] text-[var(--soft)] bg-[var(--moss)] hover:bg-[var(--sage)] hover:text-[var(--charcoal)] transition"
            >
              Italic
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("```", "```")}
              className="px-2 py-1 text-sm font-medium rounded-md border border-[var(--moss)] text-[var(--soft)] bg-[var(--moss)] hover:bg-[var(--sage)] hover:text-[var(--charcoal)] transition"
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("# ")}
              className="px-2 py-1 text-sm font-medium rounded-md border border-[var(--moss)] text-[var(--soft)] bg-[var(--moss)] hover:bg-[var(--sage)] hover:text-[var(--charcoal)] transition"
            >
              Heading
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("- ")}
              className="px-2 py-1 text-sm font-medium rounded-md border border-[var(--moss)] text-[var(--soft)] bg-[var(--moss)] hover:bg-[var(--sage)] hover:text-[var(--charcoal)] transition"
            >
              Bullet
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("1. ")}
              className="px-2 py-1 text-sm font-medium rounded-md border border-[var(--moss)] text-[var(--soft)] bg-[var(--moss)] hover:bg-[var(--sage)] hover:text-[var(--charcoal)] transition"
            >
              Number
            </button>
          </div>
        )}

        {preview ? (
          <div className="p-3 border border-[var(--forest)] rounded bg-[var(--clay)] prose-sm text-[var(--soft)] max-w-none">
            <MarkdownRenderer>{content}</MarkdownRenderer>
          </div>
        ) : (
          <>
            <textarea
              id="markdown-textarea"
              placeholder="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--forest)] rounded-3xl bg-[var(--soft)] text-[var(--charcoal)] min-h-[150px]"
              required
              maxLength={charLimit}
            />
            <p className="text-right text-xs text-gray-600">
              {content.length}/{charLimit} characters
            </p>
          </>
        )}
      </div>

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full px-4 py-2 border border-[var(--forest)] rounded-3xl bg-[var(--soft)] text-[var(--charcoal)]"
      />

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 bg-[var(--forest)] text-[var(--soft)] rounded-3xl hover:bg-[var(--sage)] transition"
      >
        {loading ? "Saving..." : "Save Entry"}
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
}
