import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { menuItems as initialItems, deals as initialDeals, initialCategoriesData, MenuItem, Deal, CategoryItem } from '@/data/menuData';

interface MenuContextType {
  items: MenuItem[];
  deals: Deal[];
  categories: CategoryItem[];
  setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  setCategories: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  addItem: (item: MenuItem) => Promise<void>;
  updateItem: (item: MenuItem) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  addDeal: (deal: Deal) => Promise<void>;
  updateDeal: (deal: Deal) => Promise<void>;
  deleteDeal: (id: number) => Promise<void>;
  updateCategory: (category: CategoryItem) => Promise<void>;
  reorderCategories: (newCategories: CategoryItem[]) => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Seed and listen to Menu Items
    const initData = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        if (categoriesSnapshot.empty) {
          const batch = writeBatch(db);
          initialCategoriesData.forEach((cat, index) => {
            batch.set(doc(db, 'categories', cat.id), { ...cat, order: index });
          });
          initialItems.forEach(item => {
            batch.set(doc(db, 'menuItems', item.id.toString()), item);
          });
          initialDeals.forEach(deal => {
            batch.set(doc(db, 'deals', deal.id.toString()), deal);
          });
          await batch.commit();
        }
        setIsInitializing(false);
      } catch (e) {
        console.error("Initialization error:", e);
        setIsInitializing(false);
      }
    };

    initData();
  }, []);

  useEffect(() => {
    if (isInitializing) return;

    const unsubItems = onSnapshot(collection(db, 'menuItems'), snapshot => {
      const dbItems = snapshot.docs.map(d => ({ ...d.data(), id: Number(d.id) } as MenuItem));
      setItems(dbItems);
    });

    const unsubDeals = onSnapshot(collection(db, 'deals'), snapshot => {
      const dbDeals = snapshot.docs.map(d => ({ ...d.data(), id: Number(d.id) } as Deal));
      setDeals(dbDeals);
    });

    const unsubCategories = onSnapshot(collection(db, 'categories'), snapshot => {
      let dbCategories = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as CategoryItem));
      // Sort by order field if it exists
      dbCategories.sort((a, b) => (a.order || 0) - (b.order || 0));
      setCategories(dbCategories);
    });

    return () => {
      unsubItems();
      unsubDeals();
      unsubCategories();
    };
  }, [isInitializing]);

  const addItem = async (item: MenuItem) => {
    await setDoc(doc(db, 'menuItems', item.id.toString()), item);
  };

  const updateItem = async (updatedItem: MenuItem) => {
    await setDoc(doc(db, 'menuItems', updatedItem.id.toString()), updatedItem);
  };

  const deleteItem = async (id: number) => {
    await deleteDoc(doc(db, 'menuItems', id.toString()));
  };

  const addDeal = async (deal: Deal) => {
    await setDoc(doc(db, 'deals', deal.id.toString()), deal);
  };

  const updateDeal = async (updatedDeal: Deal) => {
    await setDoc(doc(db, 'deals', updatedDeal.id.toString()), updatedDeal);
  };

  const deleteDeal = async (id: number) => {
    await deleteDoc(doc(db, 'deals', id.toString()));
  };
  
  const updateCategory = async (updatedCategory: CategoryItem) => {
    await setDoc(doc(db, 'categories', updatedCategory.id), updatedCategory);
  };

  const reorderCategories = async (newCategories: CategoryItem[]) => {
    // Optimistic UI update
    setCategories(newCategories);
    
    // Save to DB
    const batch = writeBatch(db);
    newCategories.forEach((cat, index) => {
      batch.set(doc(db, 'categories', cat.id), { ...cat, order: index }, { merge: true });
    });
    await batch.commit();
  };

  return (
    <MenuContext.Provider value={{ items, deals, categories, setItems, setDeals, setCategories, addItem, updateItem, deleteItem, addDeal, updateDeal, deleteDeal, updateCategory, reorderCategories }}>
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
