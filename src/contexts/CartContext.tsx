import React, { createContext, useContext, useState, ReactNode } from "react";
import { notification } from "antd";

// Configure notification
notification.config({
  placement: "topRight",
  duration: 4.5,
});

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  userId: string;
  createdDate: string;
  salesCount: number;
  __v: number;
  icon?: React.ComponentType<any>;
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  images: string;
  icon?: React.ComponentType<any>;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  showAlert: (message: string, type?: "success" | "error" | "info") => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const showAlert = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    switch (type) {
      case "success":
        notification.success({
          message: "Success",
          description: message,
        });
        break;
      case "error":
        notification.error({
          message: "Error",
          description: message,
        });
        break;
      case "info":
        notification.info({
          message: "Info",
          description: message,
        });
        break;
      default:
        notification.open({
          message: "Notification",
          description: message,
        });
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        images: product.images,
        icon: product.icon,
      };
      setCart([...cart, newItem]);
    }

    showAlert(`${product.name} added to cart successfully!`, "success");
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    showAlert,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
