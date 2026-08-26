import type { Metadata } from "next";
import { LogoMark } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
        <LogoMark className="h-10 w-10 rounded-[22%]" tone="green" />
      </div>
      <h1 className="mb-2 text-xl font-bold text-ink">You&apos;re offline</h1>
      <p className="mb-6 max-w-xs text-sm text-ink-light">
        It looks like you&apos;ve lost your internet connection. Check your network and try
        again — your cart is safely saved for when you&apos;re back online.
      </p>
      <a
        href="/"
        className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-card active:scale-95"
      >
        Try again
      </a>
    </div>
  );
}
