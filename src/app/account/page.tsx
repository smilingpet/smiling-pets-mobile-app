import type { Metadata } from "next";
import Link from "next/link";
import { FOOTER_POLICY_LINKS, SUPPORT_EMAIL, SUPPORT_HOURS, SUPPORT_PHONE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Account",
};

function storeAccountUrl(path: string) {
  const domain = (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "").replace(/\/$/, "");
  if (!domain) return "#";
  return `https://${domain}${path}`;
}

export default function AccountPage() {
  return (
    <div className="px-4 pb-8 pt-4">
      <h1 className="mb-1 text-lg font-extrabold text-ink">Account</h1>
      <p className="mb-6 text-sm text-ink-light">
        Sign in to track orders, save addresses and check out faster.
      </p>

      <div className="space-y-3">
        <a
          href={storeAccountUrl("/account/login")}
          className="block rounded-2xl bg-brand-500 py-3.5 text-center text-sm font-bold text-white shadow-card active:scale-95"
        >
          Log In
        </a>
        <a
          href={storeAccountUrl("/account/register")}
          className="block rounded-2xl border border-surface-border py-3.5 text-center text-sm font-semibold text-ink active:scale-95"
        >
          Create Account
        </a>
      </div>

      <div className="mt-8 rounded-2xl border border-surface-border bg-white p-4">
        <h2 className="mb-2 text-sm font-bold text-ink">Order Tracking</h2>
        <p className="text-xs leading-relaxed text-ink-light">
          Once signed in, your recent orders and their delivery status appear under
          &ldquo;Order History&rdquo; in your account. You&apos;ll also receive email
          updates at every step from confirmation to delivery.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-surface-border bg-white p-4">
        <h2 className="mb-2 text-sm font-bold text-ink">Need a hand?</h2>
        <p className="mb-3 text-xs leading-relaxed text-ink-light">
          Our support team is available {SUPPORT_HOURS}.
        </p>
        <div className="flex flex-col gap-2 text-xs">
          <a href={`tel:${SUPPORT_PHONE.replace(/\s+/g, "")}`} className="font-medium text-brand-600">
            Call {SUPPORT_PHONE}
          </a>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-brand-600">
            Email {SUPPORT_EMAIL}
          </a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600">
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-bold text-ink">Policies</h2>
        <div className="flex flex-col gap-2">
          {FOOTER_POLICY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-xs text-ink-light underline">
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
