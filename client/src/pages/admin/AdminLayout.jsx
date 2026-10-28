import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  HiShoppingBag, 
  HiChartBar, 
  HiTag, 
  HiClipboardDocumentList, 
  HiArrowLeftOnRectangle, 
  HiArrowUturnLeft,
  HiBars3,
  HiXMark
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: HiChartBar, end: true },
    { name: 'Manage Products', path: '/admin/products', icon: HiTag, end: false },
    { name: 'Manage Orders', path: '/admin/orders', icon: HiClipboardDocumentList, end: false },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between shadow-md">
        <Link to="/admin" className="flex items-center gap-2 font-bold text-lg text-white">
          <HiShoppingBag className="w-6 h-6 text-indigo-400" />
          <span>ShopEase Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-300 hover:text-white rounded-lg focus:outline-none"
          aria-label="Toggle admin sidebar"
        >
          {sidebarOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile drawer */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-gray-900 text-gray-300 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-gray-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <HiShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-none">ShopEase</h2>
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
          >
            <HiArrowUturnLeft className="w-5 h-5 text-gray-400" />
            <span>Customer Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
          >
            <HiArrowLeftOnRectangle className="w-5 h-5" />
            <span>Sign Out ({user?.name || 'Admin'})</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
