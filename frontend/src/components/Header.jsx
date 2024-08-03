import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { logout } from '../services/api';

const Header = ({ isLoggedIn, userRole, userName, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? "text-indigo-400 font-bold" : "hover:text-indigo-400";
  };

  const buttonStyle = "text-white px-4 py-2 rounded-md transition-all duration-300";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
      toggleMenu();
    }
  };

  const NavItems = () => (
    <>
      {isLoggedIn && (
        <li className="flex items-center py-2 mr-4">
          <FaUser className="mr-2" />
          <span className="text-indigo-400">{userName}</span>
        </li>
      )}
      <li><Link to="/" className={`${isActive('/')} block py-2 transition-colors duration-300`} onClick={toggleMenu}>Home</Link></li>
      {isLoggedIn ? (
        <>
          <li><Link to="/orders" className={`${isActive('/orders')} block py-2 transition-colors duration-300`} onClick={toggleMenu}>My Orders</Link></li>
          <li><Link to="/sessions" className={`${isActive('/sessions')} block py-2 transition-colors duration-300`} onClick={toggleMenu}>My Sessions</Link></li>
          {userRole === 'admin' && (
            <li><Link to="/product-management" className={`${isActive('/product-management')} block py-2 transition-colors duration-300`} onClick={toggleMenu}>Manage Products</Link></li>
          )}
          <li>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`${buttonStyle} block w-full text-left my-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 flex items-center justify-center`}
            >
              {isLoggingOut ? <ClipLoader color="#ffffff" size={20} /> : 'Logout'}
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link 
              to="/login" 
              className={`${isActive('/login')} ${buttonStyle} block w-full text-left my-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700`}
              onClick={toggleMenu}
            >
              Login
            </Link>
          </li>
          <li>
            <Link 
              to="/register" 
              className={`${isActive('/register')} ${buttonStyle} block w-full text-left my-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700`}
              onClick={toggleMenu}
            >
              Register
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 transition-all duration-300">
          Elegant Store
        </Link>
        
        {/* Mobile menu button */}
        <button onClick={toggleMenu} className="md:hidden text-white">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4 items-center">
            <NavItems />
          </ul>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-64 bg-gray-800 p-4 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden z-50`}>
        <button onClick={toggleMenu} className="absolute top-4 right-4 text-white">
          <FaTimes size={24} />
        </button>
        <nav className="mt-12">
          <ul className="space-y-4">
            <NavItems />
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;