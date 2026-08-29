"use client";

import { useCart } from "@/lib/cart/cart-context";
import { cn } from "@/lib/utils/format";

export function AddToCartButton({
  variantId,
  title,
  available,
  quantity = 1,
  className,
  fullWidth = false,
  size = "sm",
}: {
  variantId: string | null | undefined;
  title: string;
  available: boolean;
  quantity?: number;
  className?: string;
  fullWidth?: boolean;
  size?: "sm" | "lg";
}) {
  const { addItem, isMutating } = useCart();

  if (!available || !variantId) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "cursor-not-allowed rounded-full bg-surface-border px-4 py-2 text-xs font-semibold text-ink-light",
          fullWidth && "w-full",
          size === "lg" && "py-3 text-sm",
          className
        )}
      >
        Sold Out
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={isMutating}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(variantId, quantity, title);
      }}
      aria-label={`Add ${title} to cart`}
      className={cn(
        "rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition active:scale-95 disabled:opacity-60",
        fullWidth && "w-full",
        size === "lg" && "py-3 text-sm",
        className
      )}
    >
      {isMutating ? "Adding…" : "Add"}
    </button>
  );
}
