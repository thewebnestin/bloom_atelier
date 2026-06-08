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
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[99999] flex items-center justify-between gap-4 bg-background/95 backdrop-blur-md border border-border px-6 py-3.5 shadow-[0_12px_40px_rgba(5,31,32,0.08)] rounded-full animate-slide-down-toast min-w-[280px] max-w-[90vw]">
      <div className="flex-1 flex items-center gap-3">
        {type === "success" ? (
          <Check size={14} className="text-accent flex-shrink-0" />
        ) : (
          <Heart
            size={14}
            fill="currentColor"
            className="text-accent flex-shrink-0"
          />
        )}
        <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] leading-normal text-foreground">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-foreground/40 hover:text-foreground text-[10px] ml-1.5 flex-shrink-0 transition-colors"
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
