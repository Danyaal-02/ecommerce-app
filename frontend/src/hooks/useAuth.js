// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

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

  const login = (role, name) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);
    window.location.href = '/';
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName(null);
    navigate('/login');
  };

  return { isLoggedIn, userRole, userName, login, logout };
}