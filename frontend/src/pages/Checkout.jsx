import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { motion } from 'framer-motion';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  const handleSuccess = () => {
    navigate('/orders');
  };

  const handleIncompletePayment = () => {
    navigate('/');
  };

  const total = cartItems.reduce((sum, item) => {
    if (item && item.productId && typeof item.productId.price === 'number' && typeof item.quantity === 'number') {
      return sum + item.productId.price * item.quantity;
    }
    return sum;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <motion.div 
        className="container mx-auto px-4 py-8 text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-400">Checkout</h2>
        <p className="text-gray-400 italic">Your cart is empty. Please add some items before checking out.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-indigo-400">Checkout</h2>
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <motion.div 
          className="w-full md:w-1/2 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-300">Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.productId._id} className="flex justify-between mb-2 text-sm sm:text-base text-gray-300">
              <span>{item.productId.name} x {item.quantity}</span>
              <span className="text-indigo-300">${(item.productId.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span className="text-indigo-300">${total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
        <motion.div 
          className="w-full md:w-1/2 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-300">Payment Details</h3>
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              cartItems={cartItems} 
              onSuccess={handleSuccess}
              onIncompletePayment={handleIncompletePayment}
            />
          </Elements>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Checkout;