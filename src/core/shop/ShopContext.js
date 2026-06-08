"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Check, Heart } from "lucide-react";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ShopContext = createContext();

// Custom Toast Component (Styled as a luxury glassmorphic capsule)
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
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [theme, setTheme] = useState("light");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load products from Firestore, and seed database if empty
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const querySnapshot = await getDocs(collection(db, "products"));
        let productsList = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() });
        });

        if (productsList.length === 0) {
          console.log("Firestore products collection is empty. Seeding defaults...");
          const { products: defaultProducts } = await import("@/core/constants/ProductData");
          for (const item of defaultProducts) {
            const { id, ...dataToSeed } = item;
            const docRef = await addDoc(collection(db, "products"), dataToSeed);
            productsList.push({ id: docRef.id, ...dataToSeed });
          }
        }
        setProducts(productsList);
      } catch (err) {
        console.error("Error loading products from Firestore:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Listen to auth changes and sync user cart
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Define admin checks (explicit list or role field in Firestore)
        const email = firebaseUser.email || "";
        const isAdminEmail = email === "admin@bloomatelier.com" || email.endsWith("@bloomatelier.com");
        
        let isAdminDb = false;
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists() && userDoc.data().role === "admin") {
            isAdminDb = true;
          }
        } catch (e) {
          console.error("Error checking user role:", e);
        }
        
        setIsAdmin(isAdminEmail || isAdminDb);

        // Fetch user's cart from Firestore
        try {
          const cartDoc = await getDoc(doc(db, "carts", firebaseUser.uid));
          if (cartDoc.exists()) {
            setCart(cartDoc.data().items || []);
          }
        } catch (e) {
          console.error("Error loading cart:", e);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setCart([]); // Clear local cart on logout
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  const toggleCart = () => {
    setIsWishlistOpen(false);
    setIsCartOpen((prev) => !prev);
  };

  const toggleWishlist = (product) => {
    if (!product) {
      setIsCartOpen(false);
      setIsWishlistOpen((prev) => !prev);
      return;
    }
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

  const closeAllDrawers = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsAuthOpen(false);
  };

  const addToCart = (product, variant, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.variant === variant.color + variant.size,
      );
      let updatedCart = [];
      if (existing) {
        updatedCart = prev.map((item) =>
          item.id === product.id &&
          item.variant === variant.color + variant.size
            ? { ...item, quantity: item.quantity + qty }
            : item,
        );
      } else {
        updatedCart = [
          ...prev,
          {
            ...product,
            variant: variant.color + variant.size,
            variantDetails: variant,
            quantity: qty,
          },
        ];
      }

      // Sync with Firestore if logged in
      if (auth.currentUser) {
        setDoc(doc(db, "carts", auth.currentUser.uid), { items: updatedCart })
          .catch(err => console.error("Error syncing cart to Firestore:", err));
      }
      return updatedCart;
    });

    setIsWishlistOpen(false);
    showToast(`Added to Cart: ${product.name}`, "success");
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const updatedCart = prev.filter((item) => item.id + item.variant !== itemId);
      
      // Sync with Firestore if logged in
      if (auth.currentUser) {
        setDoc(doc(db, "carts", auth.currentUser.uid), { items: updatedCart })
          .catch(err => console.error("Error syncing cart to Firestore:", err));
      }
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (auth.currentUser) {
      setDoc(doc(db, "carts", auth.currentUser.uid), { items: [] })
        .catch(err => console.error("Error clearing cart:", err));
    }
  };

  const createOrder = async (customerName, customerEmail, subtotal) => {
    try {
      const orderData = {
        userId: auth.currentUser?.uid || "guest",
        customerName: customerName || auth.currentUser?.displayName || "Guest Customer",
        customerEmail: customerEmail || auth.currentUser?.email || "guest@example.com",
        items: cart,
        subtotal: subtotal,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, "orders"), orderData);
      
      // Clear local and remote cart
      clearCart();
      
      return docRef.id;
    } catch (e) {
      console.error("Error creating order in Firestore:", e);
      throw e;
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        loadingProducts,
        cart,
        wishlist,
        theme,
        isCartOpen,
        isWishlistOpen,
        isAuthOpen,
        user,
        isAdmin,
        toggleTheme,
        addToCart,
        removeFromCart,
        clearCart,
        createOrder,
        toggleWishlist,
        removeFromWishlist,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsAuthOpen,
        toggleCart,
        closeAllDrawers,
        showToast,
        setProducts // Expose setProducts to allow immediate updates from admin CRUD operations
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
