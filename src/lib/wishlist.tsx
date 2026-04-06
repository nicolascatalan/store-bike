"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "./products";
import type { DBProduct } from "./supabase";

type Item = Product | DBProduct;

type WishlistContextType = {
  items: string[]; // store only IDs
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  toggleItem: () => {},
  hasItem: () => false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("store-wishlist");
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("store-wishlist", JSON.stringify(items));
    }
  }, [items, loaded]);

  function toggleItem(id: string) {
    setItems((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function hasItem(id: string) {
    return items.includes(id);
  }

  return (
    <WishlistContext.Provider value={{ items, toggleItem, hasItem }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
