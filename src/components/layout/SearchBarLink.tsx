import Link from "next/link";
import { SearchIcon } from "@/components/icons/Icons";

export function SearchBarLink() {
  return (
    <Link
      href="/search"
      className="flex items-center gap-2.5 rounded-full border border-surface-border bg-surface-muted px-4 py-2.5 text-sm text-ink-light shadow-sm transition active:scale-[0.99]"
    >
      <SearchIcon className="h-[18px] w-[18px] shrink-0 text-ink-light" />
      <span className="truncate">Search anything for your pet...</span>
    </Link>
  );
}
