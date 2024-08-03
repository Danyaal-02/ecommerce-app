import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createOrder, createPaymentIntent } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, success, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg text-gray-200 w-full max-w-sm sm:max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${success ? 'text-green-400' : 'text-red-400'}`}>
              {success ? 'Payment Successful' : 'Payment Failed'}
            </h2>
            <p className="mb-6 text-sm sm:text-base text-gray-300">{message}</p>
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 w-full text-sm sm:text-base"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CheckoutForm = ({ cartItems, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paySessionId, setPaySessionId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    setPaySessionId(uuidv4());
  }, []);

  const handleCardChange = useCallback((event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError("Stripe hasn't loaded yet. Please try again.");
      return;
    }
  
    if (!cardComplete) {
      setError("Please complete your card details.");
      return;
    }
  
    setProcessing(true);
    setError(null);
  
    try {
      const total = cartItems.reduce((sum, item) => {
        if (!item.productId || !item.productId.price || !item.quantity) {
          throw new Error('Invalid cart item');
        }
        return sum + item.productId.price * item.quantity;
      }, 0);
  
      const totalInCents = Math.round(total * 100);
  
      const { clientSecret } = await createPaymentIntent(totalInCents, cartItems, paySessionId);
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
  
      if (result.error) {
        throw result.error;
      }
  
      if (result.paymentIntent.status === 'succeeded') {
        await createOrder(result.paymentIntent.id);
        setModalSuccess(true);
        setModalMessage('Your payment was successful. Thank you for your purchase!');
      } else {
        throw new Error('Payment was not successful. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
      setModalSuccess(false);
      setModalMessage(err.message);
    } finally {
      setProcessing(false);
      setModalOpen(true);
    }
  };
  
  const closeModal = useCallback(() => {
    setModalOpen(false);
    if (modalSuccess) {
      onSuccess();
    }
  }, [modalSuccess, onSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="bg-gray-700 rounded-lg p-3 sm:p-4">
          <CardElement 
            onChange={handleCardChange}
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  '@media (min-width: 640px)': {
                    fontSize: '16px',
                  },
                  color: '#E0E0E0',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#FCA5A5',
                },
              },
            }}
            className="p-2 sm:p-3 border border-gray-600 rounded"
          />
        </div>
        {error && <div className="text-red-400 text-xs sm:text-sm">{error}</div>}
        <button
          type="submit"
          disabled={!stripe || processing || !cardComplete}
          className={`w-full py-2 sm:py-3 px-4 rounded-md text-white font-semibold text-base sm:text-lg transition-colors duration-300
            ${!stripe || processing || !cardComplete
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        success={modalSuccess}
        message={modalMessage}
      />
    </motion.div>
  );
};

export default CheckoutForm;