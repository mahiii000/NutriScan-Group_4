import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nutriscan_user"));
    } catch {
      return null;
    }
  });

  const login = (name, email) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const u = { name, email: normalizedEmail };
    setUser(u);
    localStorage.setItem("nutriscan_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nutriscan_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);