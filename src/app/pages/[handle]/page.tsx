import type { Metadata } from "next";
import Link from "next/link";
import { getPageByHandle } from "@/lib/shopify/api";
import { whatsappLink } from "@/lib/constants";
import { DocumentIcon } from "@/components/icons/Icons";
import { stripHtml, truncate } from "@/lib/utils/format";

export const revalidate = 300;

type Props = { params: { handle: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageByHandle(params.handle).catch(() => null);
  if (!page) return {};
  return {
    title: page.seo.title || page.title,
    description: page.seo.description || truncate(stripHtml(page.bodySummary || page.body), 155),
    alternates: { canonical: `/pages/${params.handle}` },
  };
}

export default async function ShopPage({ params }: Props) {
  const page = await getPageByHandle(params.handle).catch(() => null);

  if (!page) {
    // Graceful fallback for pages not yet created in Shopify Admin
    // (Content → Pages) instead of a hard 404, since these are
    // marketing pages that a merchant may add later.
    return (
      <div className="px-4 py-14 text-center">
        <div className="mb-4 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
            <DocumentIcon className="h-6 w-6 text-brand-600" />
          </span>
        </div>
        <h1 className="mb-1 text-base font-bold text-ink">Page not available yet</h1>
        <p className="mb-5 text-sm text-ink-light">
          Create a page with the handle &ldquo;{params.handle}&rdquo; in Shopify Admin → Content
          → Pages, and it will appear here automatically.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-accent-500 px-5 py-2.5 text-xs font-semibold text-white"
          >
            Go Home
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-surface-border px-5 py-2.5 text-xs font-semibold text-ink"
          >
            Chat With Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-8 pt-4">
      <h1 className="mb-4 text-lg font-extrabold text-ink">{page.title}</h1>
      <div
        className="prose-shopify"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </div>
  );
}
