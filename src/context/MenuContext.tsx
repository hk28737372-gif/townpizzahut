import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { menuItems as initialItems, deals as initialDeals, MenuItem, Deal } from '@/data/menuData';

interface MenuContextType {
  items: MenuItem[];
  deals: Deal[];
  setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  addItem: (item: MenuItem) => void;
  updateItem: (item: MenuItem) => void;
  deleteItem: (id: number) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (deal: Deal) => void;
  deleteDeal: (id: number) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  // Initialize state from local storage or fallback to initial data
  const [items, setItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('townpizza_menuItems');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialItems;
      }
    }
    return initialItems;
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('townpizza_deals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialDeals;
      }
    }
    return initialDeals;
  });

  // Sync state changes back to local storage
  useEffect(() => {
    localStorage.setItem('townpizza_menuItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('townpizza_deals', JSON.stringify(deals));
  }, [deals]);

  const addItem = (item: MenuItem) => setItems((prev) => [...prev, item]);
  const updateItem = (updatedItem: MenuItem) => setItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  const deleteItem = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id));

  const addDeal = (deal: Deal) => setDeals((prev) => [...prev, deal]);
  const updateDeal = (updatedDeal: Deal) => setDeals((prev) => prev.map((deal) => (deal.id === updatedDeal.id ? updatedDeal : deal)));
  const deleteDeal = (id: number) => setDeals((prev) => prev.filter((deal) => deal.id !== id));

  return (
    <MenuContext.Provider value={{ items, deals, setItems, setDeals, addItem, updateItem, deleteItem, addDeal, updateDeal, deleteDeal }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
