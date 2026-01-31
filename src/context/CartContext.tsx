// src/context/CartContext.tsx - CONNECTED TO THE CENTRAL TYPE
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { StrapiProduct } from '@/types/strapi';

export interface CartItem {
  id: number;
  name:string;
  price: number;
  price_bgn?: number; // <--- ADDED
  quantity: number;
  image: string;
  slug: string;
  tag?: string | null;
  subtitle?: string | null;
}

interface CartContextType {
  isCartOpen: boolean;
  toggleCart: () => void;
  cartItems: CartItem[];
  addToCart: (product: StrapiProduct) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartTotalBGN: number; // <--- ADDED
  formatDualPrice: (price: number, price_bgn?: number) => string; // <--- ADDED
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product: StrapiProduct) => {
    const imageUrl = product.Images?.[0]?.url;

    if (!imageUrl) {
      console.error("CRITICAL ERROR: Attempted to add a product to cart with no valid image.", product);
      return; 
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        price_bgn: product.price_bgn, // <--- CAPTURE BGN
        quantity: 1,
        image: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${imageUrl}`,
        slug: product.slug,
        tag: product.tag,
        subtitle: product.subtitle,
      };
      return [...prevItems, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // ADDED: BGN Total Calculation
  const cartTotalBGN = cartItems.reduce((total, item) => {
    const bgnPrice = item.price_bgn || (item.price * 1.95583);
    return total + bgnPrice * item.quantity;
  }, 0);

  // ADDED: Helper
  const formatDualPrice = (price: number, price_bgn?: number) => {
    const eur = \`\${price.toFixed(2)} €\`;
    const bgn = price_bgn 
      ? \`\${price_bgn.toFixed(2)} лв.\` 
      : \`\${(price * 1.95583).toFixed(2)} лв.\`;
    return \`\${eur} / \${bgn}\`;
  };

  return (
    <CartContext.Provider value={{ 
      isCartOpen, 
      toggleCart, 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartCount, 
      cartTotal,
      cartTotalBGN, // <--- EXPORTED
      clearCart,
      formatDualPrice // <--- EXPORTED
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
