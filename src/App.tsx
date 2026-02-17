
import { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './AuthContext';
import LoginToken from './LoginToken';
import SignUpToken from './SignUpToken';
import Dashboard from './Dashboard';

type AuthMode = 'signin' | 'login';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <>
      {authMode === 'signin' ? (
        <SignUpToken 
          onSwitchToLogin={() => setAuthMode('login')}
        />
      ) : (
        <LoginToken 
          onSwitchToSignUp={() => setAuthMode('signin')}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
