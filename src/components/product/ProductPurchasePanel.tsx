"use client";

import { useMemo, useState } from "react";
import { Price } from "@/components/ui/Price";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { useCart } from "@/lib/cart/cart-context";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/format";

function findVariantForOptions(
  variants: ProductVariant[],
  selected: Record<string, string>
): ProductVariant | undefined {
  return variants.find((variant) =>
    variant.selectedOptions.every((opt) => selected[opt.name] === opt.value)
  );
}

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem, isMutating } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const hasRealOptions = product.options.some(
    (o) => !(o.name === "Title" && o.values.length === 1 && o.values[0] === "Default Title")
  );

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initialVariant = product.variants.find((v) => v.availableForSale) || product.variants[0];
    const initial: Record<string, string> = {};
    initialVariant?.selectedOptions.forEach((opt) => {
      initial[opt.name] = opt.value;
    });
    return initial;
  });

  const selectedVariant = useMemo(
    () => findVariantForOptions(product.variants, selectedOptions) || product.variants[0],
    [product.variants, selectedOptions]
  );

  function isValueAvailable(optionName: string, value: string): boolean {
    const candidate = { ...selectedOptions, [optionName]: value };
    const match = findVariantForOptions(product.variants, candidate);
    return match ? match.availableForSale : true;
  }

  async function handleBuyNow() {
    if (!selectedVariant?.id || !selectedVariant.availableForSale) return;
    setIsBuyingNow(true);
    const cart = await addItem(selectedVariant.id, quantity, product.title);
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
      return;
    }
    setIsBuyingNow(false);
  }

  const available = Boolean(selectedVariant?.availableForSale);
  const stockLabel = (() => {
    if (!selectedVariant) return null;
    if (!selectedVariant.availableForSale) return "Out of stock";
    if (
      typeof selectedVariant.quantityAvailable === "number" &&
      selectedVariant.quantityAvailable > 0 &&
      selectedVariant.quantityAvailable <= 5
    ) {
      return `Only ${selectedVariant.quantityAvailable} left in stock`;
    }
    return "In stock";
  })();

  return (
    <div>
      {product.vendor && (
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-light">
          {product.vendor}
        </p>
      )}
      <h1 className="mt-1 text-xl font-bold leading-snug text-ink">{product.title}</h1>

      <div className="mt-2">
        <Price
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
          size="lg"
        />
      </div>

      <p
        className={cn(
          "mt-2 text-xs font-medium",
          available ? "text-brand-600" : "text-red-600"
        )}
      >
        {stockLabel}
      </p>

      {hasRealOptions &&
        product.options.map((option) => (
          <div key={option.id} className="mt-4">
            <p className="mb-2 text-sm font-semibold text-ink">{option.name}</p>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                const isAvailable = isValueAvailable(option.name, value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))
                    }
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-medium transition",
                      isSelected
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-surface-border bg-white text-ink",
                      !isAvailable && "opacity-40"
                    )}
                  >
                    {value}
                    {!isAvailable && " (Sold out)"}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-ink">Quantity</p>
        <QuantitySelector
          quantity={quantity}
          onChange={setQuantity}
          max={selectedVariant?.quantityAvailable}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={!available || isMutating}
          onClick={() => selectedVariant?.id && addItem(selectedVariant.id, quantity, product.title)}
          className="flex-1 rounded-full border-2 border-accent-500 py-3 text-sm font-bold text-accent-600 active:scale-95 disabled:opacity-40"
        >
          {isMutating && !isBuyingNow ? "Adding…" : "Add to Cart"}
        </button>
        <button
          type="button"
          disabled={!available || isMutating}
          onClick={handleBuyNow}
          className="flex-1 rounded-full bg-accent-500 py-3 text-sm font-bold text-white shadow-card active:scale-95 disabled:opacity-40"
        >
          {isBuyingNow ? "Please wait…" : "Buy Now"}
        </button>
      </div>
    </div>
  );
}
