import React, { createContext, useContext, useEffect, useState } from 'react';
import { isUserLoggedIn, getUserToken } from '../services/spotifyUserAuth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        const token = await getUserToken();
        setUserToken(token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('[AuthContext] Check failed:', error);
    } finally {
      setLoading(false);
    }
  }

  function setAuth(token) {
    setUserToken(token);
    setIsLoggedIn(!!token);
  }

  function logout() {
    setUserToken(null);
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ userToken, isLoggedIn, loading, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
