
import { Suspense, useState } from 'react';
import './App.css';
import { useAuth } from './AuthContext';
import LoginToken from './LoginToken';
import SignUpToken from './SignUpToken';
import Dashboard from './Dashboard';
import ListComponent from './ListComponent';
import IndiaComponent from './IndiaComponent';
import DropdownComponent from './DropdownComponent';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
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

  // Authenticated: render Layout with Routes
  return (
    <Layout>
      <Suspense fallback={
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          width: '100%',
        }}>
          Loading...
        </Box>
      }>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/list" element={<ListComponent />} />
          <Route path="/indiacomponent" element={<IndiaComponent />} />
          <Route path="/dropdown" element={<DropdownComponent />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
  
}
