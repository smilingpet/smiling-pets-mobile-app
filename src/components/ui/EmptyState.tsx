import Link from "next/link";
import { AlertIcon, PawIcon } from "@/components/icons/Icons";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export function EmptyState({
  icon: Icon = PawIcon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon?: IconComponent;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
        <Icon className="h-7 w-7 text-brand-600" />
      </div>
      <h2 className="mb-1 text-base font-semibold text-ink">{title}</h2>
      {description && <p className="mb-5 max-w-xs text-sm text-ink-light">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-card active:scale-95"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this right now. Please check your connection and try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertIcon className="h-7 w-7 text-red-600" />
      </div>
      <h2 className="mb-1 text-base font-semibold text-ink">{title}</h2>
      <p className="mb-5 max-w-xs text-sm text-ink-light">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white active:scale-95"
        >
          Try again
        </button>
      )}
    </div>
  );
}
