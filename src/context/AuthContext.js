import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "klaro_auth";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount
    const authData = localStorage.getItem(STORAGE_KEY);
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        console.log('[DEBUG] Loaded auth data:', { 
          hasUser: !!parsedData?.user,
          expiresAt: parsedData?.expiresAt,
          now: Date.now(),
          isValid: parsedData?.expiresAt > Date.now()
        });
        
        if (parsedData && parsedData.expiresAt > Date.now()) {
          setUser(parsedData.user);
          // Refresh the session if it's valid but close to expiring (less than 1 day)
          if (parsedData.expiresAt - Date.now() < 24 * 60 * 60 * 1000) {
            refreshSession(parsedData.user);
          }
        } else {
          console.log("[DEBUG] Session expired or invalid");
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error("[DEBUG] Invalid auth data:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      console.log("[DEBUG] No auth data found in storage");
    }
    setLoading(false);
  }, []);

  const refreshSession = (userData) => {
    const session = {
      user: userData,
      expiresAt: Date.now() + SESSION_DURATION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  const login = (userData) => {
    console.log('[DEBUG] Logging in with user data:', {
      id: userData.id,
      email: userData.email,
      hasToken: !!userData.token
    });
    
    // Remove sensitive data before storing
    const sanitizedUser = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      fullName: userData.fullName,
      lastLogin: new Date().toISOString(),
      token: userData.token
    };

    // Create session
    const session = {
      user: sanitizedUser,
      expiresAt: Date.now() + SESSION_DURATION,
    };

    setUser(sanitizedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  const logout = () => {
    console.log('[DEBUG] Logging out');
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const isAuthenticated = () => {
    if (!user) return false;

    const authData = localStorage.getItem(STORAGE_KEY);
    if (!authData) return false;

    try {
      const { expiresAt } = JSON.parse(authData);
      console.log('[DEBUG] Checking auth:', { 
        hasUser: !!user, 
        hasToken: !!user?.token,
        isAuthenticated: expiresAt > Date.now() 
      });
      return expiresAt > Date.now();
    } catch {
      return false;
    }
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
