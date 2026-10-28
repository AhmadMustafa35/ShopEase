import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  HiShoppingBag, 
  HiShoppingCart, 
  HiBars3, 
  HiXMark, 
  HiMagnifyingGlass, 
  HiUser, 
  HiArrowRightOnRectangle, 
  HiClipboardDocumentList, 
  HiShieldCheck,
  HiChevronDown
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Handle clicking outside user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm transition-all duration-200">
      {/* Top Banner */}
      <div className="bg-indigo-600 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium">
        <span>✨ Free express shipping on orders over $50! Limited time offer.</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group focus:outline-none flex-shrink-0"
            aria-label="ShopEase Home"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
              <HiShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
              Shop<span className="text-indigo-600">Ease</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search products, brands, and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-12 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <HiMagnifyingGlass className="w-5 h-5" />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-10 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <HiXMark className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute inset-y-1 right-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <HiMagnifyingGlass className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Section: Navigation Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Products link */}
            <Link
              to="/products"
              className="hidden lg:inline-flex text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-md"
            >
              All Products
            </Link>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <HiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[11px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth Buttons */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full sm:rounded-md hover:bg-gray-100 text-gray-700 focus:outline-none transition-colors"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : <HiUser className="w-4 h-4" />}
                  </div>
                  <span className="hidden sm:inline-block text-sm font-medium max-w-[120px] truncate">
                    {user.name || 'Account'}
                  </span>
                  <HiChevronDown className="hidden sm:inline-block w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <HiClipboardDocumentList className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                      My Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-600 font-medium hover:bg-indigo-50 transition-colors"
                      >
                        <HiShieldCheck className="w-4 h-4 text-indigo-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <HiArrowRightOnRectangle className="w-4 h-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-md focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative px-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
                <HiMagnifyingGlass className="w-5 h-5" />
              </div>
            </form>

            <nav className="flex flex-col space-y-1 px-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                All Products
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
              >
                <span>Shopping Cart</span>
                {cartCount > 0 && (
                  <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out ({user.name})
                  </button>
                </>
              ) : (
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
