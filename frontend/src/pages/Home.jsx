import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import { getProducts, addToCart, getCart, updateCartItemQuantity, removeCartItem } from '../services/api';
import { FaShoppingCart } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const Home = ({ isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(true);
  const [isCartLoading, setIsCartLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    if (isLoggedIn) {
      fetchCart();
    } else {
      setCartItems([]);
      setIsCartLoading(false);
    }
  }, [isLoggedIn]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('Failed to fetch products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCart = async () => {
    setIsCartLoading(true);
    try {
      const data = await getCart();
      setCartItems(data.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      showNotification('Failed to fetch cart', 'error');
    } finally {
      setIsCartLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      showNotification('Please log in to add items to your cart.', 'error');
      return;
    }
    try {
      await addToCart(productId, 1);
      fetchCart();
      showNotification('Product added to cart', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add product to cart', 'error');
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await updateCartItemQuantity(productId, newQuantity);
      fetchCart();
      showNotification('Cart updated successfully', 'success');
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      showNotification('Failed to update cart', 'error');
    }
  };
  
  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItem(productId);
      fetchCart();
      showNotification('Item removed from cart', 'success');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      showNotification('Failed to remove item from cart', 'error');
    }
  };

  const handleCheckout = () => {
    // Implement checkout logic
    showNotification('Checkout functionality not implemented yet', 'error');
  };

  const toggleMobileCart = () => {
    setIsMobileCartOpen(!isMobileCartOpen);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto relative">
        <motion.div 
          className="lg:w-3/4 lg:pr-8"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader color="#6366F1" size={50} />
            </div>
          ) : (
            <ProductList products={products} onAddToCart={handleAddToCart} isLoggedIn={isLoggedIn} />
          )}
        </motion.div>

        {/* Desktop Cart */}
        <motion.div 
          className="hidden lg:block lg:w-1/4 mt-8 lg:mt-0 sticky top-4 self-start"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {isLoggedIn ? (
            isCartLoading ? (
              <div className="flex justify-center items-center h-64">
                <ClipLoader color="#6366F1" size={50} />
              </div>
            ) : (
              <Cart 
                cartItems={cartItems} 
                onCheckout={handleCheckout} 
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            )
          ) : (
            <p className="text-center text-gray-400 italic bg-gray-800 rounded-lg shadow-lg p-6">Please log in to view your cart.</p>
          )}
        </motion.div>

        {/* Mobile Cart Toggle Button */}
        <button
          onClick={toggleMobileCart}
          className="fixed bottom-4 right-4 lg:hidden bg-indigo-600 text-white p-4 rounded-full shadow-lg z-50"
        >
          <FaShoppingCart size={24} />
        </button>

        {/* Mobile Cart Sidebar */}
        <AnimatePresence>
          {isMobileCartOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 bg-gray-800 shadow-lg z-50 lg:hidden overflow-y-auto"
            >
              <button
                onClick={toggleMobileCart}
                className="absolute top-4 right-4 text-gray-300 hover:text-white"
              >
                &times;
              </button>
              <div className="p-4 mt-12">
                {isLoggedIn ? (
                  <Cart 
                    cartItems={cartItems} 
                    onCheckout={handleCheckout} 
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                ) : (
                  <p className="text-center text-gray-400 italic">Please log in to view your cart.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Popup */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`fixed bottom-10 right-10 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2
                ${notification.type === 'success' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
                className="text-white"
              >
                {notification.type === 'success' ? '✓' : '✕'}
              </motion.span>
              <span className="text-white font-medium">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Home;