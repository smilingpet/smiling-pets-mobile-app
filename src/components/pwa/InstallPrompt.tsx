"use client";

import { useEffect, useState } from "react";
import { LogoBadge } from "@/components/brand/Logo";
import { CloseIcon, DownloadIcon } from "@/components/icons/Icons";

const DISMISS_KEY = "smilingpets:installPromptDismissedAt";
const DISMISS_DAYS = 14;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function wasRecentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  const raw = window.localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (Number.isNaN(dismissedAt)) return false;
  const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return daysSince < DISMISS_DAYS;
}

/**
 * Shows a bottom install card:
 *  - On Android/Chrome/Edge: captures the native `beforeinstallprompt`
 *    event and triggers the real install dialog.
 *  - On iOS Safari (which never fires that event): shows manual
 *    "Add to Home Screen" instructions instead.
 * Never shown if the app is already installed/running standalone, or if
 * the person dismissed it within the last two weeks.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showIosSteps, setShowIosSteps] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    if (isIos()) {
      setPlatform("ios");
      const timer = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(timer);
    }

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setPlatform("android");
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setVisible(false);
    setShowIosSteps(false);
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  }

  async function handleInstallClick() {
    if (platform === "ios") {
      setShowIosSteps(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    } else {
      dismiss();
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-[65] px-3">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-surface-border bg-white p-3 shadow-card-hover animate-slide-up">
        <LogoBadge size={44} className="shrink-0 border border-surface-border" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">Install Smiling Pets</p>
          <p className="truncate text-xs text-ink-light">
            {showIosSteps
              ? "Tap Share, then \u201cAdd to Home Screen\u201d"
              : "Add to your home screen for faster shopping"}
          </p>
        </div>
        {!showIosSteps && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold text-white active:scale-95"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            Install
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="shrink-0 rounded-full p-1.5 text-ink-light hover:bg-surface-muted"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
