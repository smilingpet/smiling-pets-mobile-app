import { formatMoney, isOnSale, savingsAmount, savingsPercent } from "@/lib/utils/format";
import type { Money } from "@/lib/shopify/types";
import { cn } from "@/lib/utils/format";

export function Price({
  price,
  compareAtPrice,
  size = "md",
  showSavings = true,
  className,
}: {
  price: Money | null | undefined;
  compareAtPrice?: Money | null;
  size?: "sm" | "md" | "lg";
  showSavings?: boolean;
  className?: string;
}) {
  if (!price) return null;
  const onSale = isOnSale(price, compareAtPrice);
  const savings = savingsAmount(price, compareAtPrice);
  const percent = savingsPercent(price, compareAtPrice);

  const priceSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";
  const compareSize = size === "lg" ? "text-base" : "text-xs";

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-bold text-ink", priceSize)}>{formatMoney(price)}</span>
      {onSale && compareAtPrice && (
        <span className={cn("text-ink-light line-through", compareSize)}>
          {formatMoney(compareAtPrice)}
        </span>
      )}
      {onSale && percent !== null && (
        <span className="rounded-md bg-accent-50 px-1.5 py-0.5 text-[11px] font-semibold text-accent-600">
          {percent}% OFF
        </span>
      )}
      {onSale && showSavings && savings && size === "lg" && (
        <span className="w-full text-xs font-medium text-brand-600">
          You save {formatMoney(savings)}
        </span>
      )}
    </div>
  );
}
