import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { InstagramIcon, FacebookIcon, PhoneIcon, MailIcon, MapPinIcon } from "@/components/icons/Icons";
import {
  FOOTER_POLICY_LINKS,
  SOCIAL_LINKS,
  STORE_ADDRESS,
  SUPPORT_EMAIL,
  SUPPORT_HOURS,
  SUPPORT_PHONE,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-surface-border bg-white px-4 pb-8 pt-7">
      <Logo markClassName="h-8 w-8" wordmarkClassName="text-base" />

      <div className="mt-4 space-y-1.5">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-light">
          <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-light" />
          {STORE_ADDRESS}
        </p>
        <p className="flex items-center gap-2 text-xs text-ink-light">
          <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-ink-light" />
          {SUPPORT_PHONE}
        </p>
        <p className="flex items-center gap-2 text-xs text-ink-light">
          <MailIcon className="h-3.5 w-3.5 shrink-0 text-ink-light" />
          {SUPPORT_EMAIL}
        </p>
        <p className="pl-5 text-xs text-ink-light">{SUPPORT_HOURS}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
        {FOOTER_POLICY_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-xs text-ink-light underline underline-offset-2">
            {link.title}
          </Link>
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Smiling Pets on Instagram"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-ink-light"
        >
          <InstagramIcon className="h-[18px] w-[18px]" />
        </a>
        <a
          href={SOCIAL_LINKS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Smiling Pets on Facebook"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-ink-light"
        >
          <FacebookIcon className="h-[18px] w-[18px]" />
        </a>
      </div>

      <p className="mt-6 text-center text-[11px] text-ink-light">
        Made with care for your furry family
      </p>
    </footer>
  );
}
