import {
  cartFragment,
  imageFragment,
  moneyFragment,
  productCardFragment,
  productFullFragment,
  seoFragment,
} from "./fragments";

// ───────────────────────── Products ─────────────────────────

export const getProductByHandleQuery = /* GraphQL */ `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFullFragment
    }
  }
  ${productFullFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts(
    $first: Int!
    $after: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) {
    products(
      first: $first
      after: $after
      sortKey: $sortKey
      reverse: $reverse
      query: $query
    ) {
      edges {
        cursor
        node {
          ...ProductCardFragment
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${productCardFragment}
`;

export const searchProductsQuery = /* GraphQL */ `
  query searchProducts($query: String!, $first: Int!, $after: String) {
    search(
      query: $query
      first: $first
      after: $after
      types: [PRODUCT]
      unavailableProducts: LAST
    ) {
      edges {
        cursor
        node {
          ... on Product {
            ...ProductCardFragment
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    predictiveSearch: search(query: $query, first: 6, types: [PRODUCT]) {
      edges {
        node {
          ... on Product {
            ...ProductCardFragment
          }
        }
      }
    }
  }
  ${productCardFragment}
`;

export const getRelatedProductsQuery = /* GraphQL */ `
  query getRelatedProducts($productId: ID!, $first: Int!) {
    productRecommendations(productId: $productId) {
      ...ProductCardFragment
    }
    fallback: products(first: $first, sortKey: BEST_SELLING) {
      edges {
        node {
          ...ProductCardFragment
        }
      }
    }
  }
  ${productCardFragment}
`;

// ───────────────────────── Collections ─────────────────────────

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections($first: Int!) {
    collections(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            ...ImageFragment
          }
        }
      }
    }
  }
  ${imageFragment}
`;

export const getCollectionByHandleQuery = /* GraphQL */ `
  query getCollectionByHandle(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      seo {
        ...SeoFragment
      }
      image {
        ...ImageFragment
      }
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        filters {
          id
          label
          values {
            id
            label
            count
            input
          }
        }
        edges {
          cursor
          node {
            ...ProductCardFragment
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${imageFragment}
  ${seoFragment}
  ${productCardFragment}
`;

// ───────────────────────── Cart ─────────────────────────

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  ${cartFragment}
`;

export const addCartLinesMutation = /* GraphQL */ `
  mutation addCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const updateCartLinesMutation = /* GraphQL */ `
  mutation updateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const removeCartLinesMutation = /* GraphQL */ `
  mutation removeCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const updateCartDiscountMutation = /* GraphQL */ `
  mutation updateCartDiscount($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

export const updateCartBuyerIdentityMutation = /* GraphQL */ `
  mutation updateCartBuyerIdentity(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
  ) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;

// ───────────────────────── Shop / Policies / Pages ─────────────────────────

export const getShopPoliciesQuery = /* GraphQL */ `
  query getShopPolicies {
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        title
        body
        handle
        url
      }
      refundPolicy {
        title
        body
        handle
        url
      }
      privacyPolicy {
        title
        body
        handle
        url
      }
      termsOfService {
        title
        body
        handle
        url
      }
    }
  }
`;

export const getPageByHandleQuery = /* GraphQL */ `
  query getPageByHandle($handle: String!) {
    page(handle: $handle) {
      id
      title
      body
      bodySummary
      handle
      seo {
        ...SeoFragment
      }
    }
  }
  ${seoFragment}
`;

export const getSitemapProductsQuery = /* GraphQL */ `
  query getSitemapProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          handle
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const getSitemapCollectionsQuery = /* GraphQL */ `
  query getSitemapCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          handle
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
