import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.id) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [user, token]);

  const fetchCartCount = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart`, {
        method: "GET",
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        // Calculate total quantity of items (not just unique rows)
        const total = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  const refreshCartCount = () => {
    if (user && user.id) fetchCartCount();
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
