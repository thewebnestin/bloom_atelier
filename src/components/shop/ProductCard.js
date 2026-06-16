"use client";
import React from "react";
import { Heart, ShoppingBag, ArrowUpRight, Check } from "lucide-react";
import { useShop } from "@/core/shop/ShopContext";
import Link from "next/link";

export default function ProductCard({ product, onQuickView }) {
  const { toggleWishlist, wishlist, addToCart, setIsCartOpen, cart } = useShop();
  
  // Default to first variant color
  const [selectedColor, setSelectedColor] = React.useState(product.variants?.colors?.[0] || null);
  
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const isInCart = cart.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInCart) {
      setIsCartOpen(true);
      return;
    }

    // Default to selected color variant if available
    const variant = {
      color: selectedColor?.name || product.variants?.colors?.[0]?.name || "Standard",
      size: product.variants?.sizes?.[0] || "OS",
    };
    addToCart(product, variant);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const activeImage = selectedColor?.image || product.image;

  return (
    <div className="group relative flex flex-col bg-background h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary rounded-lg transition-all duration-700">
        <img
          src={activeImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-[1.5s] ease-butter group-hover:scale-110"
        />

        {/* Full-size link overlay */}
        <Link
          href={`/product/${product.id}${selectedColor ? `?color=${encodeURIComponent(selectedColor.name)}` : ''}`}
          className="absolute inset-0 z-10"
        />

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none">
          <div className="flex justify-end pointer-events-auto">
            <button
              onClick={handleWishlist}
              className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${isWishlisted ? "bg-accent text-white border border-accent" : "bg-background/80 text-foreground border border-border/40 hover:bg-accent hover:text-white hover:border-accent"}`}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="flex gap-2 justify-end lg:justify-start pointer-events-auto">
            <button
              onClick={handleAddToCart}
              className="p-3 bg-white text-black rounded-full flex items-center justify-center lg:hover:bg-accent lg:hover:text-white transition-all duration-500 transform translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 lg:flex-1 lg:py-3 lg:px-4 text-[9px] font-bold uppercase tracking-widest gap-2 focus:outline-none focus:ring-0 select-none"
            >
              {isInCart ? (
                <Check className="w-4 h-4 lg:w-3 lg:h-3 text-accent" />
              ) : (
                <ShoppingBag className="w-4 h-4 lg:w-3 lg:h-3" />
              )}
              <span className="hidden lg:inline">{isInCart ? "View Cart" : "Add to Collection"}</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all duration-500 transform translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 lg:delay-75 hidden lg:flex"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 pointer-events-none transition-opacity group-hover:opacity-0 z-30 hidden lg:block">
          <span className="px-3 py-1 bg-background/80 backdrop-blur-sm border border-border rounded-full text-[8px] font-extrabold uppercase tracking-widest text-foreground">
            {product.category}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-6 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-4">
            <Link 
              href={`/product/${product.id}${selectedColor ? `?color=${encodeURIComponent(selectedColor.name)}` : ''}`} 
              className="block group/title"
            >
              <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover/title:text-accent">
                {product.name}
              </h3>
            </Link>
            <span className="text-sm font-medium text-muted shrink-0 font-semibold">
              ₹{product.price}
            </span>
          </div>
          <p className="text-[10px] text-muted leading-relaxed line-clamp-2 opacity-60">
            {product.description ||
              "Artisanally crafted floral arrangement with permanent studio preservation."}
          </p>
        </div>

        {/* Interactive Color Swatches */}
        {product.variants?.colors && product.variants.colors.length > 1 && (
          <div className="flex gap-2 pt-2 relative z-20">
            {product.variants.colors.map((color, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                onMouseEnter={() => setSelectedColor(color)}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                  selectedColor?.name === color.name
                    ? 'scale-110 border-foreground ring-1 ring-foreground/20'
                    : 'border-transparent opacity-65 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
