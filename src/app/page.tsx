import type { Metadata } from "next";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ShopByPet } from "@/components/home/ShopByPet";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BrandsRow } from "@/components/home/BrandsRow";
import { MixMatchRow } from "@/components/home/MixMatchRow";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Reviews } from "@/components/home/Reviews";
import { Footer } from "@/components/layout/Footer";
import { getCollections, getProducts } from "@/lib/shopify/api";
import { isShopifyConfigured, ShopifyApiError } from "@/lib/shopify/client";
import { ShopifyTroubleshoot } from "@/components/ui/ShopifyTroubleshoot";
import { DogIcon, TrophyIcon } from "@/components/icons/Icons";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Pet Food & Supplies Delivered Across India`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default async function HomePage() {
  if (!isShopifyConfigured()) {
    return (
      <div className="px-4 py-6">
        <ShopifyTroubleshoot reason="not-configured" />
      </div>
    );
  }

  // IMPORTANT: unlike an earlier version of this page, Shopify errors are
  // NOT silently swallowed into empty arrays here. A failed request means
  // something is actually wrong (bad domain, bad token, missing scopes) and
  // the person deploying this needs to see that clearly instead of staring
  // at a homepage that looks fine but has no products. Every failure is
  // logged server-side (safe — never logs the token itself) and surfaced
  // with a specific, actionable message and a Retry button.
  let allCollections: Awaited<ReturnType<typeof getCollections>>;
  let exclusiveProducts: Awaited<ReturnType<typeof getProducts>>;
  let bestSellers: Awaited<ReturnType<typeof getProducts>>;

  try {
    [allCollections, exclusiveProducts, bestSellers] = await Promise.all([
      getCollections(100),
      getProducts({ first: 10, sortKey: "RELEVANCE" }),
      getProducts({ first: 10, sortKey: "BEST_SELLING" }),
    ]);
  } catch (error) {
    console.error(
      "[HomePage] Failed to load data from Shopify:",
      error instanceof ShopifyApiError
        ? { message: error.message, status: error.status, errors: error.errors }
        : error
    );
    return (
      <div className="px-4 py-6">
        <ShopifyTroubleshoot reason="error" />
      </div>
    );
  }

  // Request succeeded, but the store genuinely has no products visible to
  // this app — almost always because products aren't published to the
  // Headless sales channel yet. Different problem, different message.
  if (exclusiveProducts.items.length === 0 && bestSellers.items.length === 0) {
    return (
      <div className="px-4 py-6">
        <ShopifyTroubleshoot reason="empty" />
      </div>
    );
  }

  return (
    <div className="pb-6">
      <HeroSlider />

      <ShopByPet />

      <ProductCarousel
        title="Hand Picked Exclusive Pet Products"
        icon={DogIcon}
        products={exclusiveProducts.items}
        viewAllHref="/collections/all"
      />

      <CategoryGrid collections={allCollections} />

      <ProductCarousel
        title="Best Sellers"
        icon={TrophyIcon}
        products={bestSellers.items}
        viewAllHref="/collections/all?sort=best_selling-asc"
      />

      <MixMatchRow />

      <BrandsRow collections={allCollections} />

      <WhyChooseUs />

      <Reviews />

      <Footer />
    </div>
  );
}
