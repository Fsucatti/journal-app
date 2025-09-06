"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

type EntryWithTags = {
  id: string;
  title: string;
  content: string;
  entryTags: { tag: { name: string } }[];
};

export default function EditEntryForm({ entry }: { entry: EntryWithTags }) {
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [tags, setTags] = useState(
    entry.entryTags.map((et) => et.tag.name).join(", ")
  );
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/entries/${entry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Failed to update entry.");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Edit Journal Entry</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border rounded"
        required
      />

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Content (Markdown supported)</label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-xs text-blue-600 hover:underline"
          >
            {preview ? "Edit" : "Preview"}
          </button>
        </div>

        {preview ? (
          <div className="p-3 border rounded bg-gray-50 prose prose-sm max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded min-h-[120px]"
            required
          />
        )}
      </div>

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Entry"}
      </button>
    </form>
  );
}
