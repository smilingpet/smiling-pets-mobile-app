import Link from "next/link";
import { TOP_BRANDS } from "@/lib/constants";

export function BrandsRow() {
  return (
    <section className="mt-7 px-4">
      <h2 className="mb-3 text-base font-bold text-ink">Explore Top Brands</h2>
      <div className="scrollbar-none -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
        {TOP_BRANDS.map((brand) => (
          <Link
            key={brand.handle}
            href={`/collections/${brand.handle}`}
            className="flex shrink-0 items-center rounded-full border border-surface-border bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-sm active:scale-95"
          >
            {brand.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
