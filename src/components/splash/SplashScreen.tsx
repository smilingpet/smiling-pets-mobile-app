"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";

const MIN_VISIBLE_MS = 550;
const SESSION_KEY = "smilingpets:splashShown";

/**
 * Branded splash screen shown briefly on cold load.
 *
 * Android/Chrome auto-generates a native splash from the manifest's
 * `background_color` + icon when the installed PWA is launched — that part
 * needs no code. This component covers the gap Android's auto-splash
 * doesn't: the very first paint of the page itself (and iOS Safari, which
 * has no equivalent auto-splash), so the app never flashes an unstyled or
 * half-loaded screen before the UI is ready.
 *
 * It renders instantly (server-rendered, no flash-of-missing-content),
 * shows for a minimum time so it doesn't flicker on fast connections, and
 * fades out once the app has mounted client-side. It only shows once per
 * browser session (not on every in-app navigation).
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — just show it once.
    }

    if (alreadyShown) {
      setVisible(false);
      setShouldRender(false);
      return;
    }

    const start = Date.now();
    const finish = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        setFading(true);
        window.setTimeout(() => {
          setVisible(false);
          setShouldRender(false);
        }, 300);
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // ignore
        }
      }, remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      // Safety net in case "load" never fires promptly.
      const fallback = window.setTimeout(finish, 2500);
      return () => {
        window.removeEventListener("load", finish);
        window.clearTimeout(fallback);
      };
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-500 transition-opacity duration-300 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <span className="flex h-20 w-20 items-center justify-center rounded-[26%] bg-white/15 p-3 animate-fade-in">
          <LogoMark tone="white" className="h-full w-full" />
        </span>
        <span className="text-xl font-extrabold tracking-tight text-white">Smiling Pets</span>
      </div>
      <div className="absolute bottom-10 flex items-center gap-1.5" aria-hidden="true">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
      </div>
    </div>
  );
}
