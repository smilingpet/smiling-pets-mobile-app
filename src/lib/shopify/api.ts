import "server-only";
import { shopifyFetch } from "./client";
import {
  addCartLinesMutation,
  createCartMutation,
  getCartQuery,
  getCollectionByHandleQuery,
  getCollectionsQuery,
  getPageByHandleQuery,
  getProductByHandleQuery,
  getProductsQuery,
  getRelatedProductsQuery,
  getShopPoliciesQuery,
  getSitemapCollectionsQuery,
  getSitemapProductsQuery,
  removeCartLinesMutation,
  searchProductsQuery,
  updateCartDiscountMutation,
  updateCartLinesMutation,
} from "./queries";
import type {
  Cart,
  Collection,
  CollectionWithProducts,
  PageInfo,
  Product,
  ProductCardData,
  ShopPage,
  ShopPolicy,
  SortKeyProducts,
} from "./types";

// Generic helper: Shopify's GraphQL API returns paginated fields as
// { edges: [{ node, cursor }], pageInfo }. This flattens that shape.
function edgesToNodes<T>(connection?: { edges: { node: T; cursor?: string }[] }): T[] {
  if (!connection) return [];
  return connection.edges.map((edge) => edge.node);
}

const emptyPageInfo: PageInfo = {
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
  endCursor: null,
};

// ───────────────────────── Products ─────────────────────────

export async function getProductByHandle(handle: string): Promise<Product | null> {
  type Response = { product: RawProduct | null };
  const data = await shopifyFetch<Response>({
    query: getProductByHandleQuery,
    variables: { handle },
    tags: [`product-${handle}`, "products"],
    revalidate: 60,
  });
  if (!data.product) return null;
  return normalizeProduct(data.product);
}

export async function getProducts(options: {
  first?: number;
  after?: string | null;
  sortKey?: SortKeyProducts;
  reverse?: boolean;
  query?: string;
  /** Forwarded to Shopify only when this call originates from an actual buyer request (e.g. the /api/products "Load more" route) — see buyer-ip.ts. Omit for cached Server Component page loads so ISR keeps working. */
  buyerIp?: string;
}): Promise<{ items: ProductCardData[]; pageInfo: PageInfo }> {
  type Response = {
    products: { edges: { node: RawProductCard; cursor: string }[]; pageInfo: PageInfo };
  };
  // Shopify's top-level `products` query uses the ProductSortKeys enum,
  // which (unlike ProductCollectionSortKeys) spells this value CREATED_AT.
  const wireSortKey = options.sortKey === "CREATED" ? "CREATED_AT" : options.sortKey ?? "RELEVANCE";
  const data = await shopifyFetch<Response>({
    query: getProductsQuery,
    variables: {
      first: options.first ?? 20,
      after: options.after ?? null,
      sortKey: wireSortKey,
      reverse: options.reverse ?? false,
      query: options.query ?? null,
    },
    tags: ["products"],
    revalidate: 60,
    buyerIp: options.buyerIp,
  });
  return {
    items: normalizeProductCards(edgesToNodes(data.products)),
    pageInfo: data.products?.pageInfo ?? emptyPageInfo,
  };
}

export async function searchProducts(
  searchTerm: string,
  options: { first?: number; after?: string | null; buyerIp?: string } = {}
): Promise<{ items: ProductCardData[]; pageInfo: PageInfo; suggestions: ProductCardData[] }> {
  if (!searchTerm.trim()) {
    return { items: [], pageInfo: emptyPageInfo, suggestions: [] };
  }
  type Response = {
    search: { edges: { node: RawProductCard; cursor: string }[]; pageInfo: PageInfo };
    predictiveSearch: { edges: { node: RawProductCard; cursor: string }[] };
  };
  const data = await shopifyFetch<Response>({
    query: searchProductsQuery,
    variables: {
      query: searchTerm,
      first: options.first ?? 20,
      after: options.after ?? null,
    },
    tags: ["products"],
    revalidate: 30,
    buyerIp: options.buyerIp,
  });
  return {
    items: normalizeProductCards(edgesToNodes(data.search)),
    pageInfo: data.search?.pageInfo ?? emptyPageInfo,
    suggestions: normalizeProductCards(edgesToNodes(data.predictiveSearch)),
  };
}

export async function getRelatedProducts(
  productId: string,
  first = 8
): Promise<ProductCardData[]> {
  type Response = {
    productRecommendations: RawProductCard[] | null;
    fallback: { edges: { node: RawProductCard }[] };
  };
  const data = await shopifyFetch<Response>({
    query: getRelatedProductsQuery,
    variables: { productId, first },
    tags: ["products"],
    revalidate: 120,
  });
  const recs = data.productRecommendations ?? [];
  if (recs.length > 0) return normalizeProductCards(recs.slice(0, first));
  return normalizeProductCards(edgesToNodes(data.fallback)).slice(0, first);
}

