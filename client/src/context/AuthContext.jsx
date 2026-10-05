import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trippilot_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('trippilot_token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('trippilot_token', res.data.token);
        localStorage.setItem('trippilot_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data?.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('trippilot_token', res.data.token);
        localStorage.setItem('trippilot_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleToken) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/google', { token: googleToken });
      if (res.data?.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('trippilot_token', res.data.token);
        localStorage.setItem('trippilot_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('trippilot_token');
    localStorage.removeItem('trippilot_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
