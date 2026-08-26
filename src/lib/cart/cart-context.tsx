"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Cart } from "@/lib/shopify/types";
import { showToast } from "@/components/ui/Toast";

const CART_ID_STORAGE_KEY = "smilingpets:cartId";

type CartContextValue = {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  isMutating: boolean;
  addItem: (merchandiseId: string, quantity?: number, title?: string) => Promise<Cart | null>;
  updateItemQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  applyDiscountCode: (code: string) => Promise<boolean>;
  removeDiscountCodes: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Something went wrong. Please try again.");
  }
  return json;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Hydrate the cart from localStorage on first mount.
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      try {
        const storedId =
          typeof window !== "undefined" ? window.localStorage.getItem(CART_ID_STORAGE_KEY) : null;
        if (!storedId) {
          setIsLoading(false);
          return;
        }
        const res = await fetch(`/api/cart/get?cartId=${encodeURIComponent(storedId)}`);
        const json = await res.json();
        if (cancelled) return;
        if (json?.cart) {
          setCart(json.cart);
        } else {
          window.localStorage.removeItem(CART_ID_STORAGE_KEY);
        }
      } catch (err) {
        console.error("Failed to hydrate cart", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistCartId = useCallback((id: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_ID_STORAGE_KEY, id);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!cart?.id) return;
    try {
      const res = await fetch(`/api/cart/get?cartId=${encodeURIComponent(cart.id)}`);
      const json = await res.json();
      if (json?.cart) setCart(json.cart);
    } catch (err) {
      console.error("Failed to refresh cart", err);
    }
  }, [cart?.id]);

  const addItem = useCallback(
    async (merchandiseId: string, quantity = 1, title?: string) => {
      setIsMutating(true);
      try {
        let resultCart: Cart;
        if (!cart?.id) {
          const { cart: newCart } = await postJson<{ cart: Cart }>("/api/cart/create", {
            lines: [{ merchandiseId, quantity }],
          });
          setCart(newCart);
          persistCartId(newCart.id);
          resultCart = newCart;
        } else {
          const { cart: updated } = await postJson<{ cart: Cart }>("/api/cart/lines/add", {
            cartId: cart.id,
            lines: [{ merchandiseId, quantity }],
          });
          setCart(updated);
          resultCart = updated;
        }
        showToast(title ? `${title} added to cart` : "Added to cart", "success");
        return resultCart;
      } catch (err) {
        console.error(err);
        showToast(err instanceof Error ? err.message : "Could not add to cart", "error");
        return null;
      } finally {
        setIsMutating(false);
      }
    },
    [cart?.id, persistCartId]
  );

  const updateItemQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart?.id) return;
      setIsMutating(true);
      try {
        if (quantity <= 0) {
          const { cart: updated } = await postJson<{ cart: Cart }>("/api/cart/lines/remove", {
            cartId: cart.id,
            lineIds: [lineId],
          });
          setCart(updated);
        } else {
          const { cart: updated } = await postJson<{ cart: Cart }>("/api/cart/lines/update", {
            cartId: cart.id,
            lines: [{ id: lineId, quantity }],
          });
          setCart(updated);
        }
      } catch (err) {
        console.error(err);
        showToast(err instanceof Error ? err.message : "Could not update cart", "error");
      } finally {
        setIsMutating(false);
      }
    },
    [cart?.id]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart?.id) return;
      setIsMutating(true);
      try {
        const { cart: updated } = await postJson<{ cart: Cart }>("/api/cart/lines/remove", {
          cartId: cart.id,
          lineIds: [lineId],
        });
        setCart(updated);
        showToast("Item removed", "info");
      } catch (err) {
        console.error(err);
        showToast(err instanceof Error ? err.message : "Could not remove item", "error");
      } finally {
        setIsMutating(false);
      }
    },
    [cart?.id]
  );

  const applyDiscountCode = useCallback(
    async (code: string) => {
      if (!cart?.id) {
        showToast("Add an item to your cart first", "info");
        return false;
      }
      setIsMutating(true);
      try {
        const existingCodes = cart.discountCodes.map((d) => d.code);
        const { cart: updated } = await postJson<{ cart: Cart }>("/api/cart/discount", {
          cartId: cart.id,
          discountCodes: [...new Set([...existingCodes, code])],
        });
        setCart(updated);
        const applied = updated.discountCodes.find(
          (d) => d.code.toLowerCase() === code.toLowerCase()
        );
        if (applied?.applicable) {
          showToast("Discount code applied", "success");
          return true;
        }
        showToast("That code isn't valid for this cart", "error");
        return false;
      } catch (err) {
        console.error(err);
        showToast(err instanceof Error ? err.message : "Could not apply code", "error");
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [cart]
  );

  const removeDiscountCodes = useCallback(async () => {
    if (!cart?.id) return;
    setIsMutating(true);
    try {
      const { cart: updated } = await postJson<{ cart: Cart }>("/api/cart/discount", {
        cartId: cart.id,
        discountCodes: [],
      });
      setCart(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMutating(false);
    }
  }, [cart?.id]);

  const cartCount = cart?.totalQuantity ?? 0;

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      isLoading,
      isMutating,
      addItem,
      updateItemQuantity,
      removeItem,
      applyDiscountCode,
      removeDiscountCodes,
      refresh,
    }),
    [
      cart,
      cartCount,
      isLoading,
      isMutating,
      addItem,
      updateItemQuantity,
      removeItem,
      applyDiscountCode,
      removeDiscountCodes,
      refresh,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
