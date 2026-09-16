import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getCollectionByHandle } from "@/lib/shopify/api";
import { ShopifyApiError } from "@/lib/shopify/client";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SortDropdown, parseSortParam } from "@/components/product/SortDropdown";
import { ShopifyTroubleshoot } from "@/components/ui/ShopifyTroubleshoot";
import { RenderErrorBoundary } from "@/components/ui/RenderErrorBoundary";
import { CATEGORY_NAV, SITE_URL } from "@/lib/constants";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { isSafeImageUrl } from "@/lib/utils/image";
import { stripHtml, truncate } from "@/lib/utils/format";

export const revalidate = 60;

type Props = {
  params: { handle: string };
  searchParams: { sort?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getCollectionByHandle(params.handle, { first: 1 }).catch(() => null);
  if (!collection) return {};
  const description = collection.description
    ? truncate(stripHtml(collection.description), 155)
    : `Shop ${collection.title} at Smiling Pets — genuine products, fast delivery across India.`;
  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || description,
    alternates: { canonical: `/collections/${params.handle}` },
    openGraph: {
      title: collection.seo.title || collection.title,
      description: collection.seo.description || description,
      images: collection.image ? [{ url: collection.image.url }] : undefined,
    },
  };
}

// Related sub-category chips, when this handle is a top-level category in our nav.
function findChildren(handle: string) {
  const match = CATEGORY_NAV.find((c) => c.handle === handle);
  return match?.children ?? [];
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { sortKey, reverse } = parseSortParam(searchParams.sort);
  const shopifySortKey = sortKey === "RELEVANCE" ? "COLLECTION_DEFAULT" : sortKey;

  let collection: Awaited<ReturnType<typeof getCollectionByHandle>>;
  try {
    collection = await getCollectionByHandle(params.handle, {
      first: 12,
      sortKey: shopifySortKey as never,
      reverse,
    });
  } catch (error) {
    // Caught here (rather than left to bubble to the global error.tsx)
    // specifically so the real message can be shown below — Next.js
    // redacts error messages in production ONLY for errors that escape a
    // Server Component's render into its own error boundary, not for
    // ones a component catches and displays itself.
    console.error(`[CollectionPage:${params.handle}]`, error);
    const message =
      error instanceof ShopifyApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Unknown error.";
    return (
      <div className="px-4 py-6">
        <ShopifyTroubleshoot reason="detail" detail={message} />
      </div>
    );
  }

  if (!collection) notFound();

  const children = findChildren(params.handle);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: collection.title, url: `${SITE_URL}/collections/${params.handle}` },
  ]);

  return (
    <div className="pb-6">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {isSafeImageUrl(collection.image?.url) && (
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-brand-50">
          <Image
            src={collection.image!.url}
            alt={collection.image!.altText || collection.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      <div className="px-4 pt-4">
        <h1 className="text-lg font-extrabold text-ink">{collection.title}</h1>
        {collection.description && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-light">{collection.description}</p>
        )}
      </div>

      {children.length > 0 && (
        <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
          {children.map((child) => (
            <a
              key={child.handle}
              href={`/collections/${child.handle}`}
              className="shrink-0 rounded-full border border-surface-border bg-white px-3 py-1.5 text-xs font-medium text-ink"
            >
              {child.title}
            </a>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between px-4">
        <p className="text-xs text-ink-light">
          {collection.products.items.length > 0 ? "Showing products" : "No products"}
        </p>
        <SortDropdown />
      </div>

      <div className="mt-3 px-4">
        <RenderErrorBoundary label="Product list">
          <ProductGrid
            key={searchParams.sort || "featured"}
            initialItems={collection.products.items}
            initialPageInfo={collection.products.pageInfo}
            collectionHandle={params.handle}
            emptyTitle="No products in this collection yet"
            emptyDescription="Check back soon, or browse another category."
          />
        </RenderErrorBoundary>
      </div>
    </div>
  );
}
