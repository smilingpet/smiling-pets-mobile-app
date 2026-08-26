"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { cn } from "@/lib/utils/format";
import { HomeIcon, GridIcon, SearchIcon, UserIcon, CartIcon } from "@/components/icons/Icons";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/categories", label: "Categories", icon: GridIcon },
  { href: "/search", label: "Search", icon: SearchIcon },
  { href: "/account", label: "Account", icon: UserIcon },
  { href: "/cart", label: "Cart", icon: CartIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-surface-border bg-white/95 shadow-nav backdrop-blur safe-bottom"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center gap-0.5 py-2.5"
              >
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <Icon
                    className={cn(
                      "h-[22px] w-[22px] transition-colors",
                      isActive ? "text-brand-600" : "text-ink-light"
                    )}
                  />
                  {item.href === "/cart" && cartCount > 0 && (
                    <span
                      className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white"
                      aria-hidden="true"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10.5px] font-medium",
                    isActive ? "text-brand-600" : "text-ink-light"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
