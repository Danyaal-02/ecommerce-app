import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const ProductItem = ({ product, onAddToCart, isLoggedIn }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  if (!product) return null;

  const formattedPrice = typeof product.price === 'number'
    ? `$${product.price.toFixed(2)}`
    : 'Price not available';

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    setIsAddingToCart(true);
    await onAddToCart(product._id);
    setIsAddingToCart(false);
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 flex flex-col relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full h-48 sm:h-56 md:h-64 lg:h-60">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          {product.name || 'Unnamed Product'}
        </h2>
        <p className="text-gray-300 mb-4 flex-grow line-clamp-3">
          {product.description || 'No description available'}
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <p className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
            {formattedPrice}
          </p>
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md 
                       hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                       flex items-center justify-center"
            disabled={!product._id || isAddingToCart}
          >
            {isAddingToCart ? (
              <ClipLoader color="#ffffff" size={20} />
            ) : (
              <>
                <FaShoppingCart className="mr-2" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-center"
          >
            Please log in to add items to your cart.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductItem;