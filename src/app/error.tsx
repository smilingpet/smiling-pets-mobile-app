"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/EmptyState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Next.js redacts the original error message for errors thrown during
  // Server Component rendering in production, replacing it with a short
  // "digest" hash instead (to avoid ever leaking server-side details to
  // the browser). Showing whatever is available here — message and/or
  // digest — means a failure can be diagnosed or reported without needing
  // direct access to Vercel's server logs.
  const detail = [error.message, error.digest ? `Ref: ${error.digest}` : null]
    .filter(Boolean)
    .join(" — ");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <ErrorState
        title="Something went wrong"
        description={
          detail
            ? `We hit a snag loading this page. Your cart is safe. Details: ${detail}`
            : "We hit a snag loading this page. Please try again — your cart is safe."
        }
        onRetry={reset}
      />
    </div>
  );
}
