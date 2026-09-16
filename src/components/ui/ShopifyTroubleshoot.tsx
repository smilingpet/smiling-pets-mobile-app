"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { AlertIcon } from "@/components/icons/Icons";

type Reason = "not-configured" | "error" | "empty" | "detail";

const COPY: Record<Exclude<Reason, "detail">, { title: string; description: string; checklist: string[] }> = {
  "not-configured": {
    title: "Shopify isn't connected yet",
    description:
      "The app can't find your Shopify credentials. Add these in Vercel → Project Settings → Environment Variables, then redeploy:",
    checklist: [
      "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN — your *.myshopify.com domain, no https:// and no trailing slash",
      "SHOPIFY_STOREFRONT_PRIVATE_TOKEN — the PRIVATE Storefront API token from your Headless sales channel",
    ],
  },
  error: {
    title: "Couldn't reach your Shopify store",
    description:
      "The app has credentials configured, but the request to Shopify's Storefront API failed. This is almost always one of these:",
    checklist: [
      "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is wrong — it must be your *.myshopify.com domain (not your custom domain like smilingpets.in), with no https:// prefix and no trailing slash",
      "SHOPIFY_STOREFRONT_PRIVATE_TOKEN is invalid, expired, or was copied incorrectly — regenerate it in Shopify Admin → your Headless app → API credentials",
      "The token's Storefront API scopes don't include unauthenticated_read_product_listings / unauthenticated_read_collection_listings",
      "You changed an environment variable but haven't redeployed yet — env var changes only take effect after a new deployment",
    ],
  },
  empty: {
    title: "Connected to Shopify, but no products came back",
    description:
      "Your credentials are working — Shopify responded successfully, it just returned zero products. The most common cause by far:",
    checklist: [
      "Your products exist in Shopify Admin but haven't been published to the Headless sales channel — go to a product → Sales channels and apps → make sure your Headless app is checked (this has to be done per product, or in bulk from the Products list)",
      "Double-check you're looking at the right store — the domain in your environment variables should match the store where those products live",
    ],
  },
};

export function ShopifyTroubleshoot({
  reason,
  detail,
}: {
  reason: Reason;
  /** The actual error message, when reason is "detail". Only ever pass a
   * message caught INSIDE a Server Component (not one that escaped to
   * Next's global error boundary) — those get redacted by Next.js in
   * production before they'd ever reach here. */
  detail?: string;
}) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  function handleRetry() {
    setRetrying(true);
    router.refresh();
    window.setTimeout(() => setRetrying(false), 1200);
  }

  if (reason === "detail") {
    return (
      <div className="flex flex-col items-center px-6 py-12 text-center">
        <Logo height={40} className="mb-6 opacity-90" />
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
          <AlertIcon className="h-7 w-7 text-accent-600" />
        </div>
        <h1 className="mb-2 text-base font-bold text-ink">Couldn't load this page</h1>
        <p className="mb-2 max-w-sm text-sm text-ink-light">
          Here's exactly what went wrong, so it can be fixed directly instead of guessed at:
        </p>
        <p className="mb-6 w-full max-w-sm break-words rounded-xl border border-surface-border bg-surface-muted px-3 py-2.5 text-left text-xs leading-relaxed text-ink">
          {detail || "No further detail was provided."}
        </p>
        <button
          type="button"
          onClick={handleRetry}
          disabled={retrying}
          className="rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-card active:scale-95 disabled:opacity-60"
        >
          {retrying ? "Retrying…" : "Retry"}
        </button>
      </div>
    );
  }

  const copy = COPY[reason];

  function handleRetry() {
    setRetrying(true);
    router.refresh();
    window.setTimeout(() => setRetrying(false), 1200);
  }

  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <Logo height={40} className="mb-6 opacity-90" />
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
        <AlertIcon className="h-7 w-7 text-accent-600" />
      </div>
      <h1 className="mb-2 text-base font-bold text-ink">{copy.title}</h1>
      <p className="mb-4 max-w-sm text-sm text-ink-light">{copy.description}</p>
      <ul className="mb-6 w-full max-w-sm space-y-2 text-left">
        {copy.checklist.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-surface-border bg-surface-muted px-3 py-2.5 text-xs leading-relaxed text-ink-light"
          >
            {item}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleRetry}
        disabled={retrying}
        className="rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-card active:scale-95 disabled:opacity-60"
      >
        {retrying ? "Retrying…" : "Retry"}
      </button>
    </div>
  );
}
