import Link from "next/link";
import { SearchBarLink } from "@/components/layout/SearchBarLink";
import { Logo } from "@/components/brand/Logo";
import { PhoneIcon } from "@/components/icons/Icons";
import { SUPPORT_PHONE } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-white/95 backdrop-blur safe-top">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 pt-3">
        <Link href="/" aria-label="Smiling Pets home" className="shrink-0">
          <Logo height={38} priority />
        </Link>
        <a
          href={`tel:${SUPPORT_PHONE.replace(/\s+/g, "")}`}
          aria-label={`Call Smiling Pets support at ${SUPPORT_PHONE}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700"
        >
          <PhoneIcon className="h-[18px] w-[18px]" />
        </a>
      </div>
      <div className="mx-auto max-w-lg px-4 pb-3 pt-3">
        <SearchBarLink />
      </div>
    </header>
  );
}
