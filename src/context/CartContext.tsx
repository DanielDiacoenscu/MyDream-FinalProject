// src/context/CartContext.tsx - CONNECTED TO THE CENTRAL TYPE
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { StrapiProduct } from '@/types/strapi';

export interface CartItem {
  id: number;
  name:string;
  price: number;
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
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product: StrapiProduct) => {
    // Extract image URL safely outside the setter
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
        quantity: 1,
        image: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${imageUrl}`,
        slug: product.slug,
        tag: product.tag,
        subtitle: product.subtitle,
      };
      return [...prevItems, newItem];
    });
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
      clearCart
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
