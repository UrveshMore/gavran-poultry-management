import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import FarmSelectionPage from './components/FarmSelectionPage';
import DashboardPage from './components/DashboardPage';
import ShedsPage from './components/ShedsPage';
import BatchesPage from './components/BatchesPage';
import MortalityPage from './components/MortalityPage';
import Layout from './components/Layout';
import { AuthService } from './services/auth.service';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/farm-selection" />} />
          <Route path="/farm-selection" element={<FarmSelectionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sheds" element={<ShedsPage />} />
          <Route path="/batches" element={<BatchesPage />} />
          <Route path="/mortality" element={<MortalityPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;