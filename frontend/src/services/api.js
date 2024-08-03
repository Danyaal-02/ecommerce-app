import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('token'));
  if (token && new Date().getTime() < token.expiresAt) {
    config.headers.Authorization = `Bearer ${token.token}`;
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const register = (name, email, password, role) => 
  api.post('/auth/register', { name, email, password, role });

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, userRole, userName } = response.data; 
    
    if (token && userRole && userName) {
      const expiresAt = new Date().getTime() + 30 * 60 * 1000; // 30 minutes from now
      localStorage.setItem('token', JSON.stringify({ token, expiresAt }));
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userName', userName);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Products
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const createProduct = (product) => api.post('/products', product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity) => api.post('/cart', { productId, quantity });
export const updateCartItemQuantity = (productId, quantity) => api.put(`/cart/${productId}`, { quantity });
export const removeCartItem = (productId) => api.delete(`/cart/${productId}`);

// Orders
export const createOrder = async (paymentIntentId) => {
  const response = await api.post('/orders', { paymentIntentId });
  return response.data;
};

export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// User Sessions
export const getUserSessions = async () => {
  try {
    const response = await api.get('/sessions/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    throw error;
  }
};

// Payments
export const createPaymentIntent = async (amount, cartItems, paySessionId) => {
  try {
    const response = await api.post('/payments/create-payment-intent', { amount, cartItems, paySessionId });
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};