import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserSessions } from '../services/api';
import { FaSignInAlt, FaSignOutAlt, FaClock, FaNetworkWired } from 'react-icons/fa';

const UserSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getUserSessions();
      setSessions(data);
    } catch (err) {
      setError('Failed to fetch sessions. Please try again later.');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8 text-indigo-400">Loading sessions...</div>;
  if (error) return <div className="text-center mt-8 text-red-400 font-semibold">{error}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 py-8 px-4 sm:py-12 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 sm:mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Your Sessions
        </h2>
        
        {sessions.length === 0 ? (
          <p className="text-center text-gray-400 italic">No sessions found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sessions.map((session, index) => (
              <SessionCard key={session._id} session={session} index={index} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SessionCard = ({ session, index }) => {
  const { loginTime, logoutTime, lastActivity, ipAddress } = session;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center text-indigo-400">
            <div className="flex items-center mb-1 sm:mb-0">
              <FaSignInAlt className="mr-2" />
              <span className="font-semibold">Login:</span>
            </div>
            <span className="ml-0 sm:ml-2 text-sm sm:text-base">{formatDate(loginTime)}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-300">
            <div className="flex items-center mb-1 sm:mb-0">
              <FaSignOutAlt className="mr-2" />
              <span className="font-semibold">Logout:</span>
            </div>
            <span className="ml-0 sm:ml-2 text-sm sm:text-base">
              {logoutTime ? formatDate(logoutTime) : (
                <span className="text-green-400 font-semibold">Active</span>
              )}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-300">
            <div className="flex items-center mb-1 sm:mb-0">
              <FaClock className="mr-2" />
              <span className="font-semibold">Last Activity:</span>
            </div>
            <span className="ml-0 sm:ml-2 text-sm sm:text-base">{formatDate(lastActivity)}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-300">
            <div className="flex items-center mb-1 sm:mb-0">
              <FaNetworkWired className="mr-2" />
              <span className="font-semibold">IP Address:</span>
            </div>
            <span className="ml-0 sm:ml-2 text-sm sm:text-base">{ipAddress}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserSessions;