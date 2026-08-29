# Smiling Pets — PWA Storefront

An installable, mobile-first Progressive Web App storefront for **[Smiling Pets](https://www.smilingpets.in/)**, built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and the **Shopify Storefront GraphQL API**. All products, prices, images, inventory, and collections are pulled live from your Shopify store — nothing is hard-coded.

No local software is required to deploy this. You will push the code to GitHub from your browser and deploy it with Vercel, also from your browser.

---

## 1. What's inside

```
smiling-pets-pwa/
├─ src/
│  ├─ app/                     Next.js App Router pages & API routes
│  │  ├─ page.tsx               Home screen
│  │  ├─ collections/[handle]/  Category / collection listing pages
│  │  ├─ products/[handle]/     Product detail pages
│  │  ├─ search/                Search
│  │  ├─ cart/                  Cart
│  │  ├─ account/               Account / login links
│  │  ├─ categories/            Categories tab
│  │  ├─ policies/[handle]/     Live Shopify policies (Terms, Refund, Privacy, Shipping)
│  │  ├─ pages/[handle]/        Live Shopify pages (About, Careers, Offers, Mix & Match…)
│  │  ├─ api/cart/…             Server-side cart routes (create/add/update/remove/discount)
│  │  ├─ api/products/          Pagination endpoint used by "Load more"
│  │  ├─ api/revalidate/        Optional Shopify webhook endpoint for instant cache updates
│  │  ├─ manifest.ts            PWA web app manifest
│  │  ├─ robots.ts / sitemap.ts SEO
│  │  └─ offline/               Offline fallback page
│  ├─ components/               UI split into layout / home / product / cart / pwa / ui
│  └─ lib/
│     ├─ shopify/               client.ts (server-only fetch), queries.ts, api.ts, types.ts
│     ├─ cart/                  Client-side CartContext (localStorage + API routes)
│     ├─ seo/                   JSON-LD structured data helpers
│     └─ analytics/             GA4 / Meta Pixel config (off by default)
├─ public/
│  ├─ sw.js                     Service worker (offline + caching + update flow)
│  ├─ icons/                    PWA icons (see "Replace these icons" below)
│  └─ favicon.ico, apple-touch-icon.png, og-image.png
├─ .env.example
└─ package.json
```

---

## What changed in this update — files to replace on GitHub

If you already pushed an earlier version of this project, the cleanest way to apply this update is to **replace these files/folders wholesale** in your GitHub repo with the versions in this ZIP (delete the old ones first if GitHub doesn't overwrite cleanly), then let Vercel redeploy:

**Shopify connection & data (the products-not-loading fix)**
- `src/lib/shopify/client.ts` — now includes domain-format validation, specific error messages per failure type (bad token vs bad domain vs non-JSON response), and safe server-side error logging
- `src/app/page.tsx` — no longer silently shows an empty homepage on a Shopify failure; now shows a specific, actionable error screen with a Retry button
- `src/components/ui/ShopifyTroubleshoot.tsx` — new file, the diagnostic error/retry screen
- `src/components/home/BrandsRow.tsx` — now uses real Shopify collection images instead of text-only cards
- `src/app/categories/page.tsx` — collection fetch limit increased so brand/category collections are never silently truncated

**Real logo + brand colours**
- `public/brand/smiling-pets-logo.png`, `public/brand/smiling-pets-mark.png` — your real logo, new files
- `public/icons/*`, `public/apple-touch-icon.png`, `public/favicon.ico`, `public/og-image.png` — regenerated from your real logo
- `src/components/brand/Logo.tsx` — rewritten to render the real logo image
- `tailwind.config.ts` — coral (`#ff6665`) is now the `accent` colour
- `src/components/layout/Header.tsx`, `Footer.tsx`, `src/components/pwa/InstallPrompt.tsx`, `src/components/splash/SplashScreen.tsx`, `src/app/offline/page.tsx` — updated to the real logo and rebalanced colours
- `src/components/home/HeroSlider.tsx`, `src/components/home/ShopByPet.tsx`, `src/components/home/WhyChooseUs.tsx`, `src/components/home/MixMatchRow.tsx`, `public/banners/*.svg` — recoloured for coral/green balance
- `src/components/product/AddToCartButton.tsx`, `src/components/product/ProductPurchasePanel.tsx`, `src/components/cart/CartPageContent.tsx` — primary CTAs (Add to Cart, Buy Now, Checkout, Install) switched from green to coral

**PWA cache**
- `public/sw.js` — rewritten: HTML/CSS/JS are now network-first (was cache-first for CSS/JS, which is the most likely cause of the duplicated/stale-looking page you saw), only images/fonts/Shopify CDN/Next's hashed build assets stay cache-first, and the cache version was bumped so every installed client purges its old cache automatically on next launch

Everything else is unchanged from the previous delivery. Simplest overall approach: just replace the entire repo contents with this ZIP's contents and redeploy — nothing in here depends on you cherry-picking individual files.

### About the duplicated header/search bar you saw

I audited the entire codebase specifically for this and can confirm structurally: `<Header />` and the bottom navigation are each rendered exactly once, in `src/app/layout.tsx` only — there's no second layout file, no template file, and no homepage section (Mix & Match, Top Brands, Why Choose Us, Reviews, Footer) renders a header or search bar of its own. I don't have a copy of the screenshot you referenced (only your logo image came through as an attachment), so I can't visually match what you saw — but the most likely explanation, given you mentioned disabling the service worker mid-troubleshooting, is a **stale cached page** (an old HTML shell paired with a newer/older JS bundle from a previous deploy). The service worker rewrite above (network-first HTML/JS/CSS + a new cache version) is specifically designed to eliminate that. After redeploying this version:

1. On your phone/browser, fully close the app/tab.
2. If you'd installed the PWA before, uninstall it and reinstall after the new deploy is live (this guarantees a clean service worker).
3. In a regular browser tab, hard-refresh (or open in a private/incognito window) to bypass any cached copy and confirm the live page looks correct before reinstalling.

If it still happens after that, it's a genuine bug I haven't found — reply with a screenshot and I'll fix it directly rather than guess.

---

## 2. How Shopify is connected (read this first)

This app uses the **Shopify Storefront GraphQL API** (version **2026-07**) exclusively — the same API official Shopify headless storefronts use. It talks to Shopify in two ways:

1. **Server Components** (`src/app/**/page.tsx`) fetch products/collections directly on the server at request time, with Next.js's caching (`revalidate: 60` seconds by default). This means changes you make in Shopify Admin — a new price, a changed image, a product going out of stock — show up in the app automatically within about a minute, with **no code changes and no redeploy**.
2. **Route Handlers** (`src/app/api/cart/**`) run cart mutations (create cart, add/update/remove line items, apply discount codes) on the server too, so the private Storefront token is **never sent to the browser**.

Every single Shopify call funnels through `src/lib/shopify/client.ts`, which is wrapped in the `server-only` package — if anyone ever tried to import it into a client component, the production build would fail immediately rather than silently leaking your token.

**Checkout and payment happen entirely on Shopify's own secure checkout** (`cart.checkoutUrl`, generated by Shopify). This app never touches payment details, and every order placed will appear in your existing Shopify Admin exactly like any other order.

### Authentication: private token, not public token

This app authenticates with a **PRIVATE** Storefront API access token (from the Shopify Headless sales channel), sent using the

```
Shopify-Storefront-Private-Token
```

header — **not** the public-token header (`X-Shopify-Storefront-Access-Token`). Public tokens are designed to be safe in browser JavaScript; private tokens are not, and this app never puts one there. The header is set in exactly one place, `src/lib/shopify/client.ts`, alongside the request's API version:

```ts
const API_VERSION = "2026-07";
// ...
headers["Shopify-Storefront-Private-Token"] = token;
```

When Shopify releases a newer stable API version, bump `API_VERSION` in that one file — every query in the app automatically targets the new version.

### Buyer IP forwarding

Every buyer-initiated request (creating a cart, adding/updating/removing a line item, applying a discount code, loading "more" products) also forwards the shopper's real IP address to Shopify via the case-sensitive `Shopify-Storefront-Buyer-IP` header, so Shopify can apply accurate per-buyer rate limiting and bot/fraud protection instead of throttling the whole app as if it were one client.

This is implemented in `src/lib/shopify/buyer-ip.ts` and is safe by construction: the IP is read **only** from the `x-forwarded-for` (falling back to `x-real-ip`) header on the incoming server request — never from a query parameter, form field, or JSON body, which a malicious client could freely fake. On Vercel, `x-forwarded-for` is set by Vercel's own edge network from the real TCP connection; Vercel overwrites/strips any value a client tries to inject under that same header name before your app ever sees the request, so this is safe to trust in a Vercel deployment without any extra configuration on your part.

### Instant updates (optional but recommended)

By default, cached pages refresh every 60 seconds. If you want changes in Shopify Admin to appear **immediately**:

1. In Shopify Admin, go to **Settings → Notifications → Webhooks**.
2. Create webhooks for topics `products/update`, `products/create`, `products/delete`, `collections/update`, `collections/create`, `collections/delete`.
3. Point each one at: `https://YOUR-DEPLOYED-URL/api/revalidate?secret=YOUR_SECRET`
   (set `SHOPIFY_REVALIDATION_SECRET` in your environment variables to any random string, and use the same value in the webhook URL).

This step is optional — the app works perfectly well without it, just with up to a 60-second delay before a Shopify change appears.

---

## 3. Getting your Shopify credentials

You need a **private Storefront API access token** with a **Headless** sales channel (this is the officially supported way to build a custom storefront with Shopify).

1. In Shopify Admin, go to **Settings → Apps and sales channels**.
2. Click **Develop apps** (or **Headless** if you already have that channel) → **Create an app** (name it e.g. "Smiling Pets PWA").
3. Under **API credentials**, click **Configure Storefront API scopes** and make sure at least these are enabled (they usually are by default):
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_read_checkouts` / `unauthenticated_write_checkouts` (cart & checkout)
   - `unauthenticated_read_customer_tags` (optional)
4. Click **Install app**.
5. Under **API credentials**, find the **Storefront API access token** section and copy the **private** access token (Shopify's Headless channel issues both a public and a private token — this app needs the private one, since every request is server-side). This is your `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`.
6. Your store domain is the `*.myshopify.com` address shown in Shopify Admin's URL bar (e.g. `smiling-pets.myshopify.com`) — this is your `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`.

**Never paste this token directly into any file.** It only ever goes into environment variables (see below).

---

## 4. Deploying — step by step (all in your browser)

### Step A — Push this project to GitHub

1. Unzip this project on your computer.
2. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `smiling-pets-pwa`). Keep it private if you prefer.
3. On the new repo's page, click **"uploading an existing file"**.
4. Drag in the entire contents of the unzipped folder (not the zip itself — the files and folders inside it) and commit.
   - GitHub's web uploader may limit folder-drag depth on some browsers. If a nested folder doesn't upload correctly, you can instead use GitHub Desktop, or upload folder-by-folder — the file list in section 1 above shows you exactly what should exist.

### Step B — Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in (you can sign in with your GitHub account).
2. Click **Import** next to the `smiling-pets-pwa` repository.
3. Vercel will auto-detect **Next.js** — leave the build settings as default.
4. Before clicking **Deploy**, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` |
   | `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | your Storefront API access token |
   | `NEXT_PUBLIC_SITE_URL` | leave blank for now, or set to the domain you plan to use |

5. Click **Deploy**. After it finishes, Vercel gives you a live URL like `https://smiling-pets-pwa.vercel.app`.
6. Go back into **Project Settings → Environment Variables**, set `NEXT_PUBLIC_SITE_URL` to that real URL (or your custom domain once connected), and click **Redeploy** from the Deployments tab so SEO tags and the sitemap use the correct URL.

### Step C — (Optional) Connect a custom domain

In Vercel: **Project Settings → Domains** → add your domain (e.g. `app.smilingpets.in`) and follow the DNS instructions shown. Then update `NEXT_PUBLIC_SITE_URL` to match and redeploy.

### Updating the app later

Any time you want to change something, edit the files on GitHub (or push new commits) — Vercel automatically rebuilds and redeploys on every push to your main branch. No Shopify product/price/image change ever needs a redeploy; only *code* changes do.

---

## 5. Your official logo — now integrated

Your real Smiling Pets logo is now used throughout the app (it wasn't in the first draft — this version was corrected after you sent it over):

- **`public/brand/smiling-pets-logo.png`** — the full logo, exactly as you provided it (untouched aspect ratio, transparent background). Used in the **Header**, **Footer**, and the **offline page**, always via `src/components/brand/Logo.tsx`'s `<Logo />` component, rendered at its real proportions — never stretched or cropped.
- **`public/brand/smiling-pets-mark.png`** — a tighter crop of just the dog + wordmark (no tagline/pet-icon row), used only for the **splash screen** and **install prompt**, where it sits on a white circular badge (`<LogoBadge />`) so it stays legible at a small size against the coral splash background. Small app-icon-style uses genuinely need a simplified mark — showing the full detailed lockup with fine-print tagline at 40–70px would be illegible — so this crop exists specifically for that, not as a redesign of your logo.
- **`public/icons/*.png`, `public/apple-touch-icon.png`, `public/favicon.ico`, `public/og-image.png`** — regenerated from your real logo (white background, per your brand spec) so the browser tab icon, home-screen icon, and social share preview all match.

**One honest caveat:** your source file is 240×225px. That's fine for the header/footer/splash at the sizes they're shown, but a 512×512 app icon upscaled from a 240px source will look slightly softer than one built from vector art or a larger source photo. If you have a higher-resolution version of your logo (or the original vector/AI file), replacing `public/brand/smiling-pets-logo.png` and re-running the icon generation will sharpen the large icon sizes — everything else about how it's used stays the same.

### If you ever want to update the logo again

Replace `public/brand/smiling-pets-logo.png` (and optionally `public/brand/smiling-pets-mark.png` with a matching crop) with your new file at the same path, then regenerate the derived icon set using a free tool like [realfavicongenerator.net](https://realfavicongenerator.net) to produce `icon-192x192.png`, `icon-512x512.png`, `icon-maskable-*.png`, `apple-touch-icon.png`, and `favicon.ico` from the same source, and drop them in at the same filenames under `public/icons/`. No component code needs to change either way.

**A note on the "Customer Reviews" section:** Shopify's Storefront API has no built-in product-review object, so the three testimonials on the home page are paraphrased from the real testimonials published on smilingpets.in (not invented) rather than pulled live. When you're ready, swap `CUSTOMER_REVIEWS` in `src/lib/constants.ts` for a live feed from whatever reviews app you use (Judge.me, Loox, Yotpo, etc.) — everything else on the site (every product, price, image, and collection) is already 100% live from Shopify with no placeholders.

**A note on the hero banners:** the three home-screen hero banners (`public/banners/banner-1.svg`, `banner-2.svg`, `banner-3.svg`) are custom vector graphics in your coral/green brand palette, deliberately used *instead of* live Shopify collection images so the hero section can never render blank (a missing/unset collection image would otherwise leave an empty slide). Headline, subheading, and CTA copy for each banner live in `HERO_BANNERS` in `src/lib/constants.ts` — edit the text or swap in your own artwork there any time; no other code needs to change.

**A note on "Top Brands":** each brand card now shows the real image set on that brand's Shopify collection (Shopify Admin → Collections → e.g. "Royal Canin" → Image), fetched live — not a fabricated logo. If a brand collection doesn't have an image set yet, that one card falls back to a plain colour-coded monogram until you add one; it's never invented.

---

## 6. Turning on analytics later (optional)

No tracking runs by default. When you're ready:

1. In Vercel → **Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_GA4_MEASUREMENT_ID` — your GA4 Measurement ID (starts with `G-`)
   - `NEXT_PUBLIC_META_PIXEL_ID` — your Meta Pixel ID
2. Redeploy. That's it — see `src/lib/analytics/config.ts` and `src/components/layout/AnalyticsScripts.tsx` if you want to add custom events later.

---

## 7. Phone installation instructions (for you or your customers)

**Android (Chrome/Edge/Samsung Internet):**
1. Open the site in the browser.
2. A small **"Install Smiling Pets"** card appears near the bottom — tap **Install**.
3. If it doesn't appear, tap the browser menu (⋮) → **Add to Home screen** / **Install app**.

**iPhone/iPad (Safari):**
1. Open the site in **Safari** (not Chrome — iOS requires Safari for this).
2. A card will prompt you to tap **Install**, which shows: tap the **Share** icon (square with an arrow) → **Add to Home Screen** → **Add**.
3. The app icon will appear on your home screen and opens full-screen, without browser address bars.

Once installed, the app works offline for previously visited pages (an "offline" screen appears for pages you haven't visited yet), and a small banner will invite you to **update** whenever a new version is deployed.

---

## 8. Test checklist before going live

**Shopify data**
- [ ] Home page shows real products, images, and INR prices from your store
- [ ] Changing a product price/image in Shopify Admin appears in the app within ~60 seconds (or instantly if you set up the webhook in section 2)
- [ ] Out-of-stock products show "Sold Out" and disable Add to Cart
- [ ] Sale prices show the original price struck through and a "% OFF" badge

**Browsing**
- [ ] Home → Categories → collection pages all load real collections
- [ ] Sorting (Featured/Price/Newest/etc.) changes product order
- [ ] "Load more" fetches additional products without a full page reload
- [ ] Search returns relevant results and shows a friendly empty state for gibberish queries
- [ ] Product detail page: gallery, variant selection, quantity, description, shipping/returns accordion all work

**Cart & checkout**
- [ ] Add to Cart works from the grid, from the product page, and updates the bottom-nav badge
- [ ] Cart quantity +/− and remove work and update the subtotal live
- [ ] A real Shopify discount code is accepted; an invalid one shows an error
- [ ] "Secure Checkout" opens your real Shopify checkout with the correct items and total
- [ ] Completing a test order (Shopify test mode or a ₹1 test product) appears in Shopify Admin → Orders
- [ ] Closing and reopening the app keeps your cart (persisted via `localStorage` + Shopify cart ID)

**PWA**
- [ ] Site is installable on an Android phone (Chrome)
- [ ] Site is installable on an iPhone (Safari → Add to Home Screen)
- [ ] Installed app opens full-screen (no browser UI)
- [ ] A branded splash screen (green background, Smiling Pets mark) appears briefly on first cold load
- [ ] Turning on airplane mode shows the offline fallback screen instead of a browser error
- [ ] After you redeploy a change, previously-open installed apps show the "Update available" banner

**SEO**
- [ ] View source on a product page shows a filled-in `<title>`, meta description, and Open Graph tags
- [ ] `/sitemap.xml` lists your real products and collections
- [ ] `/robots.txt` loads correctly

---

## 9. A note on `package-lock.json`

This project intentionally does **not** ship a `package-lock.json`. Every dependency in `package.json` is pinned to an **exact version** (no `^`/`~` ranges), so `npm install` resolves the same top-level versions every time — that's the main thing a lockfile buys you, already covered.

The reason for leaving it out rather than including one: a lockfile has to exactly match the real npm registry's dependency graph and package integrity hashes, or `npm ci` (which Vercel automatically switches to whenever it sees a `package-lock.json` in your repo) will refuse to install and your build will fail outright — a broken lockfile is worse than no lockfile at all. Since generating a genuine one requires live npm registry access, and I only want to ship things in this ZIP that I've verified will actually work, I left it out rather than include something that risks breaking your very first deploy.

**What this means for you:** nothing you need to do. Vercel will run a plain `npm install` on first deploy (since no lockfile is present), which installs correctly and works fine. If you'd like a committed lockfile for extra reproducibility later, it's one step: after your first successful deploy, pull the project down anywhere with Node.js installed (or open a Codespace/StackBlitz from your GitHub repo), run `npm install` once, and commit the `package-lock.json` it generates — Vercel will then automatically use `npm ci` on every future deploy.

---

## 10. Local development (optional)

You said you don't want to install anything locally, and you don't have to — everything above works entirely through GitHub's web UI and Vercel. This section is only here in case you (or a developer you hire later) ever want to run it locally:

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

---

## 11. Support

This project was generated for the Smiling Pets storefront and connects to your existing Shopify store's real data. If a page ever shows a "Shopify isn't connected yet" message, double check the three environment variables in Vercel are spelled exactly as in `.env.example` and that you redeployed after adding them.
