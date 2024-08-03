import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/api';
import { motion } from 'framer-motion';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8 text-indigo-400">Loading orders...</div>;
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
          Your Orders
        </h2>
        
        {orders.length === 0 ? (
          <p className="text-center text-gray-400 italic">You haven't placed any orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, index) => (
              <OrderItem key={order._id} order={order} index={index} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const OrderItem = ({ order, index }) => {
  if (!order || typeof order !== 'object') {
    return null;
  }

  const {
    _id,
    status,
    createdAt,
    products,
    totalAmount
  } = order;

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.error('Invalid date:', dateString);
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-800 text-green-200';
      case 'shipped': return 'bg-blue-800 text-blue-200';
      case 'delivered': return 'bg-purple-800 text-purple-200';
      default: return 'bg-yellow-800 text-yellow-200';
    }
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg p-4 shadow-md flex flex-col h-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-indigo-300">Order #{_id}</h2>
        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
        </span>
      </div>
      <p className="text-gray-400 mb-4">Ordered on: {formatDate(createdAt)}</p>
      <div className="space-y-3 flex-grow">
        {Array.isArray(products) ? products.map((item, index) => (
          <OrderProductItem key={item._id || index} item={item} />
        )) : (
          <p className="text-gray-400 italic">No product information available</p>
        )}
      </div>
      <div className="border-t border-gray-700 mt-4 pt-4">
        <div className="flex justify-between items-center font-bold">
          <span>Total:</span>
          <span className="text-indigo-300">${typeof totalAmount === 'number' ? totalAmount.toFixed(2) : 'N/A'}</span>
        </div>
      </div>
    </motion.div>
  );
};

const OrderProductItem = ({ item }) => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const { product, quantity } = item;

  if (!product || typeof product !== 'object') {
    return <div className="text-gray-400 italic">Invalid product data</div>;
  }

  const { name, price } = product;

  return (
    <div className="flex justify-between items-center text-gray-300">
      <span className="truncate flex-grow mr-2">{name || 'Unknown Product'} x {quantity || 0}</span>
      <span className="text-indigo-300 whitespace-nowrap">${typeof price === 'number' && typeof quantity === 'number' 
        ? (price * quantity).toFixed(2) 
        : 'N/A'}</span>
    </div>
  );
};

export default Orders;