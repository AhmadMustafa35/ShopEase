import React, { useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineUser,
} from 'react-icons/hi2';

const AdminLayout = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation items definition
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: HiOutlineHome,
      end: true,
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: HiOutlineCube,
      end: false,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: HiOutlineShoppingCart,
      end: false,
    },
  ];

  // Determine page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/products/new')) return 'Add New Product';
    if (path.includes('/admin/products/') && path.endsWith('/edit')) return 'Edit Product';
    if (path.startsWith('/admin/products')) return 'Product Management';
    if (path.startsWith('/admin/orders/') && path !== '/admin/orders') return 'Order Details';
    if (path.startsWith('/admin/orders')) return 'Order Management';
    return 'Admin Panel';
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Section */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <Link to="/admin" onClick={closeMobileMenu} className="block">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                Shop<span className="text-indigo-500">Ease</span>
              </span>
              <span className="bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Admin
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 font-medium">Store Control Center</p>
          </Link>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close menu"
          >
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800 space-y-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <HiOutlineArrowLeftOnRectangle className="w-5 h-5 flex-shrink-0" />
            <span>Back to Store</span>
          </Link>

          <div className="px-4 py-3 bg-gray-800/60 rounded-lg flex items-center gap-3 border border-gray-800">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : <HiOutlineUser className="w-5 h-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 leading-tight">Logged in as</p>
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin User'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-gray-600 hover:text-gray-900 p-2 -ml-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open sidebar"
            >
              <HiOutlineBars3 className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
            </div>
          </div>

          {/* Top Navbar Right Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs border border-indigo-200">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-gray-800 leading-tight">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-gray-500">{user?.email || 'admin@shopease.com'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Nested Route View */}
        <main className="p-6 sm:p-8 bg-gray-100 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
