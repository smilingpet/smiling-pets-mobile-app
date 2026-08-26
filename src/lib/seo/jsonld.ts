import { SITE_NAME, SITE_URL, SUPPORT_EMAIL, SUPPORT_PHONE_DIAL } from "@/lib/constants";
import type { Product } from "@/lib/shopify/types";
import { stripHtml, truncate } from "@/lib/utils/format";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "PetStore",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512x512.png`,
    telephone: SUPPORT_PHONE_DIAL,
    email: SUPPORT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
    },
    sameAs: [
      "https://www.instagram.com/_smilingpets/",
      "https://www.facebook.com/SSmilingPets/",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: Product) {
  const inStock = product.availableForSale;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: truncate(stripHtml(product.description || product.title), 500),
    image: product.images.map((img) => img.url),
    sku: product.variants[0]?.sku || undefined,
    brand: {
      "@type": "Brand",
      name: product.vendor || SITE_NAME,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.handle}`,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
