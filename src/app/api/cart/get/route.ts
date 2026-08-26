import { NextRequest, NextResponse } from "next/server";
import { getCart } from "@/lib/shopify/api";
import { getTrustedBuyerIp } from "@/lib/shopify/buyer-ip";

export const runtime = "nodejs";

/**
 * GET /api/cart/get?cartId=...
 * Fetches the current state of a cart. Used on app load to hydrate the
 * cart from the id persisted in localStorage.
 */
export async function GET(request: NextRequest) {
  const cartId = request.nextUrl.searchParams.get("cartId");
  if (!cartId) {
    return NextResponse.json({ error: "Missing cartId query parameter." }, { status: 400 });
  }
  try {
    const buyerIp = getTrustedBuyerIp(request);
    const cart = await getCart(cartId, buyerIp);
    if (!cart) {
      return NextResponse.json({ cart: null }, { status: 200 });
    }
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("[api/cart/get]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not fetch cart." },
      { status: 500 }
    );
  }
}
