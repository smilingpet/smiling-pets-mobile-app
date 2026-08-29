import Link from "next/link";
import { SHOP_BY_PET } from "@/lib/constants";

// A small curated palette so each pet card reads distinctly at a glance,
// while staying rooted in the two brand colours plus soft neutrals.
const PET_COLORS = [
  { gradient: "from-accent-50 to-accent-100", icon: "text-accent-600" }, // All — coral
  { gradient: "from-brand-50 to-brand-100", icon: "text-brand-600" }, // Puppy — green
  { gradient: "from-amber-50 to-amber-100", icon: "text-amber-600" }, // Dog
  { gradient: "from-sky-50 to-sky-100", icon: "text-sky-600" }, // Cat
  { gradient: "from-violet-50 to-violet-100", icon: "text-violet-600" }, // Bird
  { gradient: "from-cyan-50 to-cyan-100", icon: "text-cyan-600" }, // Fish
];

export function ShopByPet() {
  return (
    <section className="mt-6 px-4">
      <h2 className="mb-3 text-[15px] font-bold tracking-tight text-ink">I&apos;m Shopping For</h2>
      <div className="scrollbar-none -mx-4 flex gap-4 overflow-x-auto px-4">
        {SHOP_BY_PET.map((pet, index) => {
          const Icon = pet.icon;
          const palette = PET_COLORS[index % PET_COLORS.length];
          return (
            <Link
              key={pet.label}
              href={pet.handle === "all" ? "/categories" : `/collections/${pet.handle}`}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-sm ${palette.gradient}`}
              >
                <Icon className={`h-7 w-7 ${palette.icon}`} />
              </span>
              <span className="text-xs font-medium text-ink-light">{pet.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
