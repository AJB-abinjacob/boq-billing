import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // For demo purposes, we'll simulate successful login
      // In production, this would use the actual API
      // const response = await AuthService.login(credentials);
      
      // Simulate successful login
      const mockUser = {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: credentials.role
      };
      
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      setCurrentUser(mockUser);
      return mockUser;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;