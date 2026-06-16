"use client";
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/shop/ProductCard';
import ProductModal from '@/components/shop/ProductModal';
import CartDrawer from '@/components/cart/CartDrawer';
import WishlistDrawer from '@/components/cart/WishlistDrawer';
import { useShop } from '@/core/shop/ShopContext';
import { Search, X, Inbox, SlidersHorizontal } from 'lucide-react';

const ProductCardSkeleton = () => (
  <div className="flex flex-col h-full animate-pulse">
    {/* Image Container */}
    <div className="aspect-[4/5] bg-secondary/80 rounded-lg" />
    {/* Info Section */}
    <div className="pt-6 space-y-3">
      <div className="flex justify-between items-start gap-4">
        <div className="h-4 bg-secondary/80 rounded-full w-2/3" />
        <div className="h-4 bg-secondary/80 rounded-full w-12" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-secondary/80 rounded-full w-full" />
        <div className="h-3 bg-secondary/80 rounded-full w-5/6" />
      </div>
    </div>
  </div>
);

export default function ShopPage() {
  const { products, loadingProducts } = useShop();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(3000);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const categories = [...new Set(products.map(p => p.category))];

  // Filter products based on search, category selection, and price limit
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setMaxPrice(3000);
  };

  return (
    <main className="relative bg-background min-h-screen">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-28 pb-12 sm:pt-40 sm:pb-20 bg-background border-b border-border">
        <div className="container mx-auto px-6 md:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-foreground/60 text-[10px] font-bold uppercase tracking-[0.6em]">Our Shop</span>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter uppercase leading-[0.85]">
              The <br />
              <span className="opacity-30">Shop.</span>
            </h1>
            <p className="text-muted text-base sm:text-lg leading-relaxed max-w-xl pt-4 font-medium">
              Browse all our handmade flowers, sorted by style and collection.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 md:px-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-border/60 pb-8 mb-8">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
              <input 
                type="text"
                placeholder="Search flowers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-secondary/35 border border-border/80 rounded-full text-xs font-semibold uppercase tracking-widest placeholder:text-foreground/30 focus:outline-none focus:border-accent transition-all duration-300"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Toggle Filters Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-3 px-6 py-3 border rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 w-full sm:w-auto ${
                showFilters || selectedCategories.length > 0 || maxPrice < 3000
                  ? 'bg-foreground text-background border-foreground' 
                  : 'bg-secondary/35 border-border/80 hover:bg-secondary text-foreground'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {(selectedCategories.length > 0 || maxPrice < 3000) && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </button>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-secondary/20 border border-border/60 rounded-2xl mb-12">
              {/* Category Filter */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border/60 pb-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-foreground/40">
                    Categories
                  </h4>
                  {selectedCategories.length > 0 && (
                    <button 
                      onClick={() => setSelectedCategories([])}
                      className="text-[9px] font-bold uppercase text-accent hover:underline"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedCategories(selectedCategories.filter(c => c !== cat));
                          } else {
                            setSelectedCategories([...selectedCategories, cat]);
                          }
                        }}
                        className={`px-4 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${
                          isSelected
                            ? 'bg-foreground text-background border border-foreground'
                            : 'bg-secondary/40 text-foreground/60 border-transparent hover:bg-secondary/70 hover:text-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border/60 pb-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-foreground/40">
                    Price Limit
                  </h4>
                  {maxPrice < 3000 && (
                    <button 
                      onClick={() => setMaxPrice(3000)}
                      className="text-[9px] font-bold uppercase text-accent hover:underline"
                    >
                      Reset Price
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <input 
                    type="range" 
                    min={0} 
                    max={3000} 
                    step={50}
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-accent bg-secondary h-1 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-foreground/60 uppercase">
                    <span>₹0</span>
                    <span className="px-3 py-1.5 bg-foreground/5 rounded border border-border">Max: ₹{maxPrice}</span>
                    <span>₹3000</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Rendering of Products */}
          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-16">
              {[...Array(8)].map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-secondary/40 border border-border flex items-center justify-center text-foreground/40">
                <Inbox size={24} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight">No Flowers Found</h3>
                <p className="text-muted text-sm leading-relaxed">
                  We could not find any flowers matching your active filter settings. Try clearing your filters.
                </p>
              </div>
              <button 
                onClick={clearFilters}
                className="px-8 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest rounded-none hover:bg-accent transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Unified Filtered Grid View */
            <div className="space-y-8">
              <div className="flex flex-col border-b border-border/60 pb-4">
                <span className="text-accent text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.5em] mb-1">
                  Collection
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
                  All Flowers 
                  {(selectedCategories.length > 0 || maxPrice < 3000 || searchQuery) && (
                    <span className="text-foreground/40 font-normal">
                      {" "}·{" "}
                      {[
                        searchQuery && `"${searchQuery}"`,
                        selectedCategories.length > 0 && `${selectedCategories.length} Categories`,
                        maxPrice < 3000 && `Under ₹${maxPrice}`
                      ].filter(Boolean).join(" & ")}
                    </span>
                  )}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-16">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onQuickView={handleQuickView} 
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
      
      <CartDrawer />
      <WishlistDrawer />
    </main>
  );
}
