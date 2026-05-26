import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import defaultLogo from "@/assets/logo.png";

export interface SettingsContextType {
  logo: string;
  setLogo: (logo: string) => Promise<void>;
  logoSize: number;
  setLogoSize: (size: number) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [logo, setLogoState] = useState<string>(() => {
    return localStorage.getItem('townpizza_logo') || defaultLogo;
  });
  const [logoSize, setLogoSizeState] = useState<number>(() => {
    return Number(localStorage.getItem('townpizza_logo_size')) || 56;
  });

  useEffect(() => {
    // Check if document exists and seed if not
    const initData = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const d = await getDoc(docRef);
        if (!d.exists()) {
          await setDoc(docRef, { logo: defaultLogo, logoSize: 56 });
        }
      } catch (err) {
        console.error("Settings initialization error", err);
      }
    };
    initData();

    const unsub = onSnapshot(doc(db, 'settings', 'general'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.logo) {
          setLogoState(data.logo);
          localStorage.setItem('townpizza_logo', data.logo);
        }
        if (data.logoSize) {
          setLogoSizeState(data.logoSize);
          localStorage.setItem('townpizza_logo_size', data.logoSize.toString());
        }
      }
    });

    return () => unsub();
  }, []);

  const setLogo = async (newLogo: string) => {
    await setDoc(doc(db, 'settings', 'general'), { logo: newLogo }, { merge: true });
  };

  const setLogoSize = async (newSize: number) => {
    await setDoc(doc(db, 'settings', 'general'), { logoSize: newSize }, { merge: true });
  };

  const getResolvedLogoUrl = (url: string) => {
    if (!url) return defaultLogo;
    if (url.startsWith('data:') || url.startsWith('http:') || url.startsWith('https:')) {
      return url;
    }
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
    if (url.startsWith('/')) {
      if (baseUrl && !url.startsWith(baseUrl)) {
        return `${baseUrl}${url}`;
      }
    }
    return url;
  };

  return (
    <SettingsContext.Provider value={{ logo: getResolvedLogoUrl(logo), setLogo, logoSize, setLogoSize }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
