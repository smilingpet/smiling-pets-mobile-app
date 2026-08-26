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

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <ErrorState
        title="Something went wrong"
        description="We hit a snag loading this page. Please try again — your cart is safe."
        onRetry={reset}
      />
    </div>
  );
}