// ───────────────────────── Collections ─────────────────────────

export async function getCollections(first = 20): Promise<Collection[]> {
  type Response = { collections: { edges: { node: Collection }[] } };
  const data = await shopifyFetch<Response>({
    query: getCollectionsQuery,
    variables: { first },
    tags: ["collections"],
    revalidate: 300,
  });
  return edgesToNodes(data.collections);
}

export async function getCollectionByHandle(
  handle: string,
  options: {
    first?: number;
    after?: string | null;
    sortKey?: "BEST_SELLING" | "CREATED" | "PRICE" | "TITLE" | "COLLECTION_DEFAULT" | "MANUAL";
    reverse?: boolean;
    filters?: Record<string, unknown>[];
    buyerIp?: string;
  } = {}
): Promise<CollectionWithProducts | null> {
  type Response = {
    collection:
      | (Collection & {
          products: { edges: { node: RawProductCard; cursor: string }[]; pageInfo: PageInfo };
        })
      | null;
  };
  const data = await shopifyFetch<Response>({
    query: getCollectionByHandleQuery,
    variables: {
      handle,
      first: options.first ?? 20,
      after: options.after ?? null,
      sortKey: options.sortKey ?? "COLLECTION_DEFAULT",
      reverse: options.reverse ?? false,
      filters: options.filters ?? [],
    },
    tags: [`collection-${handle}`, "collections"],
    revalidate: 60,
    buyerIp: options.buyerIp,
  });
  if (!data.collection) return null;
  return {
    ...data.collection,
    products: {
      items: normalizeProductCards(edgesToNodes(data.collection.products)),
      pageInfo: data.collection.products?.pageInfo ?? emptyPageInfo,
    },
  };
}

// ───────────────────────── Cart ─────────────────────────

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[] = [],
  buyerIp?: string
): Promise<Cart> {
  type Response = { cartCreate: { cart: RawCart; userErrors: UserError[] } };
  const data = await shopifyFetch<Response>({
    query: createCartMutation,
    variables: { lines },
    cache: "no-store",
    buyerIp,
  });
  assertNoUserErrors(data.cartCreate.userErrors, "Could not create cart");
  return normalizeCart(data.cartCreate.cart);
}

export async function getCart(cartId: string, buyerIp?: string): Promise<Cart | null> {
  type Response = { cart: RawCart | null };
  const data = await shopifyFetch<Response>({
    query: getCartQuery,
    variables: { cartId },
    cache: "no-store",
    buyerIp,
  });
  if (!data.cart) return null;
  return normalizeCart(data.cart);
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
  buyerIp?: string
): Promise<Cart> {
  type Response = { cartLinesAdd: { cart: RawCart; userErrors: UserError[] } };
  const data = await shopifyFetch<Response>({
    query: addCartLinesMutation,
    variables: { cartId, lines },
    cache: "no-store",
    buyerIp,
  });
  assertNoUserErrors(data.cartLinesAdd.userErrors, "Could not add item to cart");
  return normalizeCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
  buyerIp?: string
): Promise<Cart> {
  type Response = { cartLinesUpdate: { cart: RawCart; userErrors: UserError[] } };
  const data = await shopifyFetch<Response>({
    query: updateCartLinesMutation,
    variables: { cartId, lines },
    cache: "no-store",
    buyerIp,
  });
  assertNoUserErrors(data.cartLinesUpdate.userErrors, "Could not update cart");
  return normalizeCart(data.cartLinesUpdate.cart);
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[],
  buyerIp?: string
): Promise<Cart> {
  type Response = { cartLinesRemove: { cart: RawCart; userErrors: UserError[] } };
  const data = await shopifyFetch<Response>({
    query: removeCartLinesMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
    buyerIp,
  });
  assertNoUserErrors(data.cartLinesRemove.userErrors, "Could not remove item from cart");
  return normalizeCart(data.cartLinesRemove.cart);
}

export async function updateCartDiscountCodes(
  cartId: string,
  codes: string[],
  buyerIp?: string
): Promise<Cart> {
  type Response = { cartDiscountCodesUpdate: { cart: RawCart; userErrors: UserError[] } };
  const data = await shopifyFetch<Response>({
    query: updateCartDiscountMutation,
    variables: { cartId, discountCodes: codes },
    cache: "no-store",
    buyerIp,
  });
  assertNoUserErrors(data.cartDiscountCodesUpdate.userErrors, "Could not apply discount code");
  return normalizeCart(data.cartDiscountCodesUpdate.cart);
}

// ───────────────────────── Shop / Policies / Pages ─────────────────────────

