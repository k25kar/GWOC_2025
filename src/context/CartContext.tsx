"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";

export interface Service {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface CartItem {
  service: Service;
  date: Date;
  time: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage when the component mounts.
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        // Convert date strings back to Date objects
        const restoredCart = parsed.map((item: any) => ({
          ...item,
          date: new Date(item.date),
        }));
        setCart(restoredCart);
        console.log("Loaded cart from localStorage:", restoredCart);
      }
    } catch (error) {
      console.error("Error parsing stored cart:", error);
    }
  }, []);

  // Save cart to localStorage only when there are items.
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Saving cart to localStorage:", cart);
    } else {
      // Optionally, if you want to remove the key when the cart is empty, uncomment the next line:
      // localStorage.removeItem("cart");
      console.log("Cart is empty; not updating localStorage.");
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
