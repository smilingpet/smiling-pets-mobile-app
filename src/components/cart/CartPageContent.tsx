"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { DiscountCodeForm } from "@/components/cart/DiscountCodeForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackageIcon } from "@/components/icons/Icons";
import { Price } from "@/components/ui/Price";
import { formatMoney } from "@/lib/utils/format";

export function CartPageContent() {
  const { cart, isLoading, isMutating } = useCart();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 px-4 py-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="skeleton h-20 w-20 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
              <div className="skeleton h-8 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <EmptyState
        icon={PackageIcon}
        title="Your cart is empty"
        description="Looks like you haven't added anything yet. Let's find something your pet will love."
        actionLabel="Continue Shopping"
        actionHref="/"
      />
    );
  }

  return (
    <div className="px-4 pb-6 pt-3">
      <h1 className="mb-3 text-lg font-extrabold text-ink">
        Your Cart <span className="text-sm font-medium text-ink-light">({cart.totalQuantity})</span>
      </h1>

      <div>
        {cart.lines.map((line) => (
          <CartLineItem key={line.id} line={line} />
        ))}
      </div>

      <DiscountCodeForm />

      <div className="mt-5 space-y-1.5 border-t border-surface-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-light">Subtotal</span>
          <span className="font-semibold text-ink">{formatMoney(cart.cost.subtotalAmount)}</span>
        </div>
        {cart.cost.totalTaxAmount && Number(cart.cost.totalTaxAmount.amount) > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-light">Estimated tax</span>
            <span className="font-semibold text-ink">{formatMoney(cart.cost.totalTaxAmount)}</span>
          </div>
        )}
        <p className="pt-1 text-xs text-ink-light">
          Shipping and any remaining discounts are calculated at checkout.
        </p>
        <div className="flex items-center justify-between pt-2 text-base">
          <span className="font-bold text-ink">Total</span>
          <Price price={cart.cost.totalAmount} size="lg" showSavings={false} />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <a
          href={cart.checkoutUrl}
          className="block rounded-full bg-brand-500 py-3.5 text-center text-sm font-bold text-white shadow-card active:scale-95"
          aria-disabled={isMutating}
        >
          Secure Checkout
        </a>
        <Link
          href="/"
          className="block rounded-full border border-surface-border py-3 text-center text-sm font-semibold text-ink"
        >
          Continue Shopping
        </Link>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-light">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3.5 19 6v5.5c0 5-3 8-7 9-4-1-7-4-7-9V6l7-2.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        Payments and orders are processed securely through Shopify Checkout.
      </p>
    </div>
  );
}
