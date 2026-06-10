"use client";
import React, { useState, useEffect, useCallback } from "react";
import AdminNavbar from "@/components/layout/AdminNavbar";
import AuthDrawer from "@/components/cart/AuthDrawer";
import { useShop } from "@/core/shop/ShopContext";
import { logout } from "@/services/authService";
import { db } from "@/core/firebase/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { 
  Plus, Edit2, Trash2, LayoutDashboard, ShoppingCart, 
  Package, LogOut, Loader2, Check, X, ShieldAlert, Users,
  MessageCircle
} from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function AdminPage() {
  const { user, isAdmin, products, setProducts, showToast, setIsAuthOpen } = useShop();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountsSearch, setAccountsSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Product CRUD Form States
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Studio Collection",
    image: "",
    images: "",
    description: "",
    featured: false,
    colorsInput: "Signature Green:#051f20, Soft Pink:#F4C2C2, Raw Parchment:#D9D4C8",
    sizesInput: "Standard, Large, Studio Reserve"
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  // Cloudinary Upload States & Handlers
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDetails, setUploadingDetails] = useState(false);

  const uploadToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";
    
    if (cloudName === "your_cloud_name") {
      throw new Error("Cloudinary Cloud Name is not configured. Please define NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment variables/file.");
    }
    
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadData
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || "Cloudinary upload failed");
    }
    
    const data = await res.json();
    return data.secure_url;
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploadingImage(true);
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: url }));
      showToast("Main image uploaded successfully to Cloudinary!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to upload main image", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDetailImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    try {
      setUploadingDetails(true);
      showToast(`Uploading ${files.length} images to Cloudinary...`, "info");
      const urls = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        urls.push(url);
      }
      
      setFormData(prev => {
        const currentImages = prev.images 
          ? prev.images.split(",").map(i => i.trim()).filter(Boolean)
          : [];
        const combined = [...currentImages, ...urls].join(", ");
        return { ...prev, images: combined };
      });
      
      showToast("Detail images uploaded successfully to Cloudinary!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to upload detail images", "error");
    } finally {
      setUploadingDetails(false);
    }
  };

  const COLOR_PRESETS = [
    // --- Studio Core ---
    { name: "Signature Green", hex: "#051f20", category: "Studio Core" },
    { name: "Dark Green", hex: "#051f20", category: "Studio Core" },
    { name: "Midnight Green", hex: "#051f20", category: "Studio Core" },
    { name: "Forest Green", hex: "#051f20", category: "Studio Core" },
    { name: "Studio Signature", hex: "#051f20", category: "Studio Core" },
    { name: "Forest Green Mix", hex: "#0a2a2b", category: "Studio Core" },
    { name: "Raw Parchment", hex: "#D9D4C8", category: "Studio Core" },
    { name: "Parchment", hex: "#D9D4C8", category: "Studio Core" },
    { name: "Parchment Mix", hex: "#D9D4C8", category: "Studio Core" },
    { name: "Bone White", hex: "#E5E1D8", category: "Studio Core" },
    
    // --- Pastels & Blushes ---
    { name: "Soft Pink", hex: "#F4C2C2", category: "Pastels & Blushes" },
    { name: "Rose Pink", hex: "#F4C2C2", category: "Pastels & Blushes" },
    { name: "Lavender Haze", hex: "#E6E6FA", category: "Pastels & Blushes" },
    { name: "Lilac Breeze", hex: "#D8BFD8", category: "Pastels & Blushes" },
    { name: "Sage Green", hex: "#9CAF88", category: "Pastels & Blushes" },
    { name: "Mint Sorbet", hex: "#AAF0D1", category: "Pastels & Blushes" },
    { name: "Buttercream", hex: "#FFFDD0", category: "Pastels & Blushes" },
    { name: "Peach Fuzz", hex: "#FFBE98", category: "Pastels & Blushes" },
    { name: "Coral Blush", hex: "#FF7F50", category: "Pastels & Blushes" },
    { name: "Sky Blue", hex: "#87CEEB", category: "Pastels & Blushes" },

    // --- Rich & Warm ---
    { name: "Burnt Orange", hex: "#CC5500", category: "Rich & Warm" },
    { name: "Mustard Velvet", hex: "#E1AD01", category: "Rich & Warm" },
    { name: "Rust Crimson", hex: "#B7410E", category: "Rich & Warm" },
    { name: "Terracotta", hex: "#E2725B", category: "Rich & Warm" },
    { name: "Chocolate Brown", hex: "#4A3525", category: "Rich & Warm" },
    { name: "Emerald Velvet", hex: "#097969", category: "Rich & Warm" },
    
    // --- Luxury & Royal ---
    { name: "Crimson Rose", hex: "#990000", category: "Luxury & Royal" },
    { name: "Deep Plum", hex: "#4D0033", category: "Luxury & Royal" },
    { name: "Royal Indigo", hex: "#4B0082", category: "Luxury & Royal" },
    { name: "Luxury Violet", hex: "#8A2BE2", category: "Luxury & Royal" },
    { name: "Champagne Gold", hex: "#F7E7CE", category: "Luxury & Royal" },

    // --- Earthy Neutrals ---
    { name: "Desert Sand", hex: "#EDC9AF", category: "Earthy Neutrals" },
    { name: "Warm Charcoal", hex: "#36454F", category: "Earthy Neutrals" },
    { name: "Slate Stone", hex: "#708090", category: "Earthy Neutrals" },
    { name: "Ivory Cream", hex: "#FFFFF0", category: "Earthy Neutrals" }
  ];

  const getSelectedColors = useCallback(() => {
    if (!formData.colorsInput || !formData.colorsInput.trim()) return [];
    return formData.colorsInput
      .split(",")
      .map(pair => {
        const parts = pair.split(":");
        if (parts.length === 2) {
          return { name: parts[0].trim(), hex: parts[1].trim() };
        }
        return null;
      })
      .filter(Boolean);
  }, [formData.colorsInput]);

  const handleToggleColorPreset = useCallback((preset) => {
    const currentColors = getSelectedColors();
    const existsIdx = currentColors.findIndex(c => c.name.toLowerCase() === preset.name.toLowerCase());
    
    if (existsIdx > -1) {
      currentColors.splice(existsIdx, 1);
    } else {
      currentColors.push(preset);
    }
    
    const newColorsString = currentColors
      .map(c => `${c.name}:${c.hex}`)
      .join(", ");
      
    setFormData(prev => ({ ...prev, colorsInput: newColorsString }));
  }, [getSelectedColors]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const querySnapshot = await getDocs(collection(db, "orders"));
      let ordersList = [];
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });
      // Sort orders by date descending
      ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ordersList);
    } catch (e) {
      console.error("Error fetching orders:", e);
      showToast("Error loading orders", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      let accountsList = [];
      querySnapshot.forEach((doc) => {
        accountsList.push({ id: doc.id, ...doc.data() });
      });
      setAccounts(accountsList);
    } catch (e) {
      console.error("Error fetching accounts:", e);
      showToast("Error loading registered users", "error");
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Fetch orders and accounts when admin status resolved
  useEffect(() => {
    if (isAdmin) {
      requestAnimationFrame(() => {
        fetchOrders();
        fetchAccounts();
      });
    }
  }, [isAdmin]);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setAccounts(prev => prev.map(acc => acc.id === userId ? { ...acc, role: newRole } : acc));
      showToast(`User role updated to ${newRole}`, "success");
    } catch (e) {
      console.error("Error toggling role:", e);
      showToast("Failed to update user role", "error");
    }
  };

  const handleToggleBlock = async (userId, currentBlockedStatus) => {
    const newBlockedStatus = !currentBlockedStatus;
    try {
      await updateDoc(doc(db, "users", userId), { isBlocked: newBlockedStatus });
      setAccounts(prev => prev.map(acc => acc.id === userId ? { ...acc, isBlocked: newBlockedStatus } : acc));
      showToast(`User ${newBlockedStatus ? "blocked" : "unblocked"} successfully!`, "success");
    } catch (e) {
      console.error("Error toggling block status:", e);
      showToast("Failed to update user block status.", "error");
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await logout();
      showToast("Signed out successfully", "info");
    } catch (e) {
      showToast("Logout failed", "error");
    }
  };

  const getSanitizedPhone = useCallback((phoneStr) => {
    if (!phoneStr) return "";
    let cleaned = phoneStr.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.length === 10) {
      cleaned = "91" + cleaned;
    }
    return cleaned;
  }, []);

  const getWhatsAppStatusLink = useCallback((order) => {
    const phone = getSanitizedPhone(order.billingDetails?.phone);
    if (!phone) return "#";
    const statusText = order.status || "Pending";
    const message = `Hello ${order.customerName},\n\nWe wanted to update you that your Bloom Atelier order *#${order.id}* status has been updated to *${statusText}*.\n\nThank you for choosing Bloom Atelier! ✨`;
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
  }, [getSanitizedPhone]);

  // Change order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order status updated to ${newStatus}. Click WhatsApp icon to notify customer!`, "success");
    } catch (e) {
      console.error("Error updating status:", e);
      showToast("Failed to update status", "error");
    }
  };

  // Open Add Product Form
  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      category: "Studio Collection",
      image: "",
      images: "",
      description: "",
      featured: false,
      colorsInput: "Signature Green:#051f20, Soft Pink:#F4C2C2, Raw Parchment:#D9D4C8",
      sizesInput: "Standard, Large, Studio Reserve"
    });
    setShowProductForm(true);
  };

  // Open Edit Product Form
  const openEditForm = (product) => {
    setEditingProduct(product);
    
    // Parse variants colors back to input string (Name:Hex, Name:Hex)
    const colorsString = product.variants?.colors
      ?.map(c => `${c.name}:${c.hex}`)
      .join(", ") || "";
      
    // Parse sizes back to comma-separated
    const sizesString = product.variants?.sizes?.join(", ") || "";

    setFormData({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "Studio Collection",
      image: product.image || "",
      images: product.images?.join(", ") || "",
      description: product.description || "",
      featured: !!product.featured,
      colorsInput: colorsString,
      sizesInput: sizesString
    });
    setShowProductForm(true);
  };

  // Save/Create Product in Firestore
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
      showToast("Please fill all required fields", "info");
      return;
    }

    try {
      setSavingProduct(true);

      // Parse colors inputs
      const colors = formData.colorsInput
        .split(",")
        .map(pair => {
          const parts = pair.split(":");
          if (parts.length === 2) {
            return { name: parts[0].trim(), hex: parts[1].trim() };
          }
          return null;
        })
        .filter(Boolean);

      // Parse sizes inputs
      const sizes = formData.sizesInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      // Parse images inputs
      const detailImages = formData.images
        ? formData.images.split(",").map(img => img.trim()).filter(Boolean)
        : [formData.image];

      const productPayload = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        image: formData.image,
        images: detailImages,
        description: formData.description,
        featured: formData.featured,
        variants: { colors, sizes }
      };

      if (editingProduct) {
        // Update
        await updateDoc(doc(db, "products", editingProduct.id), productPayload);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { id: editingProduct.id, ...productPayload } : p));
        showToast("Product updated successfully!", "success");
      } else {
        // Create
        const docRef = await addDoc(collection(db, "products"), productPayload);
        setProducts(prev => [...prev, { id: docRef.id, ...productPayload }]);
        showToast("Product created successfully!", "success");
      }

      setShowProductForm(false);
    } catch (err) {
      console.error("Error saving product:", err);
      showToast("Error saving product", "error");
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to remove this product from the catalog?")) return;
    try {
      await deleteDoc(doc(db, "products", productId));
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast("Product deleted successfully", "info");
    } catch (e) {
      console.error("Error deleting product:", e);
      showToast("Failed to delete product", "error");
    }
  };

  // Analytics helper calculations
  const totalSales = orders
    .filter(o => o.status === "Completed" || o.status === "Shipped" || o.status === "Processing")
    .reduce((acc, o) => acc + (o.subtotal || 0), 0);

  // 1. Auth Guard Gate: Logged-in & Admin Check
  if (!user || !isAdmin) {
    return (
      <main className="bg-background min-h-screen selection:bg-accent/30 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-secondary/35 border border-border p-8 rounded-2xl shadow-sm text-center space-y-8 animate-slide-down-toast">
          <div className="space-y-3">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em]">Studio Dashboard</span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">
              Admin Portal
            </h2>
            <p className="text-muted text-xs font-medium max-w-xs mx-auto">
              Access to the administrator workspace is restricted. Please sign in with an authorized account.
            </p>
          </div>

          {user && !isAdmin && (
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl flex items-start gap-3 text-left">
              <ShieldAlert size={16} className="text-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-foreground">Access Denied</h4>
                <p className="text-[10px] text-muted leading-relaxed font-semibold">
                  The account <strong>{user.email}</strong> is not registered as an administrator. Please sign out and log in with an authorized account.
                </p>
              </div>
            </div>
          )}

          {!user ? (
            <div className="space-y-4">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full py-4 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center gap-2"
              >
                Open Login Portal
              </button>
              <p className="text-center text-[9px] text-muted/40 font-extrabold uppercase tracking-widest pt-4">
                Use your admin credentials in the central Bloom Atelier portal.
              </p>
            </div>
          ) : (
            <button
              onClick={handleSignOut}
              className="w-full py-4 bg-background border border-border text-foreground font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> Log Out
            </button>
          )}
        </div>
        <AuthDrawer />
      </main>
    );
  }

  // 2. Main Admin Dashboard View
  return (
    <main className="bg-background min-h-screen selection:bg-accent/30 flex flex-col justify-between">
      <AdminNavbar />
      
      <div className="flex-1 container mx-auto px-6 md:px-8 pt-28 pb-16">
        
        {/* Admin Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/60 pb-8 mb-10 gap-6">
          <div className="space-y-2">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em]">Administrator Workspace</span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground">
              Studio Manager
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-foreground">{user.displayName || "Manager"}</p>
              <p className="text-[9px] uppercase tracking-wider text-muted font-bold">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-3 border border-border rounded-full hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-500 text-muted"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-border mb-8 overflow-x-auto gap-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 py-4 border-b-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === "dashboard"
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground/40 hover:text-foreground"
            }`}
          >
            <LayoutDashboard size={14} /> Overview
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 py-4 border-b-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === "products"
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground/40 hover:text-foreground"
            }`}
          >
            <Package size={14} /> Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 py-4 border-b-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === "orders"
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground/40 hover:text-foreground"
            }`}
          >
            <ShoppingCart size={14} /> Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("accounts")}
            className={`flex items-center gap-2 py-4 border-b-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === "accounts"
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground/40 hover:text-foreground"
            }`}
          >
            <Users size={14} /> Accounts ({accounts.length})
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === "dashboard" && (
          <div className="space-y-10">
            {/* Analytics Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-secondary/20 border border-border p-8 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Total Revenue (Settled)</span>
                <h3 className="text-4xl font-extrabold tracking-tighter text-foreground">₹{totalSales}</h3>
              </div>
              <div className="bg-secondary/20 border border-border p-8 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Total Orders Placed</span>
                <h3 className="text-4xl font-extrabold tracking-tighter text-foreground">{orders.length}</h3>
              </div>
              <div className="bg-secondary/20 border border-border p-8 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Catalog Products Count</span>
                <h3 className="text-4xl font-extrabold tracking-tighter text-foreground">{products.length}</h3>
              </div>
              <div className="bg-secondary/20 border border-border p-8 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Registered Customers</span>
                <h3 className="text-4xl font-extrabold tracking-tighter text-foreground">{accounts.length}</h3>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Recent Activity</h3>
              <div className="bg-secondary/20 border border-border rounded-2xl overflow-hidden shadow-sm">
                {loadingOrders ? (
                  <div className="p-12 text-center text-xs uppercase tracking-widest animate-pulse font-bold text-muted">
                    Retrieving activity logs...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 text-center text-xs uppercase tracking-widest font-bold text-muted">
                    No orders registered in system.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-secondary/40 border-b border-border uppercase font-bold text-foreground/50 tracking-wider">
                        <tr>
                          <th className="p-5">Customer</th>
                          <th className="p-5">Date</th>
                          <th className="p-5">Items</th>
                          <th className="p-5">Subtotal</th>
                          <th className="p-5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-background/40 transition-colors">
                            <td className="p-5">
                              <p className="font-bold text-foreground">{order.customerName}</p>
                              <p className="text-[10px] text-muted leading-none mt-0.5">{order.customerEmail}</p>
                            </td>
                            <td className="p-5 text-muted font-medium">
                              {new Date(order.createdAt).toLocaleDateString(undefined, {
                                month: "short", day: "numeric", year: "numeric"
                              })}
                            </td>
                            <td className="p-5 font-semibold text-muted/80">
                              {order.items?.map(i => `${i.name} (${i.quantity})`).join(", ")}
                            </td>
                            <td className="p-5 font-bold text-foreground">₹{order.subtotal}</td>
                            <td className="p-5">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                                order.status === "Completed" ? "bg-green-500/10 text-green-600 border border-green-600/20" :
                                order.status === "Shipped" ? "bg-blue-500/10 text-blue-600 border border-blue-600/20" :
                                order.status === "Processing" ? "bg-yellow-500/10 text-yellow-600 border border-yellow-600/20" :
                                "bg-amber-500/10 text-amber-600 border border-amber-600/20"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Manage Products</h3>
              {!showProductForm && (
                <button
                  onClick={openAddForm}
                  className="px-6 py-3 bg-foreground text-background hover:bg-accent hover:text-accent-foreground text-[10px] font-extrabold uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2"
                >
                  <Plus size={14} /> Add Product
                </button>
              )}
            </div>

            {/* CRUD Form */}
            {showProductForm && (
              <div className="bg-secondary/20 border border-border p-8 rounded-2xl space-y-6">
                <div className="flex justify-between items-center border-b border-border/60 pb-4">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                    {editingProduct ? `Edit: ${editingProduct.name}` : "Create New Product"}
                  </h4>
                  <button 
                    onClick={() => setShowProductForm(false)} 
                    className="p-2 border border-border rounded-full hover:bg-background transition-colors text-muted"
                  >
                    <X size={14} />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-3 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Price (INR) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-5 py-3 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-5 py-3 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent"
                    >
                      <option value="Studio Collection">Studio Collection</option>
                      <option value="Velvet Series">Velvet Series</option>
                      <option value="Art Series">Art Series</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Main Image Path/URL *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Image URL or local path"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="flex-1 px-5 py-3 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent"
                      />
                      <label className="px-5 py-3 border border-border rounded-full text-[10px] font-extrabold uppercase tracking-widest cursor-pointer hover:bg-secondary/40 text-foreground transition-all duration-500 flex items-center justify-center min-w-[120px] text-center select-none">
                        {uploadingImage ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : "Upload File"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {/* Live Preview for Main Image */}
                    {formData.image && (
                      <div className="mt-3 relative w-24 h-32 rounded-lg border border-border overflow-hidden bg-secondary shadow-sm">
                        <img src={formData.image} className="w-full h-full object-cover" alt="Main Preview" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                          className="absolute top-1.5 right-1.5 p-1 bg-black/50 hover:bg-black text-white rounded-full transition-colors"
                          title="Remove Image"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Additional Details Images (Comma-separated URLs)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Comma-separated image URLs"
                        value={formData.images}
                        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                        className="flex-1 px-5 py-3 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent"
                      />
                      <label className="px-5 py-3 border border-border rounded-full text-[10px] font-extrabold uppercase tracking-widest cursor-pointer hover:bg-secondary/40 text-foreground transition-all duration-500 flex items-center justify-center min-w-[120px] text-center select-none">
                        {uploadingDetails ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : "Upload Files"}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleDetailImagesChange}
                          disabled={uploadingDetails}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {/* Live Preview for Details Images */}
                    {formData.images && formData.images.trim() && (
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {formData.images.split(",").map(i => i.trim()).filter(Boolean).map((imgUrl, index) => (
                          <div key={index} className="relative w-16 h-20 rounded-md border border-border overflow-hidden bg-secondary shadow-sm">
                            <img src={imgUrl} className="w-full h-full object-cover" alt={`Detail ${index}`} />
                            <button
                              type="button"
                              onClick={() => {
                                const list = formData.images.split(",").map(i => i.trim()).filter(Boolean);
                                list.splice(index, 1);
                                setFormData(prev => ({ ...prev, images: list.join(", ") }));
                              }}
                              className="absolute top-1 right-1 p-0.5 bg-black/50 hover:bg-black text-white rounded-full transition-colors"
                              title="Remove Image"
                            >
                              <X size={8} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Product Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-6 py-4 bg-background border border-border rounded-2xl text-xs font-semibold focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2 relative">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Select Colors *</label>
                    
                    {/* Dropdown Button */}
                    <div 
                      onClick={() => setShowColorDropdown(!showColorDropdown)}
                      className="w-full px-5 py-3.5 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent cursor-pointer flex justify-between items-center select-none"
                    >
                      <div className="flex flex-wrap gap-2">
                        {getSelectedColors().length > 0 ? (
                          getSelectedColors().map((c, idx) => (
                            <span key={idx} className="flex items-center gap-1.5 bg-secondary/40 px-2.5 py-1 rounded-full text-[9px] font-bold">
                              <span className="w-2 h-2 rounded-full border border-border/20" style={{ backgroundColor: c.hex }} />
                              {c.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted/60">Choose active colors...</span>
                        )}
                      </div>
                      <span className="text-muted/50 text-[10px]">{showColorDropdown ? "▲" : "▼"}</span>
                    </div>

                    {/* Dropdown Menu */}
                    {showColorDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-xl z-50 p-5 max-h-[350px] overflow-y-auto space-y-5 animate-slide-down-toast">
                        {["Studio Core", "Pastels & Blushes", "Rich & Warm", "Luxury & Royal", "Earthy Neutrals"].map((cat) => {
                          const catPresets = COLOR_PRESETS.filter(p => p.category === cat);
                          return (
                            <div key={cat} className="space-y-2.5">
                              <div className="text-[8px] font-black uppercase tracking-widest text-muted/65 border-b border-border/40 pb-1">
                                {cat}
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {catPresets.map((preset) => {
                                  const isSelected = getSelectedColors().some(c => c.name.toLowerCase() === preset.name.toLowerCase());
                                  return (
                                    <div
                                      key={preset.name}
                                      onClick={() => handleToggleColorPreset(preset)}
                                      className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer select-none transition-all duration-300 border ${
                                        isSelected 
                                          ? "bg-accent/10 border-accent/40 font-bold" 
                                          : "bg-secondary/15 border-transparent hover:bg-secondary/35 hover:border-border/40"
                                      }`}
                                    >
                                      <span className="w-3.5 h-3.5 rounded-full border border-border/20 shadow-sm flex-shrink-0" style={{ backgroundColor: preset.hex }} />
                                      <span className="text-[10px] text-foreground font-semibold truncate" title={preset.name}>
                                        {preset.name}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Sizes Input (Comma-separated)</label>
                    <input
                      type="text"
                      value={formData.sizesInput}
                      onChange={(e) => setFormData({ ...formData, sizesInput: e.target.value })}
                      className="w-full px-5 py-3 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4 rounded border-border accent-accent"
                    />
                    <label htmlFor="featured" className="text-[10px] font-extrabold uppercase tracking-widest text-foreground">Featured Arrangement</label>
                  </div>

                  <div className="md:col-span-2 flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={savingProduct}
                      className="px-8 py-4 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center gap-2"
                    >
                      {savingProduct ? <Loader2 size={14} className="animate-spin" /> : editingProduct ? "Save Changes" : "Create Product"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="px-8 py-4 border border-border text-foreground font-bold text-xs uppercase tracking-widest rounded-full hover:bg-secondary/40 transition-all duration-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Catalog List */}
            <div className="bg-secondary/20 border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/40 border-b border-border uppercase font-bold text-foreground/50 tracking-wider">
                    <tr>
                      <th className="p-5">Product</th>
                      <th className="p-5">Category</th>
                      <th className="p-5">Price</th>
                      <th className="p-5">Featured</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-background/40 transition-colors">
                        <td className="p-5 flex items-center gap-4">
                          <div className="w-10 h-12 rounded overflow-hidden bg-secondary border border-border/40 flex-shrink-0">
                            <img src={product.image} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{product.name}</p>
                            <p className="text-[10px] text-muted truncate max-w-xs mt-0.5">{product.description}</p>
                          </div>
                        </td>
                        <td className="p-5 text-muted font-medium">{product.category}</td>
                        <td className="p-5 font-bold text-foreground">₹{product.price}</td>
                        <td className="p-5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest ${
                            product.featured 
                              ? "bg-accent/20 text-accent border border-accent/20" 
                              : "bg-muted/10 text-muted/60 border border-muted/20"
                          }`}>
                            {product.featured ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="p-5 text-right space-x-2">
                          <button
                            onClick={() => openEditForm(product)}
                            className="p-2 border border-border rounded-full hover:bg-background text-muted hover:text-foreground transition-all"
                            title="Edit Product"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 border border-border rounded-full hover:bg-red-500/10 text-muted hover:text-red-500 hover:border-red-500/20 transition-all"
                            title="Delete Product"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Orders Archive</h3>
              <button 
                onClick={fetchOrders}
                className="p-3 border border-border rounded-full hover:bg-secondary/40 transition-all"
                title="Refresh logs"
              >
                <Loader2 size={14} className={loadingOrders ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Orders List */}
            <div className="bg-secondary/20 border border-border rounded-2xl overflow-hidden">
              {loadingOrders ? (
                <div className="p-16 text-center text-xs uppercase tracking-widest animate-pulse font-bold text-muted">
                  Retrieving activity logs...
                </div>
              ) : orders.length === 0 ? (
                <div className="p-16 text-center text-xs uppercase tracking-widest font-bold text-muted">
                  No orders registered in system.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/40 border-b border-border uppercase font-bold text-foreground/50 tracking-wider">
                      <tr>
                        <th className="p-5">Order ID</th>
                        <th className="p-5">Customer</th>
                        <th className="p-5">Ordered Items</th>
                        <th className="p-5">Subtotal</th>
                        <th className="p-5">Date</th>
                        <th className="p-5">Status</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {orders.map((order) => (
                        <tr 
                          key={order.id} 
                          onClick={() => setSelectedOrder(order)}
                          className="hover:bg-background/40 transition-colors cursor-pointer"
                        >
                          <td className="p-5 font-mono text-[10px] text-muted">{order.id}</td>
                          <td className="p-5">
                            <p className="font-bold text-foreground">{order.customerName}</p>
                            <p className="text-[10px] text-muted mt-0.5">{order.customerEmail}</p>
                          </td>
                          <td className="p-5 space-y-1">
                            {order.items?.map((item, idx) => (
                              <p key={idx} className="font-semibold text-muted/80">
                                {item.name} <span className="text-foreground/50 text-[10px]">({item.variantDetails?.color} / {item.variantDetails?.size})</span> x{item.quantity} - ₹{item.price * item.quantity}
                              </p>
                            ))}
                          </td>
                          <td className="p-5 font-bold text-foreground">₹{order.subtotal}</td>
                          <td className="p-5 text-muted font-medium">
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                          </td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                              order.status === "Completed" ? "bg-green-500/10 text-green-600 border border-green-600/20" :
                              order.status === "Shipped" ? "bg-blue-500/10 text-blue-600 border border-blue-600/20" :
                              order.status === "Processing" ? "bg-yellow-500/10 text-yellow-600 border border-yellow-600/20" :
                              "bg-amber-500/10 text-amber-600 border border-amber-600/20"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-3.5">
                              {order.billingDetails?.phone && (
                                <a
                                  href={getWhatsAppStatusLink(order)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2.5 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/40 rounded-full transition-all flex items-center justify-center shadow-sm"
                                  title="Send WhatsApp status update to customer"
                                >
                                  <WhatsAppIcon size={14} className="fill-emerald-500/10 flex-shrink-0" />
                                </a>
                              )}
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="px-3 py-2 bg-background border border-border rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground focus:outline-none"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "accounts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Registered Accounts</h3>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={accountsSearch}
                  onChange={(e) => setAccountsSearch(e.target.value)}
                  className="px-4 py-2.5 bg-secondary/35 border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent w-64"
                />
                <button 
                  onClick={fetchAccounts}
                  className="p-3 border border-border rounded-full hover:bg-secondary/40 transition-all"
                  title="Refresh accounts"
                >
                  <Loader2 size={14} className={loadingAccounts ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {/* User Accounts List */}
            <div className="bg-secondary/20 border border-border rounded-2xl overflow-hidden">
              {loadingAccounts ? (
                <div className="p-16 text-center text-xs uppercase tracking-widest animate-pulse font-bold text-muted">
                  Retrieving user accounts...
                </div>
              ) : accounts.length === 0 ? (
                <div className="p-16 text-center text-xs uppercase tracking-widest font-bold text-muted">
                  No registered accounts found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/40 border-b border-border uppercase font-bold text-foreground/50 tracking-wider">
                      <tr>
                        <th className="p-5">Name</th>
                        <th className="p-5">Email</th>
                        <th className="p-5">Role</th>
                        <th className="p-5">Created At</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {accounts
                        .filter(acc => {
                          const term = accountsSearch.toLowerCase();
                          return (
                            (acc.displayName || "").toLowerCase().includes(term) ||
                            (acc.email || "").toLowerCase().includes(term)
                          );
                        })
                        .map((account) => (
                          <tr key={account.id} className="hover:bg-background/40 transition-colors">
                            <td className="p-5 font-bold text-foreground">{account.displayName || "N/A"}</td>
                            <td className="p-5 text-muted font-medium">{account.email || "N/A"}</td>
                            <td className="p-5">
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                                  account.role === "admin" 
                                    ? "bg-accent/20 text-accent border border-accent/20" 
                                    : "bg-muted/10 text-muted/60 border border-muted/20"
                                }`}>
                                  {account.role || "user"}
                                </span>
                                {account.isBlocked && (
                                  <span className="px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
                                    Blocked
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-5 text-muted font-medium">
                              {account.createdAt ? new Date(account.createdAt).toLocaleDateString(undefined, {
                                month: "short", day: "numeric", year: "numeric"
                              }) : "N/A"}
                            </td>
                            <td className="p-5 text-right flex justify-end gap-2">
                              <button
                                onClick={() => handleToggleRole(account.id, account.role)}
                                disabled={account.email === user.email} // Prevent self-demotion
                                className={`px-4 py-2 border rounded-full text-[9px] font-extrabold uppercase tracking-widest transition-all ${
                                  account.email === user.email 
                                    ? "opacity-40 cursor-not-allowed border-border text-muted"
                                    : account.role === "admin"
                                    ? "border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/40"
                                    : "border-accent/20 text-accent hover:bg-accent/10 hover:border-accent/40"
                                }`}
                              >
                                {account.role === "admin" ? "Revoke Admin" : "Make Admin"}
                              </button>
                              <button
                                onClick={() => handleToggleBlock(account.id, !!account.isBlocked)}
                                disabled={account.email === user.email} // Prevent self-blocking
                                className={`px-4 py-2 border rounded-full text-[9px] font-extrabold uppercase tracking-widest transition-all ${
                                  account.email === user.email 
                                    ? "opacity-40 cursor-not-allowed border-border text-muted"
                                    : account.isBlocked
                                    ? "border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/40"
                                    : "border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/40"
                                }`}
                              >
                                {account.isBlocked ? "Unblock" : "Block User"}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Details Modal Overlay */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-background border border-border w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-slide-up-toast max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/10">
                <div>
                  <span className="text-accent text-[9px] font-bold uppercase tracking-[0.4em]">Order Details</span>
                  <h3 className="text-base font-black uppercase tracking-tight text-foreground mt-1">
                    ID: #{selectedOrder.id}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 border border-border rounded-full hover:bg-background transition-colors text-muted"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* Status & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-secondary/15 p-4 border border-border rounded-2xl">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted/50 block font-bold">Status</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest mt-1 ${
                      selectedOrder.status === "Completed" ? "bg-green-500/10 text-green-600 border border-green-600/20" :
                      selectedOrder.status === "Shipped" ? "bg-blue-500/10 text-blue-600 border border-blue-600/20" :
                      selectedOrder.status === "Processing" ? "bg-yellow-500/10 text-yellow-600 border border-yellow-600/20" :
                      "bg-amber-500/10 text-amber-600 border border-amber-600/20"
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted/50 block font-bold">Placed On</span>
                    <span className="text-foreground font-bold leading-relaxed">
                      {new Date(selectedOrder.createdAt).toLocaleDateString(undefined, {
                        month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-3">
                  <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-foreground pb-1 border-b border-border/40">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold text-muted">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted/50 block">Full Name</span>
                      <span className="text-foreground">{selectedOrder.customerName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted/50 block">Email Address</span>
                      <span className="text-foreground">{selectedOrder.customerEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.billingDetails && (
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-foreground pb-1 border-b border-border/40">
                      Delivery Address & Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold text-muted">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-muted/50 block">Contact Phone</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-foreground">{selectedOrder.billingDetails.phone}</span>
                          <a
                            href={getWhatsAppStatusLink(selectedOrder)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 rounded-full transition-all flex items-center justify-center"
                            title="Chat on WhatsApp"
                          >
                            <WhatsAppIcon size={11} className="fill-emerald-500/10 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-muted/50 block">Address details</span>
                        <span className="text-foreground leading-relaxed block mt-1">
                          {selectedOrder.billingDetails.addressLine}, <br />
                          {selectedOrder.billingDetails.district}, {selectedOrder.billingDetails.stateName} - {selectedOrder.billingDetails.pin}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ordered Items List */}
                <div className="space-y-3">
                  <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-foreground pb-1 border-b border-border/40">
                    Ordered items
                  </h4>
                  <div className="divide-y divide-border/40">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex gap-4 py-3 first:pt-0">
                        {item.image && (
                          <div className="w-10 h-14 bg-secondary border border-border/40 rounded overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between text-xs">
                          <div>
                            <h5 className="font-bold text-foreground">{item.name}</h5>
                            <p className="text-[9px] text-muted uppercase tracking-wider mt-0.5">
                              {item.variantDetails?.color || item.variant} / {item.variantDetails?.size || "Standard"} (x{item.quantity})
                            </p>
                          </div>
                          <span className="font-bold text-foreground mt-1">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="border-t border-border/80 pt-4 flex justify-between items-center text-sm font-bold text-foreground">
                  <span className="uppercase text-[10px] tracking-widest text-muted">Total Paid</span>
                  <span className="text-lg font-black text-foreground">₹{selectedOrder.subtotal}</span>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border flex justify-end gap-3 bg-secondary/5">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-3 border border-border text-foreground font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-secondary/40 transition-all"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}
