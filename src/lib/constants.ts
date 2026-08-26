import {
  BirdIcon,
  CatIcon,
  DogIcon,
  FishIcon,
  PawIcon,
  StarIcon,
  HeadsetIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons/Icons";

export const SITE_NAME = "Smiling Pets";
export const SITE_DESCRIPTION =
  "Smiling Pets is your online pet store for pet food, treats, grooming and accessories. Shop dog, cat, bird and fish products with fast delivery across India.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://smiling-pets.vercel.app";
export const CURRENCY = "INR";
export const CURRENCY_LOCALE = "en-IN";

// Public storefront contact details (sourced from smilingpets.in footer).
// Update here if the business changes phone number, email or address.
export const SUPPORT_PHONE = "+91 98703 44899";
export const SUPPORT_PHONE_DIAL = "+919870344899";
export const WHATSAPP_NUMBER = "919870344899";
export const SUPPORT_EMAIL = "support@smilingpets.in";
export const SUPPORT_HOURS = "7 Days, 9 AM – 10 PM";
export const STORE_ADDRESS =
  "Shop No. 5, Blue Orbit, New Goregaon–Mulund Link Road, near Inorbit Mall, Malad West, Mumbai, Maharashtra 400064";

export function whatsappLink(message = "Hi Smiling Pets Team, I need help") {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/_smilingpets/",
  facebook: "https://www.facebook.com/SSmilingPets/",
};

// "Shop by Pet" quick-filter row shown on the home screen.
export const SHOP_BY_PET = [
  { label: "All", handle: "all", icon: PawIcon },
  { label: "Puppy", handle: "dog-food", icon: DogIcon },
  { label: "Dog", handle: "dog-food", icon: DogIcon },
  { label: "Cat", handle: "cat-food", icon: CatIcon },
  { label: "Bird", handle: "bird-food", icon: BirdIcon },
  { label: "Fish", handle: "fish-food", icon: FishIcon },
];

// Local hero banners for the home screen slider. These are intentionally
// NOT derived from Shopify collection data — headline, subheading, CTA
// label and background asset are all bundled locally in this app so the
// hero section can never render blank (e.g. if a Shopify collection is
// missing an image, renamed, or the API is briefly unavailable). Each
// banner's CTA still deep-links to a real, live Shopify collection/page.
export const HERO_BANNERS = [
  {
    id: "banner-all",
    image: "/banners/banner-1.svg",
    headline: "Everything Your Pet Needs",
    subheading: "Premium food, treats & essentials — delivered fast",
    ctaLabel: "Shop All Products",
    href: "/collections/all",
  },
  {
    id: "banner-offers",
    image: "/banners/banner-2.svg",
    headline: "Great Deals, Happy Tails",
    subheading: "Save more on Royal Canin, Pedigree, Whiskas & more",
    ctaLabel: "View Offers",
    href: "/pages/offers",
  },
  {
    id: "banner-mixmatch",
    image: "/banners/banner-3.svg",
    headline: "Mix & Match Favourites",
    subheading: "Build your pet's own custom flavour box",
    ctaLabel: "Explore Mix & Match",
    href: "/collections/mix-match",
  },
];

// "Browse Pet Food by Categories" grid on the home screen.
export const HOME_CATEGORIES = [
  { title: "Dog Dry Food", handle: "dry-dog-food", blurb: "Premium dry food that fuels health and happiness" },
  { title: "Cat Wet Food", handle: "wet-cat-food", blurb: "Moist, flavourful meals your cat will love" },
  { title: "Pet Toys", handle: "dog-toys", blurb: "Playful toys for endless fun and bonding" },
  { title: "Pet Grooming", handle: "pet-grooming-products", blurb: "Pamper your furry friend in style" },
  { title: "Pads & Wipes", handle: "dog-diapers", blurb: "Clean and comfortable, made convenient" },
  { title: "Cat Litter", handle: "cat-litter", blurb: "Odour control and easy clean up" },
];

// Top brand collections featured on the home screen.
export const TOP_BRANDS = [
  { name: "Royal Canin", handle: "royal-canin" },
  { name: "SmartHeart", handle: "smart-heart" },
  { name: "Pedigree", handle: "pedigree" },
  { name: "Whiskas", handle: "whiskas" },
  { name: "Vitapol", handle: "vitapol" },
  { name: "Me-O", handle: "me-o" },
  { name: "Arden Grange", handle: "arden-grange" },
  { name: "Purina", handle: "purina-dog-food-cat-food" },
];

// Mix & Match customisable multi-flavour bundles.
export const MIX_AND_MATCH = [
  { name: "Sheba Mix & Match", handle: "sheba-mix-match" },
  { name: "Lola & Co Mix & Match", handle: "lola-co-mix-match" },
  { name: "Bellotta Mix & Match", handle: "bellotta-mix-match" },
  { name: "Purina Felix Mix & Match", handle: "purina-felix-mix-match" },
  { name: "Zoomies Mix & Match", handle: "zoomies-mix-match" },
  { name: "PRAMA Mix & Match", handle: "prama-mix-match" },
];

// Primary "Categories" navigation used on the Categories tab and header menu.
export const CATEGORY_NAV = [
  {
    title: "Dog Food",
    handle: "dog-food",
    children: [
      { title: "Dry Dog Food", handle: "dry-dog-food" },
      { title: "Wet Dog Food", handle: "wet-dog-food" },
      { title: "Dog Treats", handle: "dog-treats" },
      { title: "Biscuits", handle: "dog-biscuits" },
      { title: "Pet Grooming", handle: "pet-grooming-products" },
      { title: "Dog Diapers", handle: "dog-diapers" },
      { title: "Pet Toys", handle: "dog-toys" },
      { title: "Pet Care & Supplements", handle: "testing" },
    ],
  },
  {
    title: "Cat Food",
    handle: "cat-food",
    children: [
      { title: "Dry Cat Food", handle: "dry-cat-food" },
      { title: "Wet Cat Food", handle: "wet-cat-food" },
      { title: "Cat Treats", handle: "cat-treats" },
      { title: "Pet Grooming", handle: "pet-grooming-products" },
      { title: "Cat Litter", handle: "cat-litter" },
      { title: "Pet Care & Supplements", handle: "cat-pet-care-and-supplements" },
    ],
  },
  { title: "Bird", handle: "bird-food", children: [] },
  { title: "Fish", handle: "fish-food", children: [] },
  {
    title: "Small Pet",
    handle: "food-for-small-pet",
    children: [
      { title: "Food", handle: "food-for-small-pet" },
      { title: "Bedding & Litter", handle: "litter" },
    ],
  },
  {
    title: "Accessories",
    handle: "accessories",
    children: [
      { title: "Collar", handle: "dog-collars" },
      { title: "Leash", handle: "leash" },
      { title: "Harness", handle: "dog-harness" },
    ],
  },
];

export const FOOTER_POLICY_LINKS = [
  { title: "About Us", href: "/pages/about-us" },
  { title: "Careers", href: "/pages/careers" },
  { title: "Offers", href: "/pages/offers" },
  { title: "Terms of Use", href: "/policies/terms-of-service" },
  { title: "Refund Policy", href: "/policies/refund-policy" },
  { title: "Privacy Policy", href: "/policies/privacy-policy" },
  { title: "Shipping & Delivery Policy", href: "/policies/shipping-policy" },
  { title: "Contact Us", href: "/pages/contact-us" },
];

export const WHY_CHOOSE_US = [
  {
    title: "26,000+ Happy Reviews",
    description: "Rated excellent by thousands of pet parents across India.",
    icon: StarIcon,
  },
  {
    title: "7 Days Support",
    description: "Our team is here for you 9 AM – 10 PM, every single day.",
    icon: HeadsetIcon,
  },
  {
    title: "Genuine Products",
    description: "100% authentic pet food and accessories, sourced directly.",
    icon: ShieldIcon,
  },
  {
    title: "Fast, Safe Delivery",
    description: "Secure packaging and reliable delivery, right to your door.",
    icon: TruckIcon,
  },
];

// Customer testimonials for the home page "Reviews" section. The Shopify
// Storefront API has no native product-review object, so these can't be
// fetched live — they're paraphrased from the real testimonials published
// on smilingpets.in at the time this app was built (not fabricated). When
// you're ready, replace this with a live feed from a reviews app (e.g.
// Judge.me, Loox, Yotpo) via their own API/widget.
export const CUSTOMER_REVIEWS = [
  {
    name: "Richa Upadhay",
    role: "Dog Parent",
    quote:
      "Years of loyal shopping and their commitment to quality pet food never ceases to amaze me — wholesome ingredients my dog loves.",
  },
  {
    name: "Manoj Sharma",
    role: "Dog Parent",
    quote:
      "The online ordering system is incredibly efficient. Packaging is always secure and delivery is never delayed.",
  },
  {
    name: "Riya Gupta",
    role: "Cat Parent",
    quote:
      "I love the diverse range of pet food options — wet or dry, Smiling Pets has it all for my cat's specific needs.",
  },
];

export const PRODUCTS_PER_PAGE = 12;
