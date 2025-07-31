import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ApiSettings from './pages/ApiSettings';
import ScraperSettings from './pages/ScraperSettings';
import PostTemplates from './pages/PostTemplates';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import GoogleAuth from './pages/GoogleAuth';
import './index.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router future={{ v7_startTransition: true }}>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: 'white',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: 'white',
                },
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/google" element={<GoogleAuth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="api-settings" element={<ApiSettings />} />
              <Route path="scraper-settings" element={<ScraperSettings />} />
              <Route path="templates" element={<PostTemplates />} />
              <Route path="history" element={<History />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="subscription" element={<Subscription />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;