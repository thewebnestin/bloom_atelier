"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [theme, setTheme] = useState('light');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

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
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => (item.id + item.variant) !== itemId));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  };

  return (
    <ShopContext.Provider value={{ 
      cart, wishlist, theme, isCartOpen,
      toggleTheme, addToCart, removeFromCart, toggleWishlist, setIsCartOpen 
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
