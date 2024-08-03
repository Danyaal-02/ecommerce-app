// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductManagement from './pages/ProductManagement';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import UserSessions from './pages/UserSessions';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isLoggedIn, userRole, userName, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <Header isLoggedIn={isLoggedIn} userRole={userRole} userName={userName} onLogout={logout} />
      <main className="container mx-auto py-8 px-4">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/product-management"
            element={
              isLoggedIn && userRole === 'admin' ? (
                <ProductManagement />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/orders"
            element={isLoggedIn ? <Orders /> : <Navigate to="/login" />}
          />
          <Route
            path="/sessions"
            element={isLoggedIn ? <UserSessions /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;