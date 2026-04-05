import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('admin');

  useEffect(() => {
    // On page load, check if we have a user in localStorage (but token is in cookie)
    const savedUser = localStorage.getItem('traceline_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      document.body.className = `role-${user.role}`;
    }
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    try {
      const response = await authAPI.login(username, password, role);
      const { role: userRole, name, opId } = response.data;
      // Token is automatically stored in HttpOnly cookie by backend
      const userData = { username, role: userRole, name, opId, operatorKey: name };
      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('traceline_user', JSON.stringify(userData));
      document.body.className = `role-${userRole}`;
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('traceline_user');
    document.body.className = '';
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, login, logout, selectedRole, setSelectedRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);