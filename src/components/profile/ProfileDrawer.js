"use client";
import React, { useState, useEffect } from 'react';
import { useShop } from '@/core/shop/ShopContext';
import { X, User, ShoppingBag, MapPin, LogOut, Loader2, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { db, auth } from '@/core/firebase/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { logout } from '@/services/authService';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export default function ProfileDrawer() {
  const { 
    isProfileOpen, 
    setIsProfileOpen, 
    user, 
    userProfile, 
    setUserProfile, 
    showToast 
  } = useShop();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'address'
  
  // Tab 1: Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Tab 2: Profile settings state
  const [name, setName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Tab 3: Address settings state
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zip, setZip] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  const fetchUserOrders = async () => {
    try {
      setLoadingOrders(true);
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const ordersList = [];
      querySnapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });

      // Sort by date descending
      ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ordersList);
    } catch (err) {
      console.error("Error fetching user orders:", err);
      showToast("Error loading order history.", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Synchronize inputs with current user profile/user data
  useEffect(() => {
    requestAnimationFrame(() => {
      if (user) {
        setName(user.displayName || '');
      }
      if (userProfile) {
        setPhone(userProfile.phone || '');
        setAddressLine(userProfile.addressLine || '');
        setCity(userProfile.city || '');
        setStateName(userProfile.stateName || '');
        setZip(userProfile.zip || '');
      }
    });
  }, [user, userProfile]);

  // Fetch orders when orders tab becomes active or drawer opens
  useEffect(() => {
    if (isProfileOpen && user && activeTab === 'orders') {
      requestAnimationFrame(() => {
        fetchUserOrders();
      });
    }
  }, [isProfileOpen, user, activeTab]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Name cannot be empty.", "info");
      return;
    }

    try {
      setSavingProfile(true);
      await updateProfile(auth.currentUser, { displayName: name });
      
      // Update local storage so that other pages detect it
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        userData.displayName = name;
        localStorage.setItem("user", JSON.stringify(userData));
      }
      
      // Save display name to Firestore user document too
      await setDoc(doc(db, "users", user.uid), { displayName: name }, { merge: true });
      
      // Sync local state
      setUserProfile(prev => ({ ...prev, displayName: name }));
      
      // Force trigger local auth state update by modifying client reference
      // (Next.js components listening to auth state will refresh display)
      showToast("Profile name updated!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile name.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      setSavingAddress(true);
      const addressData = {
        phone,
        addressLine,
        city,
        stateName,
        zip
      };
      
      await setDoc(doc(db, "users", user.uid), addressData, { merge: true });
      setUserProfile(prev => ({ ...prev, ...addressData }));
      showToast("Delivery settings saved!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save shipping address.", "error");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      showToast("Logged out successfully.", "info");
    } catch (err) {
      showToast("Logout failed.", "error");
    }
  };

  const getInitials = () => {
    if (!user) return "";
    if (user.displayName) {
      const parts = user.displayName.trim().split(/\s+/);
      if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (user.email) {
      const prefix = user.email.split('@')[0];
      return prefix.slice(0, 2).toUpperCase();
    }
    return "US";
  };

  if (!isProfileOpen || !user) return null;

  return (
    <div 
      className="fixed inset-0 z-[10001] flex justify-end"
      onClick={() => setIsProfileOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-md" />
      
      {/* Drawer Container */}
      <div 
        className="relative w-full max-w-[540px] h-full bg-background border-l border-border flex flex-col shadow-2xl animate-slide-in-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header section with user initials avatar */}
        <div className="p-8 border-b border-border flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-border bg-accent text-accent-foreground text-sm font-black uppercase tracking-wider flex items-center justify-center shadow-inner">
                {getInitials()}
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground leading-tight">
                  {user.displayName || "Studio Guest"}
                </h3>
                <p className="text-[10px] text-muted font-bold tracking-wide mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>
            
            <button 
              className="p-2 text-foreground/50 hover:text-foreground transition-colors border border-border/40 hover:border-border rounded-full"
              onClick={() => setIsProfileOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          {/* Luxury horizontal tab headers */}
          <div className="flex border-b border-border/40 gap-6 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 pb-3 text-[10px] font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300 ${
                activeTab === 'orders'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground/45 hover:text-foreground'
              }`}
            >
              <ShoppingBag size={12} /> Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 pb-3 text-[10px] font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground/45 hover:text-foreground'
              }`}
            >
              <User size={12} /> Profile Info
            </button>
            <button
              onClick={() => setActiveTab('address')}
              className={`flex items-center gap-2 pb-3 text-[10px] font-extrabold uppercase tracking-widest border-b-2 transition-all duration-300 ${
                activeTab === 'address'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground/45 hover:text-foreground'
              }`}
            >
              <MapPin size={12} /> Delivery Settings
            </button>
          </div>
        </div>

        {/* Tab contents (Scrollable container) */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <span className="text-accent text-[9px] font-bold uppercase tracking-[0.4em] block mb-2">Order Activity Logs</span>
              
              {loadingOrders ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted">
                  <Loader2 size={24} className="animate-spin text-accent" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Retrieving purchases...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 border border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">No orders found.</p>
                  <p className="text-[10px] font-semibold text-muted/65 max-w-xs">Items you order from Bloom Atelier catalog will appear here once settled.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      className="border border-border/80 bg-secondary/15 hover:bg-secondary/25 p-5 rounded-2xl transition-all space-y-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mono text-[9px] text-muted font-bold">ID: #{order.id}</p>
                          <p className="text-[10px] font-semibold text-muted/65 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-widest ${
                          order.status === "Completed" ? "bg-green-500/10 text-green-600 border border-green-600/20" :
                          order.status === "Shipped" ? "bg-blue-500/10 text-blue-600 border border-blue-600/20" :
                          order.status === "Processing" ? "bg-yellow-500/10 text-yellow-600 border border-yellow-600/20" :
                          "bg-amber-500/10 text-amber-600 border border-amber-600/20"
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 border-t border-b border-border/40 py-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs font-semibold text-foreground/80">
                            <span>
                              {item.name} <span className="text-[10px] text-muted">({item.variantDetails?.color} / {item.variantDetails?.size})</span> x{item.quantity}
                            </span>
                            <span className="text-foreground">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Totals & Actions */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[9px] uppercase text-muted font-extrabold tracking-wider">Subtotal:</span>
                          <span className="text-sm font-black text-foreground">₹{order.subtotal}</span>
                        </div>

                        {/* WhatsApp support chat for order */}
                        <a
                          href={`https://wa.me/918714793136?text=Hi%20Bloom%20Atelier,%20I%20have%20an%20inquiry%20regarding%20my%20recent%20order%20%23${order.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-background border border-border hover:bg-secondary/40 text-[9px] font-extrabold uppercase tracking-widest rounded-full transition-all text-foreground"
                        >
                          <WhatsAppIcon size={11} className="text-emerald-500 fill-emerald-500/10 flex-shrink-0" />
                          Chat Support
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <span className="text-accent text-[9px] font-bold uppercase tracking-[0.4em] block mb-2">Personal Credentials</span>
              
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Email Address (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-5 py-3.5 bg-secondary/15 border border-border/60 rounded-full text-xs font-semibold text-muted/75 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35" size={14} />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-5 py-3.5 bg-secondary/25 border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-4.5 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center gap-2 mt-4 shadow-sm border border-transparent"
              >
                {savingProfile ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Check size={14} /> Save Profile Name
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === 'address' && (
            <form onSubmit={handleSaveAddress} className="space-y-5">
              <span className="text-accent text-[9px] font-bold uppercase tracking-[0.4em] block mb-2">Shipping Preferences</span>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-3.5 bg-secondary/25 border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Street Address</label>
                <textarea
                  rows={2}
                  placeholder="Apartment, building, street address"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-5 py-3.5 bg-secondary/25 border border-border rounded-2xl text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">City</label>
                  <input
                    type="text"
                    placeholder="Kochi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-5 py-3.5 bg-secondary/25 border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">State</label>
                  <input
                    type="text"
                    placeholder="Kerala"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-secondary/25 border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">ZIP / Postal Code</label>
                <input
                  type="text"
                  placeholder="682001"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full px-5 py-3.5 bg-secondary/25 border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={savingAddress}
                className="w-full py-4.5 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center gap-2 mt-4 shadow-sm border border-transparent"
              >
                {savingAddress ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Check size={14} /> Save Address Settings
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer with log out action */}
        <div className="p-8 border-t border-border bg-secondary/10">
          <button
            onClick={handleSignOut}
            className="w-full py-4.5 border border-border bg-background text-foreground font-bold text-xs uppercase tracking-widest rounded-full hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all duration-500 flex items-center justify-center gap-2 shadow-sm"
          >
            <LogOut size={14} /> Sign Out of Account
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
