"use client";

import { useState } from "react";

export function InfoAccordion({
  items,
}: {
  items: { title: string; content: React.ReactNode }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-surface-border border-y border-surface-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold text-ink"
            >
              {item.title}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isOpen && <div className="pb-4 text-sm text-ink-light">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
