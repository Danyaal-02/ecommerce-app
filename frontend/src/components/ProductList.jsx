import React from 'react';
import { motion } from 'framer-motion';
import ProductItem from './ProductItem';

const ProductList = ({ products, onAddToCart, isLoggedIn }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <p className="text-center text-gray-400 my-8">No products available.</p>;
  }

  return (
    <motion.div 
      className="space-y-8 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Our Products
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          product && <ProductItem key={product._id} product={product} onAddToCart={onAddToCart} isLoggedIn={isLoggedIn} />
        ))}
      </div>
    </motion.div>
  );
};

export default ProductList;