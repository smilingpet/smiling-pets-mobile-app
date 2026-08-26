import Link from "next/link";
import { SHOP_BY_PET } from "@/lib/constants";

export function ShopByPet() {
  return (
    <section className="mt-6 px-4">
      <h2 className="mb-3 text-[15px] font-bold tracking-tight text-ink">I&apos;m Shopping For</h2>
      <div className="scrollbar-none -mx-4 flex gap-4 overflow-x-auto px-4">
        {SHOP_BY_PET.map((pet) => {
          const Icon = pet.icon;
          return (
            <Link
              key={pet.label}
              href={pet.handle === "all" ? "/categories" : `/collections/${pet.handle}`}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-brand-100 shadow-sm">
                <Icon className="h-7 w-7 text-brand-600" />
              </span>
              <span className="text-xs font-medium text-ink-light">{pet.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
