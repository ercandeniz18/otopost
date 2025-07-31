import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { sendVerificationCode as sendLocalVerificationCode, verifyCode as verifyLocalCode } from '../utils/emailVerification';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  verifyCode: (code: string, value: string) => Promise<boolean>;
  sendVerificationCode: (type: 'email' | 'phone', value: string) => Promise<void>;
}

interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth).isAuthenticated : false;
  });
  const [user, setUser] = useState<User | null>(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth).user : null;
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify({ isAuthenticated, user }));
  }, [isAuthenticated, user]);

  const signup = async (email: string, password: string, username: string) => {
    const response = await authApi.signup({ email, password, username });
    if (response.token && response.user) {
      setIsAuthenticated(true);
      setUser(response.user);
      // Send verification code
      await sendLocalVerificationCode('email', email);
    }
  };

  const sendVerificationCode = async (type: 'email' | 'phone', value: string) => {
    await sendLocalVerificationCode(type, value);
  };

  const verifyCode = async (code: string, value: string): Promise<boolean> => {
    const isValid = await verifyLocalCode(value, code);
    if (isValid) {
      setUser(prev => prev ? { ...prev, isVerified: true } : null);
    }
    return isValid;
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setIsAuthenticated(true);
    setUser(response.user);
  };

  const logout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      updateProfile, 
      signup,
      verifyCode,
      sendVerificationCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};