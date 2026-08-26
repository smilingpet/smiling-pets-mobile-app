export const moneyFragment = /* GraphQL */ `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`;

export const imageFragment = /* GraphQL */ `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`;

export const seoFragment = /* GraphQL */ `
  fragment SeoFragment on SEO {
    title
    description
  }
`;

export const productCardFragment = /* GraphQL */ `
  fragment ProductCardFragment on Product {
    id
    handle
    title
    vendor
    availableForSale
    totalInventory
    featuredImage {
      ...ImageFragment
    }
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    variants(first: 1) {
      edges {
        node {
          id
          availableForSale
        }
      }
    }
  }
  ${imageFragment}
  ${moneyFragment}
`;

export const productFullFragment = /* GraphQL */ `
  fragment ProductFullFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    updatedAt
    seo {
      ...SeoFragment
    }
    featuredImage {
      ...ImageFragment
    }
    images(first: 10) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    options {
      id
      name
      values
    }
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          sku
          price {
            ...MoneyFragment
          }
          compareAtPrice {
            ...MoneyFragment
          }
          selectedOptions {
            name
            value
          }
          image {
            ...ImageFragment
          }
        }
      }
    }
  }
  ${imageFragment}
  ${moneyFragment}
  ${seoFragment}
`;

export const cartFragment = /* GraphQL */ `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
    discountCodes {
      code
      applicable
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...MoneyFragment
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              sku
              availableForSale
              quantityAvailable
              selectedOptions {
                name
                value
              }
              image {
                ...ImageFragment
              }
              price {
                ...MoneyFragment
              }
              compareAtPrice {
                ...MoneyFragment
              }
              product {
                id
                handle
                title
                vendor
              }
            }
          }
        }
      }
    }
  }
  ${moneyFragment}
  ${imageFragment}
`;
