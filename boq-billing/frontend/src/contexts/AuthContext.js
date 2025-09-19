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
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await AuthService.login(credentials);
      setCurrentUser(response.user);
      return response.user;
    } catch (err) {
      const errorMessage = err.message || 'Failed to login';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    AuthService.logout();
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