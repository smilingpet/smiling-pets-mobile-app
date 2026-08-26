"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOffIcon } from "@/components/icons/Icons";
import type { ShopifyImage } from "@/lib/shopify/types";

export function ImageGallery({ images, title }: { images: ShopifyImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const gallery = images.length > 0 ? images : [];

  if (gallery.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-surface-muted">
        <ImageOffIcon className="h-12 w-12 text-ink-light/40" />
      </div>
    );
  }

  const active = gallery[activeIndex];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <Image
          src={active.url}
          alt={active.altText || title}
          fill
          sizes="(max-width: 640px) 100vw, 480px"
          className="object-contain p-4"
          priority
        />
      </div>
      {gallery.length > 1 && (
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-3">
          {gallery.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${gallery.length}`}
              aria-current={index === activeIndex}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white ${
                index === activeIndex ? "border-brand-500" : "border-surface-border"
              }`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
