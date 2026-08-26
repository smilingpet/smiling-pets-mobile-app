import Link from "next/link";
import { DogIcon } from "@/components/icons/Icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
        <DogIcon className="h-10 w-10 text-brand-600" />
      </div>
      <h1 className="mb-2 text-xl font-bold text-ink">Page not found</h1>
      <p className="mb-6 max-w-xs text-sm text-ink-light">
        We couldn&apos;t find what you were looking for. It may have been moved or is no longer
        available.
      </p>
      <Link
        href="/"
        className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-card active:scale-95"
      >
        Back to Home
      </Link>
    </div>
  );
}
