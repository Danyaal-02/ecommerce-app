import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import ProductModal from '../components/ProductModal';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaBox, FaInfoCircle, FaDollarSign, FaWarehouse } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    addProduct: false,
    updateProduct: false,
    deleteProduct: {},
    editProduct: {}
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingStates(prev => ({ ...prev, addProduct: true }));
    try {
      await createProduct(formData);
      setFormData({ name: '', description: '', price: '', stockQuantity: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, addProduct: false }));
    }
  };

  const handleUpdate = (product) => {
    setEditingProductId(product._id);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
    });
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoadingStates(prev => ({ ...prev, updateProduct: true }));
    try {
      await updateProduct(editingProductId, editFormData);
      setIsModalOpen(false);
      setEditingProductId(null);
      setEditFormData({ name: '', description: '', price: '', stockQuantity: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, updateProduct: false }));
    }
  };

  const handleDelete = async (id) => {
    setLoadingStates(prev => ({
      ...prev,
      deleteProduct: { ...prev.deleteProduct, [id]: true }
    }));
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        deleteProduct: { ...prev.deleteProduct, [id]: false }
      }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    setEditFormData({ name: '', description: '', price: '', stockQuantity: '' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 py-6 sm:py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-8 sm:mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Product Management
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 sm:mb-16">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-indigo-400 flex items-center">
                  <FaPlus className="mr-2" /> Add New Product
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center bg-gray-700 rounded-md">
                      <FaBox className="text-indigo-400 ml-3" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Product Name"
                        className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
                        required
                      />
                    </div>
                    <div className="flex items-center bg-gray-700 rounded-md">
                      <FaInfoCircle className="text-indigo-400 ml-3" />
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
                        required
                      />
                    </div>
                    <div className="flex items-center bg-gray-700 rounded-md">
                      <FaDollarSign className="text-indigo-400 ml-3" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
                        required
                      />
                    </div>
                    <div className="flex items-center bg-gray-700 rounded-md">
                      <FaWarehouse className="text-indigo-400 ml-3" />
                      <input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        placeholder="Stock Quantity"
                        className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:from-indigo-600 hover:to-purple-700 transition duration-300 flex items-center justify-center"
                    disabled={loadingStates.addProduct}
                  >
                    {loadingStates.addProduct ? <ClipLoader color="#ffffff" size={20} /> : (
                      <>
                        <FaPlus className="mr-2" /> Add Product
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-indigo-400">Product List</h3>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <ClipLoader color="#6366f1" size={50} />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-2 sm:px-4 py-2 text-left text-indigo-400">Name</th>
                          <th className="px-2 sm:px-4 py-2 text-left text-indigo-400 hidden sm:table-cell">Description</th>
                          <th className="px-2 sm:px-4 py-2 text-left text-indigo-400">Price</th>
                          <th className="px-2 sm:px-4 py-2 text-left text-indigo-400 hidden sm:table-cell">Stock</th>
                          <th className="px-2 sm:px-4 py-2 text-left text-indigo-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <motion.tr 
                            key={product._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                          >
                            <td className="px-2 sm:px-4 py-3">{product.name || 'Unnamed Product'}</td>
                            <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">{product.description || 'No description'}</td>
                            <td className="px-2 sm:px-4 py-3">
                              {product.price != null ? `$${product.price.toFixed(2)}` : 'N/A'}
                            </td>
                            <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">{product.stockQuantity ?? 'N/A'}</td>
                            <td className="px-2 sm:px-4 py-3">
                              <button
                                onClick={() => handleUpdate(product)}
                                className="bg-blue-600 text-white p-1 sm:p-2 rounded-full mr-1 sm:mr-2 hover:bg-blue-700 transition duration-300"
                                disabled={loadingStates.editProduct[product._id] || loadingStates.deleteProduct[product._id]}
                              >
                                {loadingStates.editProduct[product._id] ? (
                                  <ClipLoader color="#ffffff" size={14} />
                                ) : (
                                  <FaEdit />
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="bg-red-600 text-white p-1 sm:p-2 rounded-full hover:bg-red-700 transition duration-300"
                                disabled={loadingStates.editProduct[product._id] || loadingStates.deleteProduct[product._id]}
                              >
                                {loadingStates.deleteProduct[product._id] ? (
                                  <ClipLoader color="#ffffff" size={14} />
                                ) : (
                                  <FaTrash />
                                )}
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Edit Product"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div className="flex items-center bg-gray-700 rounded-md">
            <FaBox className="text-indigo-400 ml-3" />
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditInputChange}
              placeholder="Product Name"
              className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
              required
            />
          </div>
          <div className="flex items-center bg-gray-700 rounded-md">
            <FaInfoCircle className="text-indigo-400 ml-3" />
            <input
              type="text"
              name="description"
              value={editFormData.description}
              onChange={handleEditInputChange}
              placeholder="Description"
              className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
              required
            />
          </div>
          <div className="flex items-center bg-gray-700 rounded-md">
            <FaDollarSign className="text-indigo-400 ml-3" />
            <input
              type="number"
              name="price"
              value={editFormData.price}
              onChange={handleEditInputChange}
              placeholder="Price"
              className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
              required
            />
          </div>
          <div className="flex items-center bg-gray-700 rounded-md">
            <FaWarehouse className="text-indigo-400 ml-3" />
            <input
              type="number"
              name="stockQuantity"
              value={editFormData.stockQuantity}
              onChange={handleEditInputChange}
              placeholder="Stock Quantity"
              className="w-full px-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-md hover:from-indigo-600 hover:to-purple-700 transition duration-300 flex items-center justify-center"
            disabled={loadingStates.updateProduct}
          >
            {loadingStates.updateProduct ? <ClipLoader color="#ffffff" size={20} /> : 'Update Product'}
          </button>
        </form>
      </ProductModal>
    </motion.div>
  );
};

export default ProductManagement;