import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CART_KEY = "cart";

function safeParseCart(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readCartFromStorage() {
  if (typeof window === "undefined") return [];
  return safeParseCart(localStorage.getItem(CART_KEY));
}

function writeCartToStorage(cartItems) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readCartFromStorage());

  useEffect(() => {
    writeCartToStorage(items);
  }, [items]);

  const addItem = (menuItem, quantity = 1) => {
    if (!menuItem?._id) return;
    const qty = Number(quantity) || 0;
    if (qty <= 0) return;

    setItems((prev) => {
      const idx = prev.findIndex((x) => x.menuItemId === menuItem._id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [
        ...prev,
        {
          menuItemId: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          preparationType: menuItem.preparationType,
          quantity: qty,
        },
      ];
    });
  };

  const increase = (menuItemId) => {
    setItems((prev) =>
      prev.map((x) =>
        x.menuItemId === menuItemId ? { ...x, quantity: x.quantity + 1 } : x
      )
    );
  };

  const decrease = (menuItemId) => {
    setItems((prev) =>
      prev
        .map((x) =>
          x.menuItemId === menuItemId
            ? { ...x, quantity: Math.max(0, x.quantity - 1) }
            : x
        )
        .filter((x) => x.quantity > 0)
    );
  };

  const remove = (menuItemId) => {
    setItems((prev) => prev.filter((x) => x.menuItemId !== menuItemId));
  };

  const clear = () => setItems([]);

  const count = useMemo(
    () => items.reduce((sum, x) => sum + (x.quantity || 0), 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, x) => sum + (x.price || 0) * (x.quantity || 0), 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, increase, decrease, remove, clear, count, total }),
    [items, count, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

