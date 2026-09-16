import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/ui/Price";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ImageOffIcon } from "@/components/icons/Icons";
import { isSafeImageUrl } from "@/lib/utils/image";
import type { ProductCardData } from "@/lib/shopify/types";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardData;
  priority?: boolean;
}) {
  const image = product.featuredImage;
  const showImage = isSafeImageUrl(image?.url);
  const firstVariantAvailable = product.availableForSale;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card transition active:scale-[0.98]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-muted">
        {showImage ? (
          <Image
            src={image!.url}
            alt={image!.altText || product.title}
            fill
            sizes="(max-width: 640px) 50vw, 200px"
            className="object-contain p-3 transition-transform group-hover:scale-105"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOffIcon className="h-8 w-8 text-ink-light/40" />
          </div>
        )}
        {!firstVariantAvailable && (
          <span className="absolute left-2 top-2 rounded-md bg-ink/80 px-2 py-0.5 text-[10px] font-semibold text-white">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        {product.vendor && (
          <span className="truncate text-[11px] font-medium uppercase tracking-wide text-ink-light">
            {product.vendor}
          </span>
        )}
        <h3 className="line-clamp-2 min-h-[2.4em] text-sm font-medium text-ink">
          {product.title}
        </h3>
        <Price
          price={product.priceRange?.minVariantPrice}
          compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
          size="sm"
          showSavings={false}
        />
        <div className="mt-2 flex items-center gap-2">
          <span className="flex-1 rounded-full border border-brand-500 px-3 py-2 text-center text-xs font-semibold text-brand-600">
            View
          </span>
          <AddToCartButton
            variantId={product.firstVariantId}
            title={product.title}
            available={product.firstVariantAvailable && product.availableForSale}
          />
        </div>
      </div>
    </Link>
  );
}
