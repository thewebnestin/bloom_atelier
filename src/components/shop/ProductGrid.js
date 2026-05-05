"use client";
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { products } from '@/core/constants/ProductData';

export const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section id="catalog" className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.4em]">Current Release</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter uppercase leading-none">
              Artifact <br /> Collection
            </h2>
          </div>
          <div className="flex gap-4">
            <button className="text-[10px] font-bold uppercase tracking-widest px-8 py-4 border border-border rounded-full hover:bg-foreground hover:text-background transition-all duration-500">
              Filter By Series
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
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
