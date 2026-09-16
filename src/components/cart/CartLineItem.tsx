"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { Price } from "@/components/ui/Price";
import { ImageOffIcon, TrashIcon } from "@/components/icons/Icons";
import { isSafeImageUrl } from "@/lib/utils/image";
import type { CartLine } from "@/lib/shopify/types";

export function CartLineItem({ line }: { line: CartLine }) {
  const { updateItemQuantity, removeItem } = useCart();
  const [isBusy, setIsBusy] = useState(false);
  const showImage = isSafeImageUrl(line.merchandise.image?.url);

  const variantOptions = line.merchandise.selectedOptions.filter(
    (opt) => !(opt.name === "Title" && opt.value === "Default Title")
  );

  async function handleQuantityChange(next: number) {
    setIsBusy(true);
    await updateItemQuantity(line.id, next);
    setIsBusy(false);
  }

  return (
    <div className="flex gap-3 border-b border-surface-border py-4">
      <Link
        href={`/products/${line.merchandise.product.handle}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted"
      >
        {showImage ? (
          <Image
            src={line.merchandise.image!.url}
            alt={line.merchandise.image!.altText || line.merchandise.product.title}
            fill
            sizes="80px"
            className="object-contain p-1.5"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-muted">
            <ImageOffIcon className="h-6 w-6 text-ink-light/50" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${line.merchandise.product.handle}`}
              className="line-clamp-2 text-sm font-medium text-ink"
            >
              {line.merchandise.product.title}
            </Link>
            {variantOptions.length > 0 && (
              <p className="mt-0.5 text-xs text-ink-light">
                {variantOptions.map((o) => o.value).join(" / ")}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Remove item"
            onClick={() => removeItem(line.id)}
            className="shrink-0 text-ink-light"
          >
            <TrashIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        {!line.merchandise.availableForSale && (
          <p className="mt-1 text-xs font-medium text-red-600">No longer available</p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <QuantitySelector
            quantity={line.quantity}
            onChange={handleQuantityChange}
            max={line.merchandise.quantityAvailable}
          />
          <Price
            price={{
              amount: String(Number(line.merchandise.price.amount) * line.quantity),
              currencyCode: line.merchandise.price.currencyCode,
            }}
            size="sm"
          />
        </div>
        {isBusy && <p className="mt-1 text-[11px] text-ink-light">Updating…</p>}
      </div>
    </div>
  );
}
