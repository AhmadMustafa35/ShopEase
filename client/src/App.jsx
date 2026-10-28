import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Customer Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import AddEditProductPage from './pages/admin/AddEditProductPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';

// Customer Layout with Sticky Header & Footer
const StorefrontLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// 404 Fallback
const NotFoundPage = () => (
  <div className="max-w-2xl mx-auto px-4 py-24 text-center">
    <span className="text-6xl font-black text-indigo-600">404</span>
    <h1 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h1>
    <p className="text-gray-500 mt-2">
      Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
    </p>
    <Link
      to="/"
      className="mt-6 inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
    >
      Return to Home
    </Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid #f3f4f6',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />

        {/* Route Definitions */}
        <Routes>
          {/* Customer Facing Storefront Routes */}
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Protected Customer Routes */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation/:id"
              element={
                <ProtectedRoute>
                  <OrderConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Routes with Nested AdminLayout */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ManageProductsPage />} />
            <Route path="products/new" element={<AddEditProductPage />} />
            <Route path="products/:id/edit" element={<AddEditProductPage />} />
            <Route path="orders" element={<ManageOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
