"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useShop } from "@/core/shop/ShopContext";
import { loginWithEmail, signUpWithEmail, loginWithGoogle, logout } from "@/services/authService";
import { db } from "@/core/firebase/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { 
  Plus, Edit2, Trash2, LayoutDashboard, ShoppingCart, 
  Package, LogOut, Loader2, ArrowUpRight, Check, X, ShieldAlert 
} from "lucide-react";

export default function AdminPage() {
  const { user, isAdmin, products, setProducts, showToast } = useShop();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Authentication Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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

  // Fetch orders when tab changes or admin status resolved
  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

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

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      setIsLoggingIn(true);
      await loginWithEmail(email, password);
      showToast("Accessing Admin Portal...", "success");
    } catch (err) {
      console.error("Login failed:", err);
      // Self-healing demo account: if credentials do not exist, auto-create a demo administrator
      if (email === "admin@bloomatelier.com" && password === "admin123") {
        try {
          showToast("Registering demo admin credentials...", "info");
          await signUpWithEmail(email, password, "Atelier Administrator");
          showToast("Logged in as Demo Admin!", "success");
        } catch (signupErr) {
          showToast("Authentication failed", "error");
        }
      } else {
        showToast("Invalid credentials", "error");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Google Login handler
  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
      showToast("Accessing Admin Portal...", "success");
    } catch (err) {
      showToast("Google authentication failed", "error");
    } finally {
      setIsLoggingIn(false);
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

  // Change order status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order status updated to ${newStatus}`, "success");
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
      <main className="bg-background min-h-screen selection:bg-accent/30 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6 py-28">
          <div className="w-full max-w-md bg-secondary/35 border border-border p-8 rounded-2xl shadow-sm text-center space-y-8">
            <div className="space-y-3">
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em]">Studio Dashboard</span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">
                Admin Portal
              </h2>
              <p className="text-muted text-xs font-medium max-w-xs mx-auto">
                Sign in with your administrator account to access product management and orders tracking.
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
              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@bloomatelier.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-4 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoggingIn ? <Loader2 size={14} className="animate-spin" /> : "Sign In"}
                </button>

                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                  <span className="relative bg-background px-4 text-[8px] font-extrabold uppercase tracking-widest text-muted">Or</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="w-full py-4 bg-background border border-border text-foreground font-bold text-xs uppercase tracking-widest rounded-full hover:bg-secondary/40 transition-all duration-500 flex items-center justify-center gap-2"
                >
                  Sign In with Google
                </button>
                
                <p className="text-center text-[9px] text-muted/40 font-extrabold uppercase tracking-widest pt-4">
                  Demo login: admin@bloomatelier.com / admin123
                </p>
              </form>
            ) : (
              <button
                onClick={handleSignOut}
                className="w-full py-4 bg-background border border-border text-foreground font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-all duration-500 flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> Log Out
              </button>
            )}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // 2. Main Admin Dashboard View
  return (
    <main className="bg-background min-h-screen selection:bg-accent/30 flex flex-col justify-between">
      <Navbar />
      
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
            <Package size={14} /> Catalog
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
        </div>

        {/* Tab Content Display */}
        {activeTab === "dashboard" && (
          <div className="space-y-10">
            {/* Analytics Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-secondary/20 border border-border p-8 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Total Revenue (Settled)</span>
                <h3 className="text-4xl font-extrabold tracking-tighter text-foreground">₹{totalSales}</h3>
              </div>
              <div className="bg-secondary/20 border border-border p-8 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Total Orders Placed</span>
                <h3 className="text-4xl font-extrabold tracking-tighter text-foreground">{orders.length}</h3>
              </div>
              <div className="bg-secondary/20 border border-border p-8 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Catalog Products count</span>
                <h3 className="text-4xl font-extrabold tracking-tighter text-foreground">{products.length}</h3>
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
                    <input
                      type="text"
                      required
                      placeholder="/bloom_collection_1_1777980300798.png"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-5 py-3 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Additional Details Images (Comma-separated URLs)</label>
                    <input
                      type="text"
                      placeholder="/image1.png, /image2.png"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      className="w-full px-5 py-3 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent"
                    />
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

                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Colors Input (Format: Name:HexCode, Comma-separated)</label>
                    <input
                      type="text"
                      value={formData.colorsInput}
                      onChange={(e) => setFormData({ ...formData, colorsInput: e.target.value })}
                      className="w-full px-5 py-3 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent"
                    />
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
                        <tr key={order.id} className="hover:bg-background/40 transition-colors">
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
                          <td className="p-5 text-right">
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

      </div>
      <Footer />
    </main>
  );
}
