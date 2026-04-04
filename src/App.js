import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/Common/LoginScreen';
import Layout from './components/Layout/Layout';
import { ToastProvider } from './hooks/useToast';
import ToastContainer from './components/Common/ToastContainer';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  
  return isAuthenticated ? (
    <Layout />
  ) : (
    <LoginScreen />
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;