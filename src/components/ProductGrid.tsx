use client';

import ProductCard from './ProductCard';
import { StrapiProduct } from '@/types/strapi'; // Import the central type

// This placeholder data matches the structure ProductCard now requires.
const placeholderProducts: StrapiProduct[] = Array(8).fill(null).map((_, index) => ({
  id: index,
  name: `Placeholder Product ${index + 1}`,
  Price: 99.99,
  slug: `placeholder-product-${index + 1}`,
  Images: [{
    id: index,
    url: 'https://placehold.co/400x500',
    alternativeText: `Placeholder image for product ${index + 1}`
  }],
  Tag: 'New',
  Subtitle: 'A placeholder subtitle',
  Rating: 4.5,
}));

const ProductGrid = () => {
  return (
    <div className="w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {placeholderProducts.map((product) => (
          // This is the corrected line:
          // We pass the entire object into a single 'product' prop.
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
