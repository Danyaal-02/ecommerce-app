import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductManagement from './pages/ProductManagement';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import UserSessions from './pages/UserSessions';
import { logout } from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    if (token && role && name) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUserName(name);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
      setUserName(null);
    }
  };

  const handleLogin = (role, name) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUserRole(null);
      setUserName(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRegister = () => {
    checkLoginStatus();
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Header isLoggedIn={isLoggedIn} userRole={userRole} userName={userName} onLogout={handleLogout} />
        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route
              path="/product-management"
              element={
                isLoggedIn && userRole === 'admin' ? (
                  <ProductManagement />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/orders"
              element={isLoggedIn ? <Orders /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/sessions"
              element={isLoggedIn ? <UserSessions /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;