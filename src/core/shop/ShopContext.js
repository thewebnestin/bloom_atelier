"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Check, Heart } from "lucide-react";

const ShopContext = createContext();

// Custom Toast Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2800);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[99999] flex items-center justify-between gap-4 bg-foreground text-background border border-border px-5 py-4 shadow-2xl rounded-none animate-slide-down-toast min-w-[280px] max-w-[90vw]">
      <div className="flex-1 flex items-center gap-3">
        {type === "success" ? (
          <Check size={16} className="text-accent flex-shrink-0" />
        ) : (
          <Heart
            size={16}
            fill="currentColor"
            className="text-accent flex-shrink-0"
          />
        )}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] leading-normal">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-background/40 hover:text-background text-[10px] uppercase font-bold tracking-[0.2em] ml-2 flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [theme, setTheme] = useState("light");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  // Toggle cart - close wishlist if open
  const toggleCart = () => {
    setIsWishlistOpen(false);
    setIsCartOpen((prev) => !prev);
  };

  // Toggle wishlist - close cart if open
  const toggleWishlist = (product) => {
    // If called with no product, toggle the drawer
    if (!product) {
      setIsCartOpen(false);
      setIsWishlistOpen((prev) => !prev);
      return;
    }
    // Otherwise, add/remove from wishlist
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        showToast(`${product.name} removed from Wishlist`, "info");
        return prev.filter((item) => item.id !== product.id);
      }
      showToast(`${product.name} added to Wishlist`, "success");
      return [...prev, product];
    });
  };

  // Close all drawers
  const closeAllDrawers = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
  };

  const addToCart = (product, variant, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.variant === variant.color + variant.size,
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          item.variant === variant.color + variant.size
            ? { ...item, quantity: item.quantity + qty }
            : item,
        );
      }
      return [
        ...prev,
        {
          ...product,
          variant: variant.color + variant.size,
          variantDetails: variant,
          quantity: qty,
        },
      ];
    });
    setIsWishlistOpen(false);
    showToast(`Added to Cart: ${product.name}`, "success");
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id + item.variant !== itemId));
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        theme,
        isCartOpen,
        isWishlistOpen,
        toggleTheme,
        addToCart,
        removeFromCart,
        toggleWishlist,
        removeFromWishlist,
        setIsCartOpen,
        setIsWishlistOpen,
        toggleCart,
        closeAllDrawers,
        showToast,
      }}
    >
      {children}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
