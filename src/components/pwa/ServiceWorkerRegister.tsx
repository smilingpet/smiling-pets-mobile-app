"use client";

import { useEffect, useState } from "react";

/**
 * Registers /sw.js and watches for a newly installed worker. When one is
 * found, it shows a small "Update available" bar; tapping it tells the new
 * worker to activate and reloads the page so the user is always running
 * the latest deployed version.
 */
export function ServiceWorkerRegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showUpdateBar, setShowUpdateBar] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | undefined;

    const onControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        registration = reg;

        // A new worker may already be waiting (e.g. user reopened the app).
        if (reg.waiting && navigator.serviceWorker.controller) {
          setWaitingWorker(reg.waiting);
          setShowUpdateBar(true);
        }

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller // ignore the very first install
            ) {
              setWaitingWorker(newWorker);
              setShowUpdateBar(true);
            }
          });
        });
      })
      .catch((err) => {
        console.error("Service worker registration failed:", err);
      });

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    // Periodically check for a new deployed version.
    const interval = setInterval(() => {
      registration?.update().catch(() => {});
    }, 60 * 60 * 1000);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      clearInterval(interval);
    };
  }, []);

  if (!showUpdateBar) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[80] flex items-center justify-between gap-3 bg-ink px-4 py-2.5 text-sm text-white safe-top">
      <span>A new version of Smiling Pets is available.</span>
      <button
        type="button"
        onClick={() => {
          waitingWorker?.postMessage("SKIP_WAITING");
          setShowUpdateBar(false);
        }}
        className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink active:scale-95"
      >
        Update now
      </button>
    </div>
  );
}
