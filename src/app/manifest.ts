import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Pet Food & Supplies`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/?source=pwa",
    id: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#3fa24f",
    categories: ["shopping", "pets", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Search products",
        url: "/search",
        description: "Search for pet food and supplies",
      },
      {
        name: "View cart",
        url: "/cart",
        description: "View items in your cart",
      },
      {
        name: "Dog Food",
        url: "/collections/dog-food",
        description: "Shop dog food",
      },
      {
        name: "Cat Food",
        url: "/collections/cat-food",
        description: "Shop cat food",
      },
    ],
  };
}
