import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "klaro_session";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check session on mount
    const sessionData = sessionStorage.getItem(STORAGE_KEY);
    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        if (parsedData && parsedData.expiresAt > Date.now()) {
          setUser(parsedData.user);
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error("Invalid session data");
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (userData) => {
    // Remove sensitive data before storing
    const sanitizedUser = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      fullName: userData.fullName,
    };

    // Create session with 24-hour expiry
    const session = {
      user: sanitizedUser,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    setUser(sanitizedUser);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
