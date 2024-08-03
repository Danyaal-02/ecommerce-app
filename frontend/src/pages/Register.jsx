import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { register } from '../services/api';
import { ClipLoader } from 'react-spinners';

const Register = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password, role);
      onRegister();
      setShowModal(true);
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/login');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8"
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-400">Register</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded px-6 sm:px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
          />
        </div>
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
        <div className="mb-4">
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
        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-300 text-sm font-bold mb-2">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input w-full border border-gray-600 rounded px-3 py-2 bg-gray-700 text-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit" 
          className="btn btn-primary w-full flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Register'}
        </motion.button>
      </form>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4 text-indigo-400">Email Verification Required</h3>
              <p className="text-gray-300 mb-4">
                Please check your email and click the verification link to complete your registration.
              </p>
              <button
                onClick={handleCloseModal}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Register;