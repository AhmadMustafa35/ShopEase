import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { loginUser, registerUser, getMe } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('shopease_token') || localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load and verify current user on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('shopease_token') || localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await getMe();
          if (res?.success && res?.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to authenticate with stored token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      if (res?.success && res?.token) {
        localStorage.setItem('shopease_token', res.token);
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name || 'Shopper'}!`);
        return { success: true, user: res.user };
      }
      return { success: false, message: res?.message || 'Login failed' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Invalid email or password';
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await registerUser({ name, email, password });
      if (res?.success && res?.token) {
        localStorage.setItem('shopease_token', res.token);
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Account created successfully! Welcome to ShopEase, ${res.user.name}!`);
        return { success: true, user: res.user };
      }
      return { success: false, message: res?.message || 'Registration failed' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to register account';
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('shopease_token');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = useMemo(() => {
    return Boolean(user && (user.role === 'admin' || user.isAdmin === true));
  }, [user]);

  const value = {
    user,
    token,
    loading,
    isAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
