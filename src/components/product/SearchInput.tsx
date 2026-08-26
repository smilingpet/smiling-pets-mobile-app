"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const RECENT_KEY = "smilingpets:recentSearches";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [value, setValue] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  function navigate(query: string) {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleChange(next: string) {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => navigate(next), 450);
  }

  function saveRecent(query: string) {
    if (!query.trim() || typeof window === "undefined") return;
    const existing: string[] = JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]");
    const next = [query, ...existing.filter((q) => q.toLowerCase() !== query.toLowerCase())].slice(
      0,
      8
    );
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        saveRecent(value);
        navigate(value);
      }}
      className="flex items-center gap-2 rounded-full border border-surface-border bg-white px-4 py-2.5 shadow-sm"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-ink-light">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search anything for your pet..."
        aria-label="Search products"
        autoFocus
        className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-light"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setValue("");
            navigate("");
          }}
          className="shrink-0 text-ink-light"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </form>
  );
}
