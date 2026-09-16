import type { Metadata } from "next";
import { searchProducts } from "@/lib/shopify/api";
import { ShopifyApiError } from "@/lib/shopify/client";
import { SearchInput } from "@/components/product/SearchInput";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShopifyTroubleshoot } from "@/components/ui/ShopifyTroubleshoot";
import { RenderErrorBoundary } from "@/components/ui/RenderErrorBoundary";
import { SearchOffIcon } from "@/components/icons/Icons";
import { CATEGORY_NAV } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export const revalidate = 30;

type Props = { searchParams: { q?: string } };

const POPULAR_SEARCHES = [
  "Royal Canin",
  "Dog Treats",
  "Cat Litter",
  "Puppy Food",
  "Bird Food",
  "Dog Collar",
];

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim() || "";

  let result: Awaited<ReturnType<typeof searchProducts>> | null = null;
  let errorMessage: string | null = null;

  if (query) {
    try {
      result = await searchProducts(query, { first: 12 });
    } catch (error) {
      console.error(`[SearchPage:${query}]`, error);
      errorMessage =
        error instanceof ShopifyApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unknown error.";
    }
  }

  return (
    <div className="px-4 pb-6 pt-4">
      <SearchInput />

      {!query && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-bold text-ink">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <a
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-surface-border bg-white px-3 py-1.5 text-xs font-medium text-ink"
              >
                {term}
              </a>
            ))}
          </div>

          <h2 className="mb-2 mt-6 text-sm font-bold text-ink">Browse Categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_NAV.map((cat) => (
              <a
                key={cat.handle}
                href={`/collections/${cat.handle}`}
                className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700"
              >
                {cat.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {query && errorMessage && (
        <div className="mt-6">
          <ShopifyTroubleshoot reason="detail" detail={errorMessage} />
        </div>
      )}

      {query && !errorMessage && (
        <div className="mt-5">
          <p className="mb-3 text-xs text-ink-light">
            {result && result.items.length > 0
              ? `Results for "${query}"`
              : `No results for "${query}"`}
          </p>
          {result && result.items.length > 0 ? (
            <RenderErrorBoundary label="Search results">
              <ProductGrid
                key={query}
                initialItems={result.items}
                initialPageInfo={result.pageInfo}
                searchQuery={query}
              />
            </RenderErrorBoundary>
          ) : (
            <EmptyState
              icon={SearchOffIcon}
              title="No products found"
              description="Try checking your spelling or use a more general search term."
              actionLabel="Browse all products"
              actionHref="/collections/all"
            />
          )}
        </div>
      )}
    </div>
  );
}
