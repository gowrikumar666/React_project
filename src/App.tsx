
import { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './AuthContext';
import LoginToken from './LoginToken';
import SignUpToken from './SignUpToken';
import Dashboard from './Dashboard';
import ListComponent from './ListComponent';
import IndiaComponent from './IndiaComponent';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

type AuthMode = 'signin' | 'login';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={
          authMode === 'signin' ? (
            <SignUpToken 
              onSwitchToLogin={() => setAuthMode('login')}
            />
          ) : (
            <LoginToken 
              onSwitchToSignUp={() => setAuthMode('signin')}
            />
          )
        } />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/list" element={<ListComponent />} />
      <Route path="/indiacomponent" element={<IndiaComponent />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
