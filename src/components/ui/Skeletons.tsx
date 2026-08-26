export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-white">
      <div className="skeleton aspect-square w-full" />
      <div className="space-y-2 p-3">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-8 w-full rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CarouselSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-36 shrink-0">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse px-4 py-4">
      <div className="skeleton mb-4 aspect-square w-full rounded-2xl" />
      <div className="skeleton mb-2 h-3 w-1/4 rounded" />
      <div className="skeleton mb-4 h-6 w-3/4 rounded" />
      <div className="skeleton mb-6 h-5 w-1/3 rounded" />
      <div className="skeleton mb-2 h-10 w-full rounded-xl" />
      <div className="skeleton h-10 w-full rounded-xl" />
    </div>
  );
}
