import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const USERS = {
  'admin': { password: 'admin123', role: 'admin', name: 'Admin User', opId: null, operatorKey: null },
  'op.sharma': { password: 'op123', role: 'operator', name: 'R. Sharma', opId: 'OP-0042', operatorKey: 'R. Sharma' },
  'op.kumar': { password: 'op123', role: 'operator', name: 'A. Kumar', opId: 'OP-0018', operatorKey: 'A. Kumar' },
  'op.desai': { password: 'op123', role: 'operator', name: 'S. Desai', opId: 'OP-0031', operatorKey: 'S. Desai' },
  'op.patil': { password: 'op123', role: 'operator', name: 'V. Patil', opId: 'OP-0007', operatorKey: 'V. Patil' },
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('admin');

  useEffect(() => {
    const savedUser = localStorage.getItem('traceline_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      document.body.className = `role-${user.role}`;
    }
    setLoading(false);
  }, []);

  const login = (username, password, role) => {
    const user = USERS[username];
    if (user && user.password === password && user.role === role) {
      const userData = { username, ...user };
      setCurrentUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('traceline_user', JSON.stringify(userData));
      document.body.className = `role-${user.role}`;
      return true;
    }
    return false;
  };

  const logout = () => {
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