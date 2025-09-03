// src/components/CategoryGrid.tsx
import React from 'react';

const categories = [
  {
    name: 'Skincare',
    imageUrl: 'https://victoriabeckhambeauty.com/cdn/shop/files/VBB_HP_Desktop_Skincare_1640x2056_1.jpg?v=1719512013&width=800',
    href: '/category/skincare',
  },
  {
    name: 'Make Up',
    imageUrl: 'https://victoriabeckhambeauty.com/cdn/shop/files/VBB_HP_Desktop_Makeup_1640x2056_1.jpg?v=1719512023&width=800',
    href: '/category/make-up',
  },
  {
    name: 'Fragrance',
    imageUrl: 'https://victoriabeckhambeauty.com/cdn/shop/files/VBB_HP_Desktop_Fragrance_1640x2056_1.jpg?v=1719512032&width=800',
    href: '/category/fragrance',
  },
];

const CategoryGrid = () => {
  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <a key={category.name} href={category.href} className="group relative block aspect-w-4 aspect-h-5 overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-8">
                <h3 
                  className="text-white text-3xl" 
                  style={{ fontFamily: 'var(--font-secondary)' }}
                >
                  {category.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
