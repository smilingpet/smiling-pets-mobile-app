import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/shopify/api";
import { CATEGORY_NAV } from "@/lib/constants";
import { PawIcon, ChevronRightIcon } from "@/components/icons/Icons";
import { isSafeImageUrl } from "@/lib/utils/image";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse every pet food and pet supply category at Smiling Pets.",
  alternates: { canonical: "/categories" },
};

export const revalidate = 300;

export default async function CategoriesPage() {
  const collections = await getCollections(100).catch(() => []);
  const byHandle = new Map(collections.map((c) => [c.handle, c]));

  return (
    <div className="px-4 pb-8 pt-5">
      <h1 className="mb-1 text-xl font-extrabold tracking-tight text-ink">Categories</h1>
      <p className="mb-5 text-sm text-ink-light">Shop by pet type and product category.</p>

      <div className="space-y-4">
        {CATEGORY_NAV.map((category) => {
          const collection = byHandle.get(category.handle);
          const showImage = isSafeImageUrl(collection?.image?.url);
          return (
            <div key={category.handle}>
              <Link
                href={`/collections/${category.handle}`}
                className="flex items-center gap-3 rounded-2xl border border-surface-border bg-white p-3.5 shadow-card transition active:scale-[0.98]"
              >
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-50 to-brand-100">
                  {showImage ? (
                    <Image
                      src={collection!.image!.url}
                      alt={collection!.image!.altText || category.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <PawIcon className="h-5 w-5 text-brand-500" />
                  )}
                </span>
                <span className="flex-1 text-sm font-bold text-ink">{category.title}</span>
                <ChevronRightIcon className="h-[18px] w-[18px] text-ink-light" />
              </Link>
              {category.children.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 pl-2">
                  {category.children.map((child) => (
                    <Link
                      key={child.handle}
                      href={`/collections/${child.handle}`}
                      className="rounded-full border border-surface-border bg-white px-3 py-1.5 text-xs font-medium text-ink-light"
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Link
          href="/collections/all"
          className="block rounded-2xl bg-ink py-3.5 text-center text-sm font-bold text-white active:scale-95"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}
