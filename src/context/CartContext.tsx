import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItem, Deal } from "../data/menuData";

export interface CartItem {
  item: MenuItem | Deal;
  quantity: number;
  isDeal: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem | Deal, quantity: number, isDeal?: boolean) => void;
  removeFromCart: (itemId: number, isDeal?: boolean) => void;
  updateQuantity: (itemId: number, quantity: number, isDeal?: boolean) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: MenuItem | Deal, quantity: number, isDeal = false) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.item.id === item.id && i.isDeal === isDeal);
      if (existing) {
        return prev.map(i => i.item.id === item.id && i.isDeal === isDeal ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { item, quantity, isDeal }];
    });
  };

  const removeFromCart = (itemId: number, isDeal = false) => {
    setCartItems(prev => prev.filter(i => !(i.item.id === itemId && i.isDeal === isDeal)));
  };

  const updateQuantity = (itemId: number, quantity: number, isDeal = false) => {
    if (quantity <= 0) {
      removeFromCart(itemId, isDeal);
      return;
    }
    setCartItems(prev => prev.map(i => i.item.id === itemId && i.isDeal === isDeal ? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, i) => total + (i.item.price * i.quantity), 0);
  const cartCount = cartItems.reduce((count, i) => count + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}