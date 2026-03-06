import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // the cookie handles the real token, but we track true/false state roughly
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session securely via backend on load
    const checkUserSession = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/check", {
          method: "GET",
          credentials: "include" // sends HTTP-only cookie
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken("cookie-active");
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error("Failed to verify user session", err);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setToken("cookie-active");
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Logout error", err);
    }

    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
