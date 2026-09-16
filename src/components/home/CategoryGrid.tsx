import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/shopify/types";
import { HOME_CATEGORIES } from "@/lib/constants";
import { PawIcon } from "@/components/icons/Icons";
import { isSafeImageUrl } from "@/lib/utils/image";

export function CategoryGrid({ collections }: { collections: Collection[] }) {
  const byHandle = new Map(collections.map((c) => [c.handle, c]));
  const items = HOME_CATEGORIES.map((entry) => ({
    ...entry,
    collection: byHandle.get(entry.handle),
  })).filter((entry) => entry.collection);

  if (items.length === 0) return null;

  return (
    <section className="mt-8 px-4">
      <h2 className="mb-3 text-[15px] font-bold tracking-tight text-ink">
        Browse Pet Food by Categories
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {items.map(({ handle, title, collection }) => {
          const showImage = isSafeImageUrl(collection?.image?.url);
          return (
            <Link
              key={handle}
              href={`/collections/${handle}`}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-surface-border bg-white px-2 py-4 text-center shadow-card transition active:scale-95"
            >
              <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-50 to-brand-100">
                {showImage ? (
                  <Image
                    src={collection!.image!.url}
                    alt={collection!.image!.altText || title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <PawIcon className="h-6 w-6 text-brand-500" />
                )}
              </span>
              <span className="line-clamp-2 text-[11.5px] font-semibold leading-tight text-ink">
                {title}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
