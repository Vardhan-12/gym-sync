import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUserState] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      setUserState(JSON.parse(stored));
    }
  }, []);

  const setUser = (userData) => {
    setUserState(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}