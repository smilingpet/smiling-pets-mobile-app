import { WHY_CHOOSE_US } from "@/lib/constants";

export function WhyChooseUs() {
  return (
    <section className="mt-8 bg-brand-500 px-4 py-8 text-white">
      <h2 className="mb-1 text-lg font-extrabold tracking-tight">Why Choose Smiling Pets?</h2>
      <p className="mb-6 text-sm text-white/90">
        We&apos;re not just a pet food provider — we&apos;re your pet&apos;s best friend.
      </p>
      <div className="grid grid-cols-2 gap-3.5">
        {WHY_CHOOSE_US.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <span className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Icon className="h-[18px] w-[18px] text-white" />
              </span>
              <h3 className="mb-1 text-sm font-bold">{item.title}</h3>
              <p className="text-xs leading-relaxed text-white/85">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
