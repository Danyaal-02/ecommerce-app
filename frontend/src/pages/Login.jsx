import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../services/api';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: onLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      onLogin(data.userRole, data.userName);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-400">Login</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded px-6 sm:px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit" 
          className="btn btn-primary w-full flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Login'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Login;