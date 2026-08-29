import Image from "next/image";
import Link from "next/link";
import { TOP_BRANDS } from "@/lib/constants";
import type { Collection } from "@/lib/shopify/types";

const FALLBACK_TINTS = [
  "bg-tint-coral text-accent-600",
  "bg-tint-green text-brand-600",
];

/**
 * "Top Brands" row. Each brand card uses the REAL image set on that brand's
 * Shopify collection (Shopify Admin → Collections → [brand] → Image) —
 * live data, not a fabricated logo. If a merchant hasn't set an image for
 * a given brand collection yet, that card falls back to a clean colourful
 * monogram (never a fake/invented logo) until one is added in Shopify.
 */
export function BrandsRow({ collections }: { collections: Collection[] }) {
  const byHandle = new Map(collections.map((c) => [c.handle, c]));

  return (
    <section className="mt-8 px-4">
      <h2 className="mb-3 text-[15px] font-bold tracking-tight text-ink">Explore Top Brands</h2>
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {TOP_BRANDS.map((brand, index) => {
          const collection = byHandle.get(brand.handle);
          const tint = FALLBACK_TINTS[index % FALLBACK_TINTS.length];
          return (
            <Link
              key={brand.handle}
              href={`/collections/${brand.handle}`}
              className="flex w-24 shrink-0 flex-col items-center gap-2 rounded-2xl border border-surface-border bg-white p-3 shadow-card transition active:scale-95"
            >
              <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-surface-muted">
                {collection?.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText || brand.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <span className={`flex h-full w-full items-center justify-center text-sm font-extrabold ${tint}`}>
                    {brand.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </span>
              <span className="line-clamp-2 text-center text-[11px] font-semibold leading-tight text-ink">
                {brand.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
