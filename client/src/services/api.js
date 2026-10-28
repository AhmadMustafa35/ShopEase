import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopease_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('shopease_token');
      localStorage.removeItem('token');
      // Only redirect if not already on login/register page
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

/* ===============================
   AUTH API
================================ */
export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/* ===============================
   PRODUCTS API
================================ */
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;
};

/* ===============================
   CART API
================================ */
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart', { productId, quantity });
  return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/${itemId}`, { quantity });
  return response.data;
};

export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data;
};

/* ===============================
   ORDERS API
================================ */
export const placeOrder = async (deliveryInfo) => {
  const response = await api.post('/orders', deliveryInfo);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

/* ===============================
   ADMIN API
================================ */
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAdminProducts = async (params = {}) => {
  const response = await api.get('/admin/products', { params });
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};

export const getAdminOrders = async (params = {}) => {
  const response = await api.get('/admin/orders', { params });
  return response.data;
};

export const getAdminOrder = async (id) => {
  const response = await api.get(`/admin/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/admin/orders/${id}/status`, { status });
  return response.data;
};

/* ===============================
   HELPER UTILITIES
================================ */
export const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === 'no-image.jpg') {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const backendBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
  if (imagePath.startsWith('/uploads/')) {
    return `${backendBase}${imagePath}`;
  }
  if (imagePath.startsWith('uploads/')) {
    return `${backendBase}/${imagePath}`;
  }
  if (imagePath.startsWith('/')) {
    return `${backendBase}/uploads${imagePath}`;
  }
  return `${backendBase}/uploads/${imagePath}`;
};

export default api;
