import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Dashboard from './components/Dashboard.js';
import Reports from './components/Reports.js';
import Vitals from './components/Vitals.js';
import HealthTips from './components/HealthTips.js';
import Reminders from './components/Reminders.js';
import ProgressReport from './components/ProgressReport.js';
import ReportComparison from './components/ReportComparison.js';
import Settings from './components/Settings.js';
import HealthBlog from './components/HealthBlog.js'; 
import AIChatbot from './components/AIChatbot.js';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading HealthMate...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vitals" 
              element={
                <ProtectedRoute>
                  <Vitals />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/health-tips" 
              element={
                <ProtectedRoute>
                  <HealthTips />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reminders" 
              element={
                <ProtectedRoute>
                  <Reminders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/progress-report" 
              element={
                <ProtectedRoute>
                  <ProgressReport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/report-comparison" 
              element={
                <ProtectedRoute>
                  <ReportComparison />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            {/* 👇 YEH ROUTE ADD KARO - BLOG PAGE */}
            <Route 
              path="/health-blog" 
              element={
                <ProtectedRoute>
                  <HealthBlog />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>

          <AIChatbot />

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;