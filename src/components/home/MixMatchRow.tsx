import Link from "next/link";
import { MIX_AND_MATCH } from "@/lib/constants";
import { GiftIcon, ChevronRightIcon } from "@/components/icons/Icons";

const CARD_TINTS = [
  { bg: "from-tint-coral to-white", icon: "text-accent-600", cta: "text-accent-600" },
  { bg: "from-tint-green to-white", icon: "text-brand-600", cta: "text-brand-600" },
];

export function MixMatchRow() {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center gap-2 px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-tint-coral text-accent-600">
          <GiftIcon className="h-4 w-4" />
        </span>
        <h2 className="text-[15px] font-bold tracking-tight text-ink">Mix &amp; Match Products</h2>
      </div>
      <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {MIX_AND_MATCH.map((item, index) => {
          const tint = CARD_TINTS[index % CARD_TINTS.length];
          return (
            <Link
              key={item.handle}
              href={`/pages/${item.handle}`}
              className={`group flex w-32 shrink-0 flex-col items-center gap-2.5 rounded-2xl border border-surface-border bg-gradient-to-b p-4 text-center shadow-card transition active:scale-95 ${tint.bg}`}
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ${tint.icon}`}>
                <GiftIcon className="h-5 w-5" />
              </span>
              <span className="line-clamp-2 text-xs font-semibold leading-tight text-ink">
                {item.name}
              </span>
              <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${tint.cta}`}>
                Build a box
                <ChevronRightIcon className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
