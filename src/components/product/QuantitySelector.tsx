"use client";

export function QuantitySelector({
  quantity,
  onChange,
  max,
}: {
  quantity: number;
  onChange: (next: number) => void;
  max?: number | null;
}) {
  const atMax = typeof max === "number" && max > 0 ? quantity >= max : false;

  return (
    <div className="inline-flex items-center rounded-full border border-surface-border">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="flex h-10 w-10 items-center justify-center text-lg text-ink disabled:opacity-30"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold text-ink" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        disabled={atMax}
        className="flex h-10 w-10 items-center justify-center text-lg text-ink disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
