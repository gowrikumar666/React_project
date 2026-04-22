
import { Suspense, useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './AuthContext';
import LoginToken from './LoginToken';
import SignUpToken from './SignUpToken';
import Dashboard from './Dashboard';
import ListComponent from './ListComponent';
import IndiaComponent from './IndiaComponent';
import AllInOne from './AllInOne';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Layout from './layout';

type AuthMode = 'signin' | 'login';

export function AppContent() {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            authMode === 'signin' ? (
              <SignUpToken onSwitchToLogin={() => setAuthMode('login')} />
            ) : (
              <LoginToken onSwitchToSignUp={() => setAuthMode('signin')} />
            )
          }
        />
      </Routes>
    );
  }

  // ✅ NO BrowserRouter here
  return <Layout />;
  
}
