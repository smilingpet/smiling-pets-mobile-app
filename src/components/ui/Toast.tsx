"use client";

import { useEffect, useState } from "react";

type ToastItem = {
  id: number;
  message: string;
  tone: "success" | "error" | "info";
};

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
let listeners: Listener[] = [];
let nextId = 1;

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

export function showToast(message: string, tone: ToastItem["tone"] = "success") {
  const id = nextId++;
  toasts = [...toasts, { id, message, tone }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 2600);
}

/**
 * Mount once near the root layout. Listens to the module-level toast queue
 * so any component (including the cart context) can call `showToast(...)`
 * without needing a React context or prop drilling.
 */
export function ToastViewport() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener: Listener = (next) => setItems(next);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[70] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      {items.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`animate-fade-in pointer-events-auto w-full max-w-sm rounded-2xl px-4 py-3 text-center text-sm font-medium shadow-card-hover ${
            toast.tone === "success"
              ? "bg-ink text-white"
              : toast.tone === "error"
                ? "bg-red-600 text-white"
                : "bg-white text-ink border border-surface-border"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
