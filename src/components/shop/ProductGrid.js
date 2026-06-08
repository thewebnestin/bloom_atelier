"use client";
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { products } from '@/core/constants/ProductData';
import Link from 'next/link';

export const ProductGrid = ({ featuredOnly = false }) => {
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
              {featuredOnly ? "Curated Archive" : "Our Flowers"}
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-16">
          {displayProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={handleQuickView} 
            />
          ))}
        </div>
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
