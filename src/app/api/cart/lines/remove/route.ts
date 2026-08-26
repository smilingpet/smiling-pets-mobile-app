import { NextRequest, NextResponse } from "next/server";
import { removeCartLines } from "@/lib/shopify/api";
import { getTrustedBuyerIp } from "@/lib/shopify/buyer-ip";

export const runtime = "nodejs";

/**
 * POST /api/cart/lines/remove
 * Body: { cartId: string; lineIds: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, lineIds } = body ?? {};
    if (!cartId || !Array.isArray(lineIds) || lineIds.length === 0) {
      return NextResponse.json({ error: "cartId and lineIds[] are required." }, { status: 400 });
    }
    const buyerIp = getTrustedBuyerIp(request);
    const cart = await removeCartLines(cartId, lineIds, buyerIp);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("[api/cart/lines/remove]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not remove item from cart." },
      { status: 500 }
    );
  }
}
