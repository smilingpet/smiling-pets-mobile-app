"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchOffIcon } from "@/components/icons/Icons";
import type { PageInfo, ProductCardData } from "@/lib/shopify/types";

/**
 * Renders a two-column product grid with a "Load more" button that fetches
 * additional pages client-side from /api/products.
 *
 * IMPORTANT: pass `key={sort}` (or similar) from the parent server
 * component whenever the sort/filter changes, so React remounts this
 * component with the fresh server-rendered first page instead of trying
 * to reconcile stale client state.
 */
export function ProductGrid({
  initialItems,
  initialPageInfo,
  collectionHandle,
  searchQuery,
  emptyTitle = "No products found",
  emptyDescription = "Try a different search or browse our categories instead.",
}: {
  initialItems: ProductCardData[];
  initialPageInfo: PageInfo;
  collectionHandle?: string;
  searchQuery?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "featured";

  const [items, setItems] = useState(initialItems);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);


  async function loadMore() {
    if (!pageInfo.hasNextPage || isLoadingMore) return;
    setIsLoadingMore(true);
    setError(null);
    try {
      const url = new URL("/api/products", window.location.origin);
      if (collectionHandle) url.searchParams.set("collection", collectionHandle);
      if (searchQuery) url.searchParams.set("q", searchQuery);
      if (pageInfo.endCursor) url.searchParams.set("after", pageInfo.endCursor);
      url.searchParams.set("sort", sort);

      const res = await fetch(url.toString());
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Could not load more products.");

      setItems((prev) => [...prev, ...json.items]);
      setPageInfo(json.pageInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load more products.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={SearchOffIcon} />;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>

      {isLoadingMore && (
        <div className="mt-3">
          <ProductGridSkeleton count={2} />
        </div>
      )}

      {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}

      {pageInfo.hasNextPage && !isLoadingMore && (
        <button
          type="button"
          onClick={loadMore}
          className="mx-auto mt-5 block rounded-full border border-brand-500 px-8 py-2.5 text-sm font-semibold text-brand-600 active:scale-95"
        >
          Load more
        </button>
      )}
    </div>
  );
}
