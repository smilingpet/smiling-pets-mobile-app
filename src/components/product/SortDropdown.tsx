"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PRODUCT_SORT_OPTIONS } from "@/lib/shopify/types";

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "featured";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.delete("after");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      aria-label="Sort products"
      value={currentSort}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-full border border-surface-border bg-white px-3 py-2 text-xs font-medium text-ink shadow-sm"
    >
      <option value="featured">Featured</option>
      {PRODUCT_SORT_OPTIONS.filter((o) => o.key !== "RELEVANCE").map((option) => (
        <option
          key={`${option.key}-${option.reverse}`}
          value={`${option.key.toLowerCase()}-${option.reverse ? "desc" : "asc"}`}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function parseSortParam(sort: string | undefined): { sortKey: string; reverse: boolean } {
  if (!sort || sort === "featured") return { sortKey: "RELEVANCE", reverse: false };
  const [key, direction] = sort.split("-");
  const map: Record<string, string> = {
    best_selling: "BEST_SELLING",
    price: "PRICE",
    created: "CREATED",
    title: "TITLE",
  };
  return {
    sortKey: map[key] || "RELEVANCE",
    reverse: direction === "desc",
  };
}
