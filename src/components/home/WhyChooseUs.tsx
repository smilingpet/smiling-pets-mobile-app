import { WHY_CHOOSE_US } from "@/lib/constants";

const ACCENTS = [
  { bg: "bg-tint-coral", icon: "text-accent-600" },
  { bg: "bg-tint-green", icon: "text-brand-600" },
];

export function WhyChooseUs() {
  return (
    <section className="mt-8 px-4">
      <h2 className="mb-1 text-[15px] font-bold tracking-tight text-ink">Why Choose Smiling Pets?</h2>
      <p className="mb-4 text-sm text-ink-light">
        We&apos;re not just a pet food provider — we&apos;re your pet&apos;s best friend.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {WHY_CHOOSE_US.map((item, index) => {
          const Icon = item.icon;
          const accent = ACCENTS[index % ACCENTS.length];
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-surface-border bg-white p-4 shadow-card"
            >
              <span className={`mb-2.5 flex h-9 w-9 items-center justify-center rounded-full ${accent.bg}`}>
                <Icon className={`h-[18px] w-[18px] ${accent.icon}`} />
              </span>
              <h3 className="mb-1 text-sm font-bold text-ink">{item.title}</h3>
              <p className="text-xs leading-relaxed text-ink-light">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
