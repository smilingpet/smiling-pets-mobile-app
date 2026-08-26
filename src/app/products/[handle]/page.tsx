import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductByHandle, getRelatedProducts } from "@/lib/shopify/api";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { InfoAccordion } from "@/components/product/InfoAccordion";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SITE_URL } from "@/lib/constants";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { PawIcon, WhatsAppIcon } from "@/components/icons/Icons";
import { stripHtml, truncate } from "@/lib/utils/format";

export const revalidate = 60;

type Props = { params: { handle: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);
  if (!product) return {};
  const description = truncate(stripHtml(product.description || product.title), 155);
  return {
    title: product.seo.title || `${product.title} | ${product.vendor}`,
    description: product.seo.description || description,
    alternates: { canonical: `/products/${params.handle}` },
    openGraph: {
      title: product.seo.title || product.title,
      description: product.seo.description || description,
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductByHandle(params.handle);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, 8).catch(() => []);

  const jsonLd = productJsonLd(product);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: product.productType || "Products", url: `${SITE_URL}/collections/all` },
    { name: product.title, url: `${SITE_URL}/products/${params.handle}` },
  ]);

  return (
    <div className="pb-8">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <ImageGallery images={product.images} title={product.title} />

      <div className="px-4 pt-2">
        <ProductPurchasePanel product={product} />

        {product.description && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-bold text-ink">Product Description</h2>
            <div
              className="prose-shopify"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        )}

        <div className="mt-6">
          <InfoAccordion
            items={[
              {
                title: "Shipping Information",
                content: (
                  <p>
                    We deliver across India. Orders are typically dispatched within 24–48 hours
                    and delivered in 2–5 business days depending on your location. Shipping
                    charges, if any, are calculated at checkout. See our full{" "}
                    <Link href="/policies/shipping-policy" className="text-brand-600 underline">
                      Shipping &amp; Delivery Policy
                    </Link>
                    .
                  </p>
                ),
              },
              {
                title: "Return Policy",
                content: (
                  <p>
                    Not happy with your order? We offer a hassle-free return process. Read our
                    full{" "}
                    <Link href="/policies/refund-policy" className="text-brand-600 underline">
                      Refund Policy
                    </Link>{" "}
                    for eligibility and instructions.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </div>

      <ProductCarousel title="You may also like" icon={PawIcon} products={related} />

      <div className="mt-6 px-4">
        <WhatsAppSupportInline productTitle={product.title} />
      </div>

      <WhatsAppButton message={`Hi, I have a question about ${product.title}`} />
    </div>
  );
}

function WhatsAppSupportInline({ productTitle }: { productTitle: string }) {
  return (
    <a
      href={`https://api.whatsapp.com/send?phone=919870344899&text=${encodeURIComponent(
        `Hi, I have a question about ${productTitle}`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 py-3 text-sm font-semibold text-[#128C4A]"
    >
      <WhatsAppIcon className="h-[18px] w-[18px]" />
      Need help deciding? Chat with us on WhatsApp
    </a>
  );
}
