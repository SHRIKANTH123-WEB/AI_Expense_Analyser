import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import { RefreshCw } from 'lucide-react';

const MainAppContent = () => {
  const { user, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  // Loading indicator for JWT profile checks
  if (loading) {
    return (
      <div className="min-h-screen bg-[#040815] flex flex-col items-center justify-center text-slate-400 gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-brand-green" />
        <span className="text-sm font-semibold tracking-wide animate-pulse">Initializing SpendWise...</span>
      </div>
    );
  }

  // Authentication Switcher inside Landing Page
  if (!user) {
    return (
      <Landing 
        isRegistering={isRegistering} 
        setIsRegistering={setIsRegistering} 
      />
    );
  }

  // Authenticated View
  return (
    <ExpenseProvider>
      <Dashboard />
    </ExpenseProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
