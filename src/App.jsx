import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ParkingProvider } from './context/ParkingContext';
import { PaymentProvider } from './context/PaymentContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ParkingSpots from './pages/ParkingSpots';
import Vehicles from './pages/Vehicles';
import Payment from './pages/Payment';
import Users from './pages/Users';
import './App.css';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/parking-spots" element={<ParkingSpots />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <PaymentProvider>
          <Router>
            <AppContent />
          </Router>
        </PaymentProvider>
      </ParkingProvider>
    </AuthProvider>
  );
}

export default App;
