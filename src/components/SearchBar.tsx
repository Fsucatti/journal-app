"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

type Tag = {
  name: string;
};

export default function Searchbar({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
  const [isOpen, setIsOpen] = useState(true);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (selectedTag) params.set("tag", selectedTag);

    router.push(`/?${params.toString()}`);
  }

  function handleTagClick(tag: string) {
    setSelectedTag(tag === selectedTag ? "" : tag);

    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (tag !== selectedTag) {
      params.set("tag", tag);
    }

    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="max-w-3xl mx-auto w-full mb-6">
      {/* Toggle button for mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden mb-4 flex items-center text-[var(--forest)] hover:text-[var(--sage)] transition"
      >
        {isOpen ? <ChevronUpIcon className="w-5 h-5 mr-1" /> : <ChevronDownIcon className="w-5 h-5 mr-1" />}
        <span className="font-medium">{isOpen ? "Hide Search" : "Show Search"}</span>
      </button>

      {/* Main search panel */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <form
          onSubmit={handleSearch}
          className="bg-[var(--soft-dark)] p-4 rounded-xl shadow-sm flex flex-wrap gap-3 items-center justify-center"
        >
          {/* Search input with icon */}
          <div className="relative w-full sm:flex-grow sm:w-auto">
            <MagnifyingGlassIcon className="w-5 h-5 text-[var(--forest)] absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search entries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-[var(--forest)] bg-[var(--soft)] text-[var(--charcoal)] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[var(--sage)] transition"
            />
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="px-5 py-2 bg-[var(--forest)] text-[var(--soft)] rounded-3xl hover:bg-[var(--sage)] transition"
          >
            Search
          </button>

          {/* Clear filters */}
          {searchParams.size > 0 && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedTag("");
                router.push("/");
              }}
              type="button"
              className="text-sm text-[var(--clay)] underline ml-2 hover:text-[var(--forest)] transition"
            >
              Clear filters
            </button>
          )}
        </form>

        {/* Pill tag filter */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {tags.map((tag) => {
            const isActive = tag.name === selectedTag;
            return (
              <button
                key={tag.name}
                onClick={() => handleTagClick(tag.name)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  isActive
                    ? "bg-[var(--forest)] text-[var(--soft)] border-[var(--forest)]"
                    : "bg-[var(--sage)] text-[var(--charcoal)] border-[var(--sage)] hover:bg-[var(--forest)] hover:text-[var(--soft)]"
                }`}
              >
                #{tag.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
