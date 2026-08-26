import { CUSTOMER_REVIEWS } from "@/lib/constants";
import { StarIcon } from "@/components/icons/Icons";

function StarRow({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="flex gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="h-3.5 w-3.5" fill="currentColor" />
        ))}
      </div>
    </div>
  );
}

export function Reviews() {
  return (
    <section className="mt-8 px-4">
      <div className="mb-1 flex items-center gap-2">
        <StarRow />
        <span className="text-xs font-semibold text-ink-light">Excellent — 26,000+ Reviews</span>
      </div>
      <h2 className="mb-4 text-[15px] font-bold tracking-tight text-ink">What Our Customers Say</h2>
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {CUSTOMER_REVIEWS.map((review) => (
          <figure
            key={review.name}
            className="w-72 shrink-0 rounded-2xl border border-surface-border bg-white p-4 shadow-card"
          >
            <StarRow className="mb-2" />
            <blockquote className="mb-3 text-sm leading-relaxed text-ink/90">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <figcaption className="text-xs">
              <span className="font-semibold text-ink">{review.name}</span>
              <span className="text-ink-light"> · {review.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
