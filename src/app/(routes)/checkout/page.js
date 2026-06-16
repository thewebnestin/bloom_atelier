"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useShop } from '@/core/shop/ShopContext';
import { db } from '@/core/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  ShoppingBag, ShieldCheck, CheckCircle2, 
  MessageCircle, Loader2, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export default function CheckoutPage() {
  const { 
    cart, user, userProfile, setUserProfile, 
    createOrder, setIsAuthOpen, showToast 
  } = useShop();

  // Address/Billing Details Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('');
  const [pin, setPin] = useState('');

  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  // Autofill fields with loaded profile data
  useEffect(() => {
    requestAnimationFrame(() => {
      if (user) {
        setFullName(user.displayName || '');
      }
      if (userProfile) {
        setPhone(userProfile.phone || '');
        setAddressLine(userProfile.addressLine || '');
        setDistrict(userProfile.district || '');
        setStateName(userProfile.stateName || '');
        setPin(userProfile.zip || '');
      }
    });
  }, [user, userProfile]);

  // Scroll to top when order is confirmed and success screen is shown
  useEffect(() => {
    if (orderId) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [orderId]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Your cart is empty.", "info");
      return;
    }

    if (!fullName || !phone || !addressLine || !district || !stateName || !pin) {
      showToast("Please fill in all address details.", "info");
      return;
    }

    try {
      setLoading(true);

      const billingDetails = {
        fullName,
        phone,
        addressLine,
        district,
        stateName,
        pin
      };

      // Save order details copy to display on Success screen BEFORE clearing context cart
      const currentCartItems = [...cart];
      const orderSubtotal = subtotal;

      // 1. Record Order in Firestore (clears context cart state inside ShopContext)
      const newOrderId = await createOrder(fullName, user.email, orderSubtotal, billingDetails);

      // 2. Persist/update these shipping preferences as defaults in users/{uid}
      await setDoc(doc(db, "users", user.uid), {
        displayName: fullName,
        phone,
        addressLine,
        district,
        stateName,
        zip: pin
      }, { merge: true });

      // Update userProfile state so navigation drawers update instantly
      setUserProfile(prev => ({
        ...prev,
        displayName: fullName,
        phone,
        addressLine,
        district,
        stateName,
        zip: pin
      }));

      // 3. Build WhatsApp prefilled message string
      const orderSummaryMessage = `Hello Bloom Atelier,\n\nI would like to place an order (ID: #${newOrderId}):\n\n` +
        currentCartItems.map(item => `- ${item.name} (${item.variantDetails.color} / ${item.variantDetails.size}) x${item.quantity} - ₹${item.price * item.quantity}`).join('\n') +
        `\n\nSubtotal: ₹${orderSubtotal}\n\nDelivery Details:\n` +
        `Name: ${fullName}\n` +
        `Phone: ${phone}\n` +
        `Address: ${addressLine}\n` +
        `District: ${district}\n` +
        `State: ${stateName}\n` +
        `Pin Code: ${pin}\n\n` +
        `Please confirm payment instructions. Thank you!`;

      const encodedMsg = encodeURIComponent(orderSummaryMessage);
      const whatsappUrl = `https://wa.me/918714793136?text=${encodedMsg}`;

      // Store local success view parameters
      setPlacedOrderDetails({
        id: newOrderId,
        items: currentCartItems,
        subtotal: orderSubtotal,
        address: billingDetails,
        whatsappUrl: whatsappUrl
      });
      setOrderId(newOrderId);
      showToast("Order recorded successfully!", "success");

    } catch (err) {
      console.error("Error submitting order:", err);
      showToast("Order registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 1. Guard Screen: User unauthenticated
  if (!user) {
    return (
      <main className="bg-background min-h-screen selection:bg-accent/30 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6 py-28">
          <div className="w-full max-w-md bg-secondary/35 border border-border p-8 rounded-2xl shadow-sm text-center space-y-6">
            <div className="space-y-2">
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.5em]">Secure Checkout</span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                Authentication Required
              </h2>
              <p className="text-muted text-xs leading-relaxed font-semibold">
                Please sign in or create an account to fill in shipping details and complete your flower order.
              </p>
            </div>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="w-full py-4.5 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 shadow-sm"
            >
              Sign In / Register
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // 2. Success Screen: Order placed successfully
  if (orderId && placedOrderDetails) {
    return (
      <main className="bg-background min-h-screen selection:bg-accent/30 flex flex-col justify-between animate-fade-in">
        <Navbar />
        <div className="flex-1 container mx-auto px-6 md:px-8 pt-28 pb-16 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-secondary/25 border border-border p-8 md:p-12 rounded-3xl space-y-8 shadow-sm text-center">
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 size={56} className="text-accent" />
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Bloom Atelier Order Placed</span>
              <h1 className="text-3xl font-black uppercase tracking-tight text-foreground mt-2">
                Thank You for Your Order!
              </h1>
              <p className="text-muted text-xs font-semibold max-w-md leading-relaxed">
                Your order has been recorded. We have generated your WhatsApp purchase details. Click below to continue our chat and settle payment.
              </p>
              <p className="text-[10px] font-mono text-muted/80 bg-background px-4 py-1.5 border border-border rounded-full mt-2 font-bold">
                Order ID: #{orderId}
              </p>
            </div>

            {/* Billing Address Summary on Success */}
            <div className="bg-background border border-border/80 p-6 rounded-2xl text-left text-xs space-y-4">
              <h3 className="text-[9px] font-extrabold uppercase tracking-widest text-foreground">Delivery Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold text-muted">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-muted/50 block">Customer Name</span>
                  <span className="text-foreground">{placedOrderDetails.address.fullName}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-muted/50 block">Contact Phone</span>
                  <span className="text-foreground">{placedOrderDetails.address.phone}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[9px] uppercase tracking-wider text-muted/50 block">Address details</span>
                  <span className="text-foreground">{placedOrderDetails.address.addressLine}, {placedOrderDetails.address.district}, {placedOrderDetails.address.stateName} - {placedOrderDetails.address.pin}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => window.open(placedOrderDetails.whatsappUrl, '_blank')}
                className="px-8 py-4.5 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center gap-2.5 shadow-sm"
              >
                <WhatsAppIcon size={14} className="flex-shrink-0" /> Notify on WhatsApp
              </button>
              <Link
                href="/shop"
                className="px-8 py-4.5 border border-border bg-background hover:bg-secondary/40 text-foreground font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 flex items-center justify-center"
              >
                Return to Shop
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // 3. Form Screen: Input shipping address
  return (
    <main className="bg-background min-h-screen selection:bg-accent/30 flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 container mx-auto px-6 md:px-8 pt-28 pb-16">
        
        {/* Checkout Header */}
        <div className="flex items-center gap-4 border-b border-border/60 pb-6 mb-10">
          <Link 
            href="/shop"
            className="p-2 border border-border rounded-full hover:bg-secondary/40 transition-colors text-muted hover:text-foreground"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="space-y-1">
            <span className="text-accent text-[9px] font-bold uppercase tracking-[0.4em]">Atelier Checkout</span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
              Billing & Delivery
            </h1>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center space-y-6">
            <p className="text-muted text-sm font-semibold">Your cart is empty. Please add some creations from the shop first.</p>
            <Link 
              href="/shop" 
              className="inline-block px-8 py-4 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Go to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Form Inputs (Left) */}
            <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8 bg-secondary/15 border border-border/80 p-8 rounded-3xl">
              <div className="space-y-1">
                <span className="text-accent text-[9px] font-bold uppercase tracking-[0.4em]">Customer Information</span>
                <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">Shipping Details</h3>
              </div>

              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mohammed Rinshad"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 87147 93136"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-5 py-3.5 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Delivery Address *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Apartment, building, street address"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full px-5 py-3.5 bg-background border border-border rounded-2xl text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">District *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ernakulam"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-5 py-3.5 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="Kerala"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full px-5 py-3.5 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">PIN Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="682001"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full px-5 py-3.5 bg-background border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <ShieldCheck size={16} className="text-accent mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-muted leading-normal font-semibold">
                  By clicking submit, your delivery details will be recorded and saved as your default preferences, and a WhatsApp purchase invoice will be prepared.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center gap-2.5 shadow-sm border border-transparent"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    Place Order & Continue
                  </>
                )}
              </button>
            </form>

            {/* Order Summary (Right) */}
            <div className="lg:col-span-5 border border-border bg-secondary/10 p-8 rounded-3xl space-y-6">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-foreground pb-2 border-b border-border/60">
                Order Summary
              </h3>

              {/* Items Summary list */}
              <div className="divide-y divide-border/40 max-h-80 overflow-y-auto pr-2">
                {cart.map((item) => {
                  const itemColor = item.variantDetails?.color;
                  const colorObj = item.variants?.colors?.find(c => c.name === itemColor);
                  const displayImage = colorObj?.image || item.image;
                  return (
                    <div key={item.id + item.variant} className="flex gap-4 py-4 first:pt-0">
                      <div className="w-12 h-16 bg-secondary border border-border/40 overflow-hidden flex-shrink-0">
                        <img src={displayImage} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between text-xs">
                        <div>
                          <h4 className="font-bold text-foreground leading-tight">{item.name}</h4>
                          <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wider">
                            {itemColor} / {item.variantDetails.size} (x{item.quantity})
                          </p>
                        </div>
                        <span className="font-bold text-foreground mt-1">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price calculations */}
              <div className="border-t border-border/60 pt-4 space-y-3 font-semibold text-xs text-muted">
                <div className="flex justify-between">
                  <span>Cart Items</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-accent">FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-foreground pt-2 border-t border-border/40">
                  <span>Total Due</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
