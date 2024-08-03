import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = cartItems && Array.isArray(cartItems) ? cartItems : [];

  const total = items.reduce((sum, item) => {
    if (item && item.productId && typeof item.productId.price === 'number' && typeof item.quantity === 'number') {
      return sum + item.productId.price * item.quantity;
    }
    return sum;
  }, 0);

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems: items } });
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 text-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Shopping Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-400 italic">Your cart is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.productId._id} className="flex flex-col sm:flex-row justify-between items-center mb-4 pb-4 border-b border-gray-700">
              <span className="text-lg mb-2 sm:mb-0">{item.productId.name}</span>
              <div className="flex items-center">
                <button 
                  onClick={() => onUpdateQuantity(item.productId._id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors duration-200"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="mx-3">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.productId._id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors duration-200"
                >
                  +
                </button>
                <div>
                    <span className="ml-4 text-indigo-300">${(item.productId.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => onRemoveItem(item.productId._id)}
                      className="ml-4 text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <FaTrash />
                    </button>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-md 
                           hover:from-indigo-600 hover:to-purple-700 transition duration-300 flex items-center justify-center
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                <FaShoppingCart className="mr-2" /> Proceed to Checkout
              </button>
        </>
      )}
    </motion.div>
  );
};

export default Cart;