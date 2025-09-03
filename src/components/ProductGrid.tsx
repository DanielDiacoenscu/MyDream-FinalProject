// src/components/ProductGrid.tsx
import React from 'react';
import ProductCard from './ProductCard';

// This is placeholder data. Later, this will come from your Strapi API.
const placeholderProducts = [
  { imageUrl: 'https://victoriabeckhambeauty.com/cdn/shop/files/VVB_Contour-Stylus_Product-Grid_Travertine_1080x1350_1.jpg?v=1719345929&width=800', category: 'Make Up', name: 'Contour Stylus', price: '$40.00' },
  { imageUrl: 'https://victoriabeckhambeauty.com/cdn/shop/files/VVB_Satin-Kajal-Liner_Product-Grid_Black_1080x1350_1.jpg?v=1719345878&width=800', category: 'Make Up', name: 'Satin Kajal Liner', price: '$32.00' },
  { imageUrl: 'https://victoriabeckhambeauty.com/cdn/shop/files/VVB_Posh-Gloss_Product-Grid_Bikini_1080x1350_1.jpg?v=1719345837&width=800', category: 'Make Up', name: 'Posh Gloss', price: '$30.00' },
  { imageUrl: 'https://victoriabeckhambeauty.com/cdn/shop/files/VVB_Baby-Blade_Product-Grid_1080x1350_1.jpg?v=1719345783&width=800', category: 'Make Up', name: 'Babyblade Brow Pencil', price: '$36.00' },
  { imageUrl: 'https://victoriabeckhambeauty.com/cdn/shop/files/VVB_Reflect-Highlighter-Stick_Product-Grid_Pearl_1080x1350_1.jpg?v=1719345857&width=800', category: 'Make Up', name: 'Reflect Highlighter Stick', price: '$44.00' },
  { imageUrl: 'https://victoriabeckhambeauty.com/cdn/shop/files/VVB_Cheeky-Posh_Product-Grid_Code playground_1080x1350_1.jpg?v=1719345811&width=800', category: 'Make Up', name: 'Cheeky Posh', price: '$42.00' },
  { imageUrl: 'https://victoriabeckhambeauty.com/cdn/shop/files/VVB_Matte-Bronzing-Brick_Product-Grid_01_1080x1350_1.jpg?v=1719345824&width=800', category: 'Make Up', name: 'Matte Bronzing Brick', price: '$60.00' },
  { imageUrl: 'https://victoriabeckhambeauty.com/cdn/shop/files/VVB_Lid-Lustre_Product-Grid_Chiffon_1080x1350_1.jpg?v=1719345800&width=800', category: 'Make Up', name: 'Lid Lustre', price: '$38.00' },
];

interface ProductGridProps {
  categoryTitle: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ categoryTitle }) => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h1 
        className="text-center text-4xl md:text-5xl mb-10" 
        style={{ fontFamily: 'var(--font-secondary)' }}
      >
        {categoryTitle}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {placeholderProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
