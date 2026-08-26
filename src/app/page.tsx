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
import { isShopifyConfigured } from "@/lib/shopify/client";
import { EmptyState } from "@/components/ui/EmptyState";
import { SettingsIcon, DogIcon, TrophyIcon } from "@/components/icons/Icons";
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
      <div className="px-4 py-10">
        <EmptyState
          icon={SettingsIcon}
          title="Shopify isn't connected yet"
          description="Add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_PRIVATE_TOKEN in your Vercel project's Environment Variables, then redeploy."
        />
      </div>
    );
  }

  const [allCollections, exclusiveProducts, bestSellers] = await Promise.all([
    getCollections(30).catch(() => []),
    getProducts({ first: 10, sortKey: "RELEVANCE" }).catch(() => ({
      items: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null },
    })),
    getProducts({ first: 10, sortKey: "BEST_SELLING" }).catch(() => ({
      items: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null },
    })),
  ]);

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

      <BrandsRow />

      <WhyChooseUs />

      <Reviews />

      <Footer />
    </div>
  );
}
