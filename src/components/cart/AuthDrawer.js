"use client";
import React, { useState } from 'react';
import { useShop } from '@/core/shop/ShopContext';
import { X, User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { loginWithEmail, signUpWithEmail, loginWithGoogle } from '@/services/authService';

export default function AuthDrawer() {
  const { isAuthOpen, setIsAuthOpen, showToast } = useShop();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      showToast("Please fill in all required fields", "info");
      return;
    }

    try {
      setLoading(true);
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
        showToast("Account created successfully!", "success");
      } else {
        await loginWithEmail(email, password);
        showToast("Logged in successfully!", "success");
      }
      // Close the Auth Drawer upon success
      setIsAuthOpen(false);
      
      // Clear inputs
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error("Auth error:", err);
      // Clean up firebase error messages for better UX
      const msg = err.message || "";
      if (msg.includes("auth/email-already-in-use")) {
        showToast("This email is already registered.", "error");
      } else if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
        showToast("Invalid email or password.", "error");
      } else if (msg.includes("auth/weak-password")) {
        showToast("Password should be at least 6 characters.", "error");
      } else {
        showToast("Authentication failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      showToast("Logged in with Google!", "success");
      setIsAuthOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Google sign in failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[10001] flex justify-end"
      onClick={() => setIsAuthOpen(false)}
    >
      {/* Blurred overlay backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-md" />
      
      {/* Sliding Drawer Body */}
      <div 
        className="relative w-full max-w-[480px] h-full bg-background border-l border-border flex flex-col shadow-2xl animate-slide-in-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header section */}
        <div className="p-8 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-4">
            <User size={20} className="text-muted" />
            <h3 className="text-xl font-semibold tracking-tight">
              {isSignUp ? "Create Account" : "Sign In"}
            </h3>
          </div>
          <button 
            className="p-2 text-foreground/50 hover:text-foreground transition-colors"
            onClick={() => setIsAuthOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Input fields / forms */}
        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8">
          <div className="space-y-2 text-center max-w-sm mx-auto">
            <span className="text-accent text-[9px] font-bold uppercase tracking-[0.5em]">Bloom Atelier Portal</span>
            <p className="text-muted text-xs leading-relaxed font-semibold">
              {isSignUp 
                ? "Join us to save items in your wishlist, sync your cart, and place orders." 
                : "Welcome back. Access your saved creations and complete your order."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
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
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35" size={14} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 bg-secondary/25 border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35" size={14} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 bg-secondary/25 border border-border rounded-full text-xs font-semibold focus:outline-none focus:border-accent transition-all duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-500 flex items-center justify-center gap-2.5 mt-6 shadow-sm border border-transparent"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : isSignUp ? (
                <>
                  <UserPlus size={14} /> Sign Up
                </>
              ) : (
                <>
                  <LogIn size={14} /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative text-center py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <span className="relative bg-background px-4 text-[8px] font-extrabold uppercase tracking-widest text-muted">Or Connect With</span>
          </div>

          {/* Social Sign-in Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-4.5 bg-background border border-border text-foreground font-bold text-xs uppercase tracking-widest rounded-full hover:bg-secondary/40 transition-all duration-500 flex items-center justify-center gap-2.5 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0c2.158 0 3.978.708 5.302 1.94l-2.22 2.22C10.16 3.284 9.176 3 8 3a5 5 0 1 0 0 10c.846 0 1.626-.208 2.27-.558V9.432H8v-2.88h7.545z" fill="currentColor" stroke="none"/></svg>
            Google OAuth
          </button>

          {/* Footer toggle switcher */}
          <p className="text-center text-[10px] font-semibold text-muted tracking-wide">
            {isSignUp ? "Already have an account?" : "New to Bloom Atelier?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-foreground hover:text-accent font-extrabold uppercase tracking-wider ml-1 border-b border-foreground hover:border-accent"
            >
              {isSignUp ? "Sign In" : "Register"}
            </button>
          </p>
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
      `}</style>
    </div>
  );
}
