import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopPolicies } from "@/lib/shopify/api";
import type { ShopPolicy } from "@/lib/shopify/types";

export const revalidate = 3600;

type Props = { params: { handle: string } };

const POLICY_MAP: Record<string, keyof Awaited<ReturnType<typeof getShopPolicies>>> = {
  "terms-of-service": "termsOfService",
  "refund-policy": "refundPolicy",
  "privacy-policy": "privacyPolicy",
  "shipping-policy": "shippingPolicy",
};

async function loadPolicy(handle: string): Promise<ShopPolicy | null> {
  const key = POLICY_MAP[handle];
  if (!key) return null;
  const policies = await getShopPolicies();
const policy = policies[key] as ShopPolicy | null;
return policy;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const policy = await loadPolicy(params.handle).catch(() => null);
  if (!policy) return {};
  return {
    title: policy.title,
    alternates: { canonical: `/policies/${params.handle}` },
  };
}

export default async function PolicyPage({ params }: Props) {
  if (!POLICY_MAP[params.handle]) notFound();
  const policy = await loadPolicy(params.handle).catch(() => null);

  if (!policy) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-sm text-ink-light">
          This policy hasn&apos;t been set up in Shopify Admin yet. Add it under Settings →
          Policies, and it will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-8 pt-4">
      <h1 className="mb-4 text-lg font-extrabold text-ink">{policy.title}</h1>
      <div
        className="prose-shopify"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: policy.body }}
      />
    </div>
  );
}
