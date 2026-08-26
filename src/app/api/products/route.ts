import { NextRequest, NextResponse } from "next/server";
import { getCollectionByHandle, getProducts, searchProducts } from "@/lib/shopify/api";
import { getTrustedBuyerIp } from "@/lib/shopify/buyer-ip";
import type { SortKeyProducts } from "@/lib/shopify/types";

export const runtime = "nodejs";

/**
 * GET /api/products?collection=dog-food&after=cursor&sort=price-asc
 * GET /api/products?q=chicken+treats&after=cursor
 * GET /api/products?after=cursor  (all products)
 *
 * Powers the "Load more" button on collection/search/all-products pages —
 * the first page is always rendered server-side for fast paint and SEO;
 * this endpoint only serves subsequent pages. This is a buyer-initiated
 * request, so the buyer's trusted IP is forwarded to Shopify.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const collection = params.get("collection");
  const q = params.get("q");
  const after = params.get("after");
  const sort = params.get("sort") || "featured";
  const buyerIp = getTrustedBuyerIp(request);

  const [rawKey, direction] = sort.split("-");
  const sortKeyMap: Record<string, string> = {
    best_selling: "BEST_SELLING",
    price: "PRICE",
    created: "CREATED",
    title: "TITLE",
    featured: "RELEVANCE",
  };
  const sortKey = sortKeyMap[rawKey] || "RELEVANCE";
  const reverse = direction === "desc";

  try {
    if (collection) {
      const result = await getCollectionByHandle(collection, {
        first: 12,
        after,
        sortKey: sortKey === "RELEVANCE" ? "COLLECTION_DEFAULT" : (sortKey as never),
        reverse,
        buyerIp,
      });
      return NextResponse.json({
        items: result?.products.items ?? [],
        pageInfo: result?.products.pageInfo ?? {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      });
    }

    if (q) {
      const result = await searchProducts(q, { first: 12, after, buyerIp });
      return NextResponse.json({ items: result.items, pageInfo: result.pageInfo });
    }

    const result = await getProducts({
      first: 12,
      after,
      sortKey: sortKey as SortKeyProducts,
      reverse,
      buyerIp,
    });
    return NextResponse.json({ items: result.items, pageInfo: result.pageInfo });
  } catch (error) {
    console.error("[api/products]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not load products." },
      { status: 500 }
    );
  }
}
