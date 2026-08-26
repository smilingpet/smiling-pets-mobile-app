// Shopify Storefront API TypeScript types used throughout the app.
// These intentionally mirror only the fields this project actually queries.

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type SEO = {
  title: string | null;
  description: string | null;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
  sku: string | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  seo: SEO;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  updatedAt: string;
};

export type ProductCardData = Pick<
  Product,
  | "id"
  | "handle"
  | "title"
  | "vendor"
  | "availableForSale"
  | "featuredImage"
  | "priceRange"
  | "compareAtPriceRange"
> & {
  totalInventory?: number | null;
  firstVariantId: string | null;
  firstVariantAvailable: boolean;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  seo: SEO;
  image: ShopifyImage | null;
};

export type CollectionWithProducts = Collection & {
  products: {
    items: ProductCardData[];
    pageInfo: PageInfo;
  };
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
    amountPerQuantity?: Money;
  };
  merchandise: {
    id: string;
    title: string;
    sku: string | null;
    availableForSale: boolean;
    quantityAvailable: number | null;
    selectedOptions: { name: string; value: string }[];
    image: ShopifyImage | null;
    product: {
      id: string;
      handle: string;
      title: string;
      vendor: string;
    };
    price: Money;
    compareAtPrice: Money | null;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  discountCodes: { code: string; applicable: boolean }[];
  lines: CartLine[];
};

export type ShopPolicy = {
  title: string;
  body: string;
  handle: string;
  url: string;
};

export type ShopPage = {
  id: string;
  title: string;
  body: string;
  bodySummary: string;
  handle: string;
  seo: SEO;
};

export type SortKeyProducts =
  | "RELEVANCE"
  | "BEST_SELLING"
  | "CREATED"
  | "PRICE"
  | "TITLE";

export type ProductSortOption = {
  label: string;
  key: SortKeyProducts;
  reverse: boolean;
};

export const PRODUCT_SORT_OPTIONS: ProductSortOption[] = [
  { label: "Featured", key: "RELEVANCE", reverse: false },
  { label: "Best selling", key: "BEST_SELLING", reverse: false },
  { label: "Price: Low to High", key: "PRICE", reverse: false },
  { label: "Price: High to Low", key: "PRICE", reverse: true },
  { label: "Newest", key: "CREATED", reverse: true },
  { label: "Alphabetically: A-Z", key: "TITLE", reverse: false },
];
