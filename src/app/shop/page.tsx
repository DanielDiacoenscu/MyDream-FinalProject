// src/app/shop/page.tsx - CORRECTED
export const dynamic = 'force-dynamic';
import { getAllProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import styles from '@/styles/ShopPage.module.css';

const ShopPage = async () => {
  const products = await getAllProducts();

  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Магазин</h1>
      {/* --- THIS LINE HAS BEEN CORRECTED --- */}
      <div className={styles.productGrid}>
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
