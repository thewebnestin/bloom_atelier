"use client";
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { useShop } from '@/core/shop/ShopContext';
import Link from 'next/link';

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

export const ProductGrid = ({ featuredOnly = false }) => {
  const { products, loadingProducts } = useShop();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const displayProducts = featuredOnly 
    ? products.filter(product => product.featured) 
    : products;

  return (
    <section id="catalog" className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6 sm:gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-foreground/60 text-[10px] font-bold uppercase tracking-[0.4em]">
              {featuredOnly ? "Featured Flowers" : "Our Flowers"}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter uppercase leading-none">
              {featuredOnly ? "Featured" : "Shop"} <br /> Collection
            </h2>
          </div>
          <div className="flex w-full sm:w-auto">
            {featuredOnly ? (
              <Link 
                href="/shop"
                className="text-[10px] font-bold uppercase tracking-widest px-8 py-4 border border-border rounded-full hover:bg-foreground hover:text-background transition-all duration-500 w-full sm:w-auto text-center"
              >
                Shop All Products
              </Link>
            ) : (
              <button className="text-[10px] font-bold uppercase tracking-widest px-8 py-4 border border-border rounded-full hover:bg-foreground hover:text-background transition-all duration-500 w-full sm:w-auto text-center">
                Filter By Series
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-16">
            {[...Array(featuredOnly ? 4 : 8)].map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="py-24 text-center text-xs uppercase tracking-[0.3em] font-extrabold text-muted">
            No items in the collection.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-16">
            {displayProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={handleQuickView} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </section>
  );
};
