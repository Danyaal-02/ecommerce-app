import React from 'react';
import { motion } from 'framer-motion';

const ProductModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 px-4 sm:px-0">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="relative top-20 mx-auto p-4 sm:p-5 border w-full max-w-md shadow-lg rounded-md bg-gray-800 text-gray-300"
      >
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-indigo-400 text-center">{title}</h3>
          <div className="mt-2 py-3">
            {children}
          </div>
          <div className="items-center py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductModal;