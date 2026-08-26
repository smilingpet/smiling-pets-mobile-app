import { NextRequest, NextResponse } from "next/server";
import { createCart } from "@/lib/shopify/api";
import { getTrustedBuyerIp } from "@/lib/shopify/buyer-ip";

export const runtime = "nodejs";

/**
 * POST /api/cart/create
 * Body: { lines?: { merchandiseId: string; quantity: number }[] }
 *
 * Creates a new Shopify cart server-side (using the private Storefront
 * token) and returns the normalized cart. The browser only ever sees the
 * resulting cart id/checkout URL — never the access token itself. The
 * buyer's IP is read from trusted request headers (never from the request
 * body) and forwarded to Shopify for accurate rate limiting.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const lines = Array.isArray(body?.lines) ? body.lines : [];
    const buyerIp = getTrustedBuyerIp(request);
    const cart = await createCart(lines, buyerIp);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("[api/cart/create]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create cart." },
      { status: 500 }
    );
  }
}
