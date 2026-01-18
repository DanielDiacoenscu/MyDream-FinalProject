// src/context/WishlistContext.tsx - SANITIZED IDS
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { StrapiProduct } from '@/types/strapi';
import { useAuth } from '@/context/AuthContext';
import { updateUserWishlist } from '@/lib/api';
import { getCookie } from 'cookies-next';

interface WishlistContextType {
  wishlistItems: StrapiProduct[];
  addToWishlist: (product: StrapiProduct) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// --- HELPER: Normalize Product Data (FLATTEN IT) ---
const normalizeProduct = (item: any): StrapiProduct => {
  if (item.attributes) {
    return {
      id: item.id,
      ...item.attributes
    } as unknown as StrapiProduct;
  }
  return item as StrapiProduct;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<StrapiProduct[]>([]);
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Load from LocalStorage on Mount
  useEffect(() => {
    const localData = localStorage.getItem('wishlist');
    if (localData) {
      try {
        setWishlistItems(JSON.parse(localData));
      } catch (e) {
        console.error('Failed to parse wishlist from local storage');
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Sync with User Account when User Logs In
  useEffect(() => {
    if (!isInitialized) return;

    const syncWishlist = async () => {
      if (user && user.wishlist) {
        
        let rawUserItems: any[] = [];
        
        if (Array.isArray(user.wishlist)) {
            rawUserItems = user.wishlist;
        } else if (typeof user.wishlist === 'object' && user.wishlist !== null && 'data' in user.wishlist) {
            // @ts-ignore
            rawUserItems = Array.isArray(user.wishlist.data) ? user.wishlist.data : [];
        }

        const userItems = rawUserItems.map(normalizeProduct);
        const combinedItems = [...userItems];
        const existingIds = new Set(userItems.map(i => i.id));

        let hasChanges = false;
        wishlistItems.forEach(localItem => {
          if (!existingIds.has(localItem.id)) {
            combinedItems.push(localItem);
            hasChanges = true;
          }
        });

        setWishlistItems(combinedItems);

        if (hasChanges) {
            const token = getCookie('jwt') as string;
            if (token) {
                // SANITIZE: Ensure IDs are numbers
                const ids = combinedItems.map(i => Number(i.id)).filter(id => !isNaN(id));
                await updateUserWishlist(token, ids);
            }
        }
      }
    };

    syncWishlist();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInitialized]);

  // 3. Save to LocalStorage whenever list changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isInitialized]);

  const addToWishlist = async (product: StrapiProduct) => {
    const normalizedProduct = normalizeProduct(product);
    
    if (!wishlistItems.some(item => item.id === normalizedProduct.id)) {
      const newItems = [...wishlistItems, normalizedProduct];
      setWishlistItems(newItems);
      
      if (user) {
        const token = getCookie('jwt') as string;
        if (token) {
            // SANITIZE: Ensure IDs are numbers
            const ids = newItems.map(i => Number(i.id)).filter(id => !isNaN(id));
            await updateUserWishlist(token, ids);
        }
      }
    }
  };

  const removeFromWishlist = async (productId: number) => {
    const newItems = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(newItems);

    if (user) {
        const token = getCookie('jwt') as string;
        if (token) {
            // SANITIZE: Ensure IDs are numbers
            const ids = newItems.map(i => Number(i.id)).filter(id => !isNaN(id));
            await updateUserWishlist(token, ids);
        }
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist,
      wishlistCount 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
