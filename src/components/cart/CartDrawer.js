"use client";
import React from 'react';
import { useShop } from '@/core/shop/ShopContext';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, createOrder, user, setIsAuthOpen, showToast } = useShop();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    // Force Authentication: Guests cannot place orders
    if (!user) {
      setIsCartOpen(false); // Close Cart drawer
      setIsAuthOpen(true); // Open Auth drawer
      showToast("Please sign in or create an account to place your order.", "info");
      return;
    }

    try {
      const customerName = user.displayName || "Customer";
      const customerEmail = user.email || "";
      
      // Build message string BEFORE clearing the cart inside createOrder
      const message = `Hello Bloom Atelier,\n\nI would like to place an order for the following flowers:\n\n` +
        cart.map(item => `- ${item.name} (${item.variantDetails.color} / ${item.variantDetails.size}) x${item.quantity} - ₹${item.price * item.quantity}`).join('\n') +
        `\n\nSubtotal: ₹${subtotal}\n\nThank you!`;
      const encodedMessage = encodeURIComponent(message);

      // Record in Firestore (this will also empty the local cart state)
      await createOrder(customerName, customerEmail, subtotal);
      
      // Close the cart drawer
      setIsCartOpen(false);

      // Open WhatsApp in a new tab
      window.open(`https://wa.me/918714793136?text=${encodedMessage}`, '_blank');
    } catch (err) {
      console.error("Failed to create order on checkout:", err);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10001] flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-md" />
      
      <div 
        className="relative w-full max-w-[480px] h-full bg-background border-l border-border flex flex-col shadow-2xl animate-slide-in-right"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 flex justify-between items-center border-bottom border-border">
          <div className="flex items-center gap-4">
            <ShoppingBag size={20} className="text-muted" />
            <h3 className="text-xl font-semibold tracking-tight">Your Cart</h3>
          </div>
          <button 
            className="p-2 text-foreground/50 hover:text-foreground transition-colors"
            onClick={() => setIsCartOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <p className="text-muted font-medium">Your cart is empty.</p>
              <Link 
                href="/shop"
                className="px-10 py-3 rounded-full border border-border text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-500"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Exploring
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {cart.map(item => (
                <div key={item.id + item.variant} className="flex gap-6 group">
                  <div className="w-24 h-32 rounded-none overflow-hidden bg-secondary border border-border flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-foreground tracking-tight">{item.name}</h4>
                        <span className="text-sm font-medium text-muted">₹{item.price}</span>
                      </div>
                      <p className="text-[11px] uppercase tracking-wider text-muted/60">{item.variantDetails.color} / {item.variantDetails.size}</p>
                    </div>
                    <button 
                      className="text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors text-left"
                      onClick={() => removeFromCart(item.id + item.variant)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 space-y-6 bg-secondary/50 border-t border-border">
            <div className="flex justify-between items-center text-xl font-semibold tracking-tighter">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed font-semibold">Free Shipping India • No COD</p>
            <button 
              onClick={handleCheckout}
              className="w-full py-5 rounded-none bg-foreground text-background font-bold text-sm tracking-widest uppercase transition-all duration-500 hover:opacity-90 flex items-center justify-center gap-3"
            >
              Order via WhatsApp <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