export async function getShopPolicies(): Promise<{
  name: string;
  url: string;
  shippingPolicy: ShopPolicy | null;
  refundPolicy: ShopPolicy | null;
  privacyPolicy: ShopPolicy | null;
  termsOfService: ShopPolicy | null;
}> {
  type Response = {
    shop: {
      name: string;
      primaryDomain: { url: string };
      shippingPolicy: ShopPolicy | null;
      refundPolicy: ShopPolicy | null;
      privacyPolicy: ShopPolicy | null;
      termsOfService: ShopPolicy | null;
    };
  };
  const data = await shopifyFetch<Response>({
    query: getShopPoliciesQuery,
    tags: ["shop"],
    revalidate: 3600,
  });
  return {
    name: data.shop.name,
    url: data.shop.primaryDomain.url,
    shippingPolicy: data.shop.shippingPolicy,
    refundPolicy: data.shop.refundPolicy,
    privacyPolicy: data.shop.privacyPolicy,
    termsOfService: data.shop.termsOfService,
  };
}

export async function getPageByHandle(handle: string): Promise<ShopPage | null> {
  type Response = { page: ShopPage | null };
  const data = await shopifyFetch<Response>({
    query: getPageByHandleQuery,
    variables: { handle },
    tags: [`page-${handle}`],
    revalidate: 300,
  });
  return data.page;
}

export async function getAllProductHandlesForSitemap(): Promise<
  { handle: string; updatedAt: string }[]
> {
  const all: { handle: string; updatedAt: string }[] = [];
  let after: string | null = null;
  let hasNextPage = true;
  let guard = 0;
  while (hasNextPage && guard < 50) {
    type Response = {
      products: {
        edges: { node: { handle: string; updatedAt: string } }[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    };
    const data: Response = await shopifyFetch<Response>({
      query: getSitemapProductsQuery,
      variables: { first: 100, after },
      tags: ["products"],
      revalidate: 3600,
    });
    all.push(...edgesToNodes(data.products));
    hasNextPage = data.products.pageInfo.hasNextPage;
    after = data.products.pageInfo.endCursor;
    guard += 1;
  }
  return all;
}

export async function getAllCollectionHandlesForSitemap(): Promise<
  { handle: string; updatedAt: string }[]
> {
  const all: { handle: string; updatedAt: string }[] = [];
  let after: string | null = null;
  let hasNextPage = true;
  let guard = 0;
  while (hasNextPage && guard < 50) {
    type Response = {
      collections: {
        edges: { node: { handle: string; updatedAt: string } }[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    };
    const data: Response = await shopifyFetch<Response>({
      query: getSitemapCollectionsQuery,
      variables: { first: 100, after },
      tags: ["collections"],
      revalidate: 3600,
    });
    all.push(...edgesToNodes(data.collections));
    hasNextPage = data.collections.pageInfo.hasNextPage;
    after = data.collections.pageInfo.endCursor;
    guard += 1;
  }
  return all;
}

// ───────────────────────── Internal normalizers ─────────────────────────

type UserError = { field: string[] | null; message: string };

function assertNoUserErrors(errors: UserError[], contextMessage: string) {
  if (errors && errors.length > 0) {
    throw new Error(`${contextMessage}: ${errors.map((e) => e.message).join("; ")}`);
  }
}

type RawProductCard = Omit<ProductCardData, "firstVariantId" | "firstVariantAvailable"> & {
  variants: { edges: { node: { id: string; availableForSale: boolean } }[] };
};

function normalizeProductCard(raw: RawProductCard): ProductCardData {
  const firstVariant = raw.variants?.edges?.[0]?.node;
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    vendor: raw.vendor,
    availableForSale: raw.availableForSale,
    featuredImage: raw.featuredImage,
    priceRange: raw.priceRange,
    compareAtPriceRange: raw.compareAtPriceRange,
    totalInventory: raw.totalInventory,
    firstVariantId: firstVariant?.id ?? null,
    firstVariantAvailable: firstVariant?.availableForSale ?? false,
  };
}

function normalizeProductCards(raws: RawProductCard[]): ProductCardData[] {
  return raws.map(normalizeProductCard);
}

type RawProduct = Omit<Product, "images" | "variants"> & {
  images: { edges: { node: Product["images"][number] }[] };
  variants: { edges: { node: Product["variants"][number] }[] };
};

function normalizeProduct(raw: RawProduct): Product {
  return {
    ...raw,
    images: edgesToNodes(raw.images),
    variants: edgesToNodes(raw.variants),
  };
}

type RawCart = Omit<Cart, "lines"> & {
  lines: { edges: { node: Cart["lines"][number] }[] };
};

function normalizeCart(raw: RawCart): Cart {
  return {
    ...raw,
    lines: edgesToNodes(raw.lines),
  };
}
