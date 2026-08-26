import { NextRequest, NextResponse } from "next/server";
import { updateCartDiscountCodes } from "@/lib/shopify/api";
import { getTrustedBuyerIp } from "@/lib/shopify/buyer-ip";

export const runtime = "nodejs";

/**
 * POST /api/cart/discount
 * Body: { cartId: string; discountCodes: string[] }
 * Applies (or clears, when discountCodes is []) discount codes on a cart.
 * Shopify validates the code; `cart.discountCodes[].applicable` tells the
 * UI whether it was actually accepted.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, discountCodes } = body ?? {};
    if (!cartId || !Array.isArray(discountCodes)) {
      return NextResponse.json(
        { error: "cartId and discountCodes[] are required." },
        { status: 400 }
      );
    }
    const buyerIp = getTrustedBuyerIp(request);
    const cart = await updateCartDiscountCodes(cartId, discountCodes, buyerIp);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("[api/cart/discount]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not apply discount code." },
      { status: 500 }
    );
  }
}
