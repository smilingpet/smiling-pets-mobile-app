import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/revalidate
 *
 * Optional but recommended: point Shopify Admin webhooks at this endpoint
 * (Settings → Notifications → Webhooks) for the topics:
 *   products/create, products/update, products/delete,
 *   collections/create, collections/update, collections/delete
 * so that a change in Shopify Admin appears in the app immediately instead
 * of waiting for the normal 60-second cache window to expire.
 *
 * Protect it with a shared secret: set SHOPIFY_REVALIDATION_SECRET in your
 * environment and append ?secret=YOUR_SECRET to the webhook URL you give
 * Shopify. Without a secret configured, the route still works (the whole
 * app already self-heals every 60s), it just isn't required for security.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SHOPIFY_REVALIDATION_SECRET;
  if (secret) {
    const provided = request.nextUrl.searchParams.get("secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
    }
  }

  const topic = request.headers.get("x-shopify-topic") || "";

  try {
    if (topic.startsWith("products/")) {
      revalidateTag("products");
    } else if (topic.startsWith("collections/")) {
      revalidateTag("collections");
    } else {
      // Unknown / manual trigger — refresh everything to be safe.
      revalidateTag("products");
      revalidateTag("collections");
      revalidateTag("shop");
    }
    return NextResponse.json({ revalidated: true, topic, now: Date.now() });
  } catch (error) {
    console.error("[api/revalidate]", error);
    return NextResponse.json({ error: "Revalidation failed." }, { status: 500 });
  }
}
