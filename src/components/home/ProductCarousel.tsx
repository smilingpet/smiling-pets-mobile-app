import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronRightIcon } from "@/components/icons/Icons";
import type { ProductCardData } from "@/lib/shopify/types";
import type { ComponentType, SVGProps } from "react";

export function ProductCarousel({
  title,
  icon: Icon,
  products,
  viewAllHref,
}: {
  title: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  products: ProductCardData[];
  viewAllHref?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="flex items-center gap-2 text-[15px] font-bold tracking-tight text-ink">
          {Icon && (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Icon className="h-4 w-4" />
            </span>
          )}
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-0.5 text-xs font-semibold text-brand-600"
          >
            View all
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {products.map((product) => (
          <div key={product.id} className="w-[9.5rem] shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
