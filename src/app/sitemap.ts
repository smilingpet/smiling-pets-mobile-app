import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllCollectionHandlesForSitemap, getAllProductHandlesForSitemap } from "@/lib/shopify/api";
import { isShopifyConfigured } from "@/lib/shopify/client";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/search`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.7 },
  ];

  if (!isShopifyConfigured()) {
    return staticRoutes;
  }

  try {
    const [products, collections] = await Promise.all([
      getAllProductHandlesForSitemap(),
      getAllCollectionHandlesForSitemap(),
    ]);

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${SITE_URL}/products/${p.handle}`,
      lastModified: p.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
      url: `${SITE_URL}/collections/${c.handle}`,
      lastModified: c.updatedAt,
      changeFrequency: "daily",
      priority: 0.7,
    }));

    return [...staticRoutes, ...collectionRoutes, ...productRoutes];
  } catch (error) {
    console.error("[sitemap] Failed to load Shopify data, returning static routes only.", error);
    return staticRoutes;
  }
}
