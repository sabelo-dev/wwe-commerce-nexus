
import React, { createContext, useState, useContext, useEffect } from "react";
import { CartItem, Cart } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("wweCart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wweCart", JSON.stringify(cart));
  }, [cart]);

  // Calculate subtotal whenever items change
  useEffect(() => {
    const newSubtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setCart(prev => ({ ...prev, subtotal: newSubtotal }));
  }, [cart.items]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        cartItem => cartItem.productId === item.productId
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += 1;
      } else {
        newItems = [...prevCart.items, { ...item, quantity: 1 }];
      }

      toast({
        title: "Item Added",
        description: `${item.name} has been added to your cart.`,
      });

      return {
        ...prevCart,
        items: newItems,
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.productId !== productId);
      
      return {
        ...prevCart,
        items: newItems,
      };
    });

    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );

      return {
        ...prevCart,
        items: newItems,
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], subtotal: 0 });
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  // Add the missing toggleCart function
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  // Add the missing setCartOpen function (alias for setIsCartOpen)
  const setCartOpen = (isOpen: boolean) => {
    setIsCartOpen(isOpen);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        setCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
