"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HERO_BANNERS } from "@/lib/constants";
import { cn } from "@/lib/utils/format";

const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD_PX = 40;

/**
 * Home screen hero slider.
 *
 * Deliberately built so it can NEVER render blank:
 *  - Content (headline/subhead/CTA/background) comes from the local
 *    HERO_BANNERS constant, not a live Shopify fetch that could fail,
 *    return no image, or return an empty collection.
 *  - Every slide always renders a solid brand-coloured gradient div first;
 *    the SVG banner asset layers on top of it, so even in the extremely
 *    unlikely case an asset fails to load, the slide is still a fully
 *    readable, on-brand coloured panel with text and a working CTA.
 *  - Text sits over a dark gradient scrim (not directly on the artwork),
 *    so it stays legible regardless of what's behind it.
 */
export function HeroSlider() {
  const slides = HERO_BANNERS;
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  function goTo(index: number) {
    const next = ((index % slides.length) + slides.length) % slides.length;
    setActive(next);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }

  function onTouchEnd() {
    if (Math.abs(touchDeltaX.current) > SWIPE_THRESHOLD_PX) {
      goTo(touchDeltaX.current < 0 ? active + 1 : active - 1);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative mx-4 mt-3">
      <div
        className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-3xl shadow-card sm:aspect-[16/9]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-400 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const isCoral = slide.theme === "coral";
            return (
              <div key={slide.id} className="relative h-full w-full shrink-0">
                {/* Guaranteed-visible fallback panel, always present underneath the artwork */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br",
                    isCoral
                      ? "from-accent-400 via-accent-500 to-accent-700"
                      : "from-brand-500 via-brand-600 to-brand-800"
                  )}
                />
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 92vw, 480px"
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Readability scrim: text always sits on a darkened zone, never raw artwork */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/85">
                    {slide.subheading}
                  </p>
                  <h2 className="mt-1 max-w-[80%] text-xl font-extrabold leading-tight text-white sm:text-2xl">
                    {slide.headline}
                  </h2>
                  <Link
                    href={slide.href}
                    className={cn(
                      "mt-3 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-xs font-bold shadow-sm active:scale-95",
                      isCoral ? "text-accent-600" : "text-brand-700"
                    )}
                  >
                    {slide.ctaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5" role="tablist" aria-label="Hero banners">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show banner ${index + 1} of ${slides.length}`}
              onClick={() => goTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === active ? "w-6 bg-accent-500" : "w-1.5 bg-surface-border"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
