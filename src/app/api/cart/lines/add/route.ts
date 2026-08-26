import { NextRequest, NextResponse } from "next/server";
import { addCartLines } from "@/lib/shopify/api";
import { getTrustedBuyerIp } from "@/lib/shopify/buyer-ip";

export const runtime = "nodejs";

/**
 * POST /api/cart/lines/add
 * Body: { cartId: string; lines: { merchandiseId: string; quantity: number }[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, lines } = body ?? {};
    if (!cartId || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: "cartId and lines[] are required." }, { status: 400 });
    }
    const buyerIp = getTrustedBuyerIp(request);
    const cart = await addCartLines(cartId, lines, buyerIp);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("[api/cart/lines/add]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not add item to cart." },
      { status: 500 }
    );
  }
}
