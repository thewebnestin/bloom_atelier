"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [theme, setTheme] = useState('light');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Toggle cart - close wishlist if open
  const toggleCart = () => {
    setIsWishlistOpen(false);
    setIsCartOpen(prev => !prev);
  };

  // Toggle wishlist - close cart if open
  const toggleWishlist = (product) => {
    // If called with no product, toggle the drawer
    if (!product) {
      setIsCartOpen(false);
      setIsWishlistOpen(prev => !prev);
      return;
    }
    // Otherwise, add/remove from wishlist
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  // Close all drawers
  const closeAllDrawers = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
  };

  const addToCart = (product, variant) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.variant === variant.color + variant.size);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.variant === variant.color + variant.size 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, variant: variant.color + variant.size, variantDetails: variant, quantity: 1 }];
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => (item.id + item.variant) !== itemId));
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <ShopContext.Provider value={{ 
      cart, wishlist, theme, isCartOpen, isWishlistOpen,
      toggleTheme, addToCart, removeFromCart, toggleWishlist, 
      removeFromWishlist, setIsCartOpen, setIsWishlistOpen,
      toggleCart, closeAllDrawers
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
