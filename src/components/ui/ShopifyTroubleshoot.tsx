"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { AlertIcon } from "@/components/icons/Icons";

type Reason = "not-configured" | "error" | "empty" | "detail";

const COPY: Record<
  Reason,
  { title: string; description: string; checklist: string[] }
> = {
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
      "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is wrong — it must be your *.myshopify.com domain, with no https:// prefix and no trailing slash",
      "SHOPIFY_STOREFRONT_PRIVATE_TOKEN is invalid, expired, or was copied incorrectly",
      "The token's Storefront API scopes don't include product and collection permissions",
      "You changed an environment variable but haven't redeployed yet",
    ],
  },
  empty: {
    title: "Connected to Shopify, but no products came back",
    description:
      "Your credentials are working, but Shopify returned zero products.",
    checklist: [
      "Make sure your products are published to the Headless sales channel",
      "Confirm that the configured domain belongs to the correct Shopify store",
    ],
  },

 detail: {
    title: "Something went wrong",
    description: "We hit a snag while loading this page.",
    checklist: [],
  },
};

export function ShopifyTroubleshoot({
  reason,
  detail,
}: {
  reason: Reason;
  detail?: string;
}) {  const router = useRouter();
  const [retrying, setRetrying] = useState(false);
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

      <h1 className="mb-2 text-base font-bold text-ink">
        {copy.title}
      </h1>

      <p className="mb-4 max-w-sm text-sm text-ink-light">
{detail || copy.description}
      
      </p>

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
