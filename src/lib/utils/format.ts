import { CURRENCY_LOCALE } from "@/lib/constants";
import type { Money } from "@/lib/shopify/types";

export function formatMoney(money: Money | null | undefined): string {
  if (!money) return "";
  const amount = Number(money.amount);
  if (Number.isNaN(amount)) return "";
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "currency",
    currency: money.currencyCode || "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function isOnSale(price?: Money | null, compareAtPrice?: Money | null): boolean {
  if (!price || !compareAtPrice) return false;
  return Number(compareAtPrice.amount) > Number(price.amount);
}

export function savingsAmount(price?: Money | null, compareAtPrice?: Money | null): Money | null {
  if (!isOnSale(price, compareAtPrice) || !price || !compareAtPrice) return null;
  return {
    amount: String(Number(compareAtPrice.amount) - Number(price.amount)),
    currencyCode: price.currencyCode,
  };
}

export function savingsPercent(price?: Money | null, compareAtPrice?: Money | null): number | null {
  if (!isOnSale(price, compareAtPrice) || !price || !compareAtPrice) return null;
  const pct = ((Number(compareAtPrice.amount) - Number(price.amount)) / Number(compareAtPrice.amount)) * 100;
  return Math.round(pct);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/** Strips HTML tags for use in meta descriptions / plain-text previews. */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
