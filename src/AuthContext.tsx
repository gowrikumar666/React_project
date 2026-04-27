import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    return Cookies.get('token') || null;
  });
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const savedUser = Cookies.get('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Sync with cookies on mount
    const cookieToken = Cookies.get('token');
    const cookieUser = Cookies.get('user');
    if (cookieToken) setTokenState(cookieToken);
    if (cookieUser) setUser(JSON.parse(cookieUser));
  }, []);

  const login = (newToken: string, email: string) => {
    setTokenState(newToken);
    setUser({ email });
    Cookies.set('token', newToken, { expires: 1/24 }); // 1 hour
    Cookies.set('user', JSON.stringify({ email }), { expires: 1/24 });
  };

  const logout = () => {
    setTokenState(null);
    setUser(null);
    Cookies.remove('token');
    Cookies.remove('user');
  };

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    Cookies.set('token', newToken, { expires: 1/24 });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        user,
        login,
        logout,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
