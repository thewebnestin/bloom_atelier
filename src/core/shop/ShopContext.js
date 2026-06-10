"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Check, Heart } from "lucide-react";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";

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

const ADMIN_EMAILS = ["admin@bloooms.atelier.com", "admin@bloomatelier.com", "admin@gmail.com", "rinshadcontacts@gmail.com"];

export function ShopProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [theme, setTheme] = useState("light");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
      try {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark" || savedTheme === "light") {
          setTheme(savedTheme);
        } else {
          const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          setTheme(systemPrefersDark ? "dark" : "light");
        }
      } catch (e) {
        console.error("Failed to load theme from localStorage:", e);
      }
    });
  }, []);

  // Global Role-Based Redirection & Visibility Guard
  useEffect(() => {
    // 1. Redirection checks
    if (user && isAdmin && pathname !== "/admin") {
      router.push("/admin");
    }
    if (user && !isAdmin && pathname === "/admin") {
      router.push("/");
    }

    // 2. Clear admin-hidden blocker class when safe to show content
    if (typeof document !== "undefined") {
      const isStoredAdmin = localStorage.getItem("isAdmin") === "true";
      
      if (pathname === "/admin") {
        document.documentElement.classList.remove("admin-hidden");
      } else if (user && !isAdmin) {
        document.documentElement.classList.remove("admin-hidden");
      } else if (!isStoredAdmin) {
        document.documentElement.classList.remove("admin-hidden");
      }
    }
  }, [user, isAdmin, pathname, router]);



  // Seed default products into Firestore if database is empty, then load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        let productsList = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ id: doc.id, ...doc.data() });
        });

        if (productsList.length === 0) {
          // Empty DB, run initial seeding
          const { products: defaultProducts } = require("../constants/ProductData");
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
        const isAdminEmail = ADMIN_EMAILS.includes(email);
        
        let currentProfile = {};
        let isAdminDb = false;
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            currentProfile = userDoc.data();
            if (currentProfile.isBlocked === true) {
              const { logout } = await import("@/services/authService");
              await logout();
              showToast("Your account has been blocked by an administrator.", "error");
              return;
            }
            isAdminDb = currentProfile.role === "admin";
          } else {
            // Create initial profile document with role
            const isUserAdmin = ADMIN_EMAILS.includes(email);
            currentProfile = {
              displayName: firebaseUser.displayName || "Studio User",
              email: firebaseUser.email || "",
              role: isUserAdmin ? "admin" : "user",
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, "users", firebaseUser.uid), currentProfile);
            isAdminDb = isUserAdmin;
          }
          setUserProfile(currentProfile);
        } catch (e) {
          console.error("Error loading user profile:", e);
          setUserProfile({});
        }
        
        const activeAdminStatus = isAdminEmail || isAdminDb;
        setIsAdmin(activeAdminStatus);
        try {
          localStorage.setItem("isAdmin", JSON.stringify(activeAdminStatus));
        } catch (e) {}

        // Get local guest items before merging
        let localCart = [];
        let localWishlist = [];
        try {
          const savedCart = localStorage.getItem("guest_cart");
          if (savedCart) localCart = JSON.parse(savedCart);
          
          const savedWishlist = localStorage.getItem("guest_wishlist");
          if (savedWishlist) localWishlist = JSON.parse(savedWishlist);
        } catch (e) {
          console.error("Error loading local storage in auth:", e);
        }

        // Fetch and merge user's cart from Firestore
        let mergedCart = [];
        try {
          const cartDoc = await getDoc(doc(db, "carts", firebaseUser.uid));
          let dbCart = [];
          if (cartDoc.exists()) {
            dbCart = cartDoc.data().items || [];
          }
          
          // Merge logic: Combine localCart and dbCart
          mergedCart = [...dbCart];
          localCart.forEach(localItem => {
            const existingIdx = mergedCart.findIndex(
              dbItem => dbItem.id === localItem.id && dbItem.variant === localItem.variant
            );
            if (existingIdx > -1) {
              mergedCart[existingIdx].quantity += localItem.quantity;
            } else {
              mergedCart.push(localItem);
            }
          });
          
          setCart(mergedCart);
          
          // Save merged cart back to database
          await setDoc(doc(db, "carts", firebaseUser.uid), { items: mergedCart });
        } catch (e) {
          console.error("Error merging cart:", e);
        }

        // Fetch and merge user's wishlist from Firestore
        let mergedWishlist = [];
        try {
          const wishlistDoc = await getDoc(doc(db, "wishlists", firebaseUser.uid));
          let dbWishlist = [];
          if (wishlistDoc.exists()) {
            dbWishlist = wishlistDoc.data().items || [];
          }
          
          // Merge wishlist (unique by product ID)
          mergedWishlist = [...dbWishlist];
          localWishlist.forEach(localItem => {
            const exists = mergedWishlist.some(dbItem => dbItem.id === localItem.id);
            if (!exists) {
              mergedWishlist.push(localItem);
            }
          });
          
          setWishlist(mergedWishlist);
          
          // Save merged wishlist back to database
          await setDoc(doc(db, "wishlists", firebaseUser.uid), { items: mergedWishlist });
        } catch (e) {
          console.error("Error merging wishlist:", e);
        }

        // Clear local storage guest keys after successful migration
        try {
          localStorage.removeItem("guest_cart");
          localStorage.removeItem("guest_wishlist");
        } catch (e) {}
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
        try {
          localStorage.removeItem("isAdmin");
        } catch (e) {}
        setCart([]); // Clear state
        setWishlist([]); // Clear state
        
        // Re-read guest data if logout occurs
        try {
          const savedCart = localStorage.getItem("guest_cart");
          if (savedCart) setCart(JSON.parse(savedCart));
          const savedWishlist = localStorage.getItem("guest_wishlist");
          if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        } catch (e) {}
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {}
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

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
      let updatedWishlist = [];
      if (exists) {
        showToast(`${product.name} removed from Wishlist`, "info");
        updatedWishlist = prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`${product.name} added to Wishlist`, "success");
        updatedWishlist = [...prev, product];
      }
      
      // Sync with Firestore if logged in
      if (auth.currentUser) {
        setDoc(doc(db, "wishlists", auth.currentUser.uid), { items: updatedWishlist })
          .catch(err => console.error("Error syncing wishlist to Firestore:", err));
      } else {
        // Guest user - sync to localStorage
        try {
          localStorage.setItem("guest_wishlist", JSON.stringify(updatedWishlist));
        } catch (e) {
          console.error("Error saving guest wishlist:", e);
        }
      }
      return updatedWishlist;
    });
  };

  const closeAllDrawers = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsAuthOpen(false);
    setIsProfileOpen(false);
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
      } else {
        // Guest user - sync to localStorage
        try {
          localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
        } catch (e) {
          console.error("Error saving guest cart:", e);
        }
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
      } else {
        // Guest user - sync to localStorage
        try {
          localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
        } catch (e) {
          console.error("Error saving guest cart:", e);
        }
      }
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (auth.currentUser) {
      setDoc(doc(db, "carts", auth.currentUser.uid), { items: [] })
        .catch(err => console.error("Error clearing cart:", err));
    } else {
      try {
        localStorage.removeItem("guest_cart");
      } catch (e) {}
    }
  };

  const createOrder = async (customerName, customerEmail, subtotal, billingDetails) => {
    try {
      const orderData = {
        userId: auth.currentUser?.uid || "guest",
        customerName: customerName || auth.currentUser?.displayName || "Guest Customer",
        customerEmail: customerEmail || auth.currentUser?.email || "guest@example.com",
        items: cart,
        subtotal: subtotal,
        status: "Pending",
        billingDetails: billingDetails || null,
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
    setWishlist((prev) => {
      const updatedWishlist = prev.filter((item) => item.id !== productId);
      
      // Sync with Firestore if logged in
      if (auth.currentUser) {
        setDoc(doc(db, "wishlists", auth.currentUser.uid), { items: updatedWishlist })
          .catch(err => console.error("Error syncing wishlist to Firestore:", err));
      } else {
        // Guest user - sync to localStorage
        try {
          localStorage.setItem("guest_wishlist", JSON.stringify(updatedWishlist));
        } catch (e) {
          console.error("Error saving guest wishlist:", e);
        }
      }
      return updatedWishlist;
    });
  };

  const shouldRender = !mounted || (!(user && isAdmin && pathname !== "/admin") && !(user && !isAdmin && pathname === "/admin"));

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
        isProfileOpen,
        user,
        userProfile,
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
        setIsProfileOpen,
        setUserProfile,
        toggleCart,
        closeAllDrawers,
        showToast,
        setProducts // Expose setProducts to allow immediate updates from admin CRUD operations
      }}
    >
      {shouldRender ? children : (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}
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
