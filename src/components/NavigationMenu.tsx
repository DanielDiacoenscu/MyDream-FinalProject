// src/components/NavigationMenu.tsx
'use client';
import React from 'react';
import { X } from 'lucide-react';
interface NavigationMenuProps { isOpen: boolean; onClose: () => void; }
const NavigationMenu: React.FC<NavigationMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const mainLinks = ['Shop All', 'Best Sellers', 'Skincare', 'Make Up', 'Fragrance'];
  const secondaryLinks = ['About', 'VB Exclusives', 'Account', 'Contact'];
  return (
    <div className="fixed inset-0 bg-white z-[100] flex"><div className="w-full p-8 overflow-y-auto"><div className="flex justify-end"><button onClick={onClose} className="p-2" aria-label="Close menu"><X size={32} /></button></div><div className="mt-12 flex flex-col items-center text-center"><nav className="flex flex-col space-y-6">{mainLinks.map(link => (<a key={link} href="#" className="text-4xl md:text-5xl hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-secondary)' }}>{link}</a>))}</nav><nav className="mt-16 flex flex-col space-y-4">{secondaryLinks.map(link => (<a key={link} href="#" className="text-lg uppercase tracking-widest hover:opacity-70 transition-opacity">{link}</a>))}</nav></div></div></div>
  );
};
export default NavigationMenu;
