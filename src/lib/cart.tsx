"use client";
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: "ADD"; item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE_QTY"; id: string; qty: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "UPDATE_QTY":
      if (action.qty <= 0)
        return { items: state.items.filter((i) => i.id !== action.id) };
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.qty } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tiendabici_cart");
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) });
    } catch {}
  }, []);

  // Persist to localStorage & sync cart badge
  useEffect(() => {
    try {
      localStorage.setItem("tiendabici_cart", JSON.stringify(state.items));
    } catch {}
    const badge = document.getElementById("cart-count");
    if (badge) {
      const total = state.items.reduce((s, i) => s + i.quantity, 0);
      badge.textContent = String(total);
    }
  }, [state.items]);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => dispatch({ type: "ADD", item }), []);
  const removeItem = useCallback((id: string) => dispatch({ type: "REMOVE", id }), []);
  const updateQty = useCallback((id: string, qty: number) => dispatch({ type: "UPDATE_QTY", id, qty }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  return (
    <CartContext.Provider value={{ items: state.items, totalItems, totalPrice, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
