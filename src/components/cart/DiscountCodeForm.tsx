"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";

export function DiscountCodeForm() {
  const { cart, applyDiscountCode, removeDiscountCodes, isMutating } = useCart();
  const [code, setCode] = useState("");

  const appliedCodes = cart?.discountCodes.filter((d) => d.applicable) ?? [];

  return (
    <div className="mt-4">
      {appliedCodes.length > 0 ? (
        <div className="flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2.5">
          <p className="text-xs font-semibold text-brand-700">
            Applied: {appliedCodes.map((c) => c.code).join(", ")}
          </p>
          <button
            type="button"
            onClick={() => removeDiscountCodes()}
            className="text-xs font-medium text-ink-light underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!code.trim()) return;
            const applied = await applyDiscountCode(code.trim());
            if (applied) setCode("");
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Discount code"
            aria-label="Discount code"
            className="flex-1 rounded-full border border-surface-border px-4 py-2.5 text-sm outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={isMutating || !code.trim()}
            className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-white disabled:opacity-40"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
}
