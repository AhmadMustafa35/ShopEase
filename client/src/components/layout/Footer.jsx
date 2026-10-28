import React from 'react';
import { Link } from 'react-router-dom';
import { HiShoppingBag, HiEnvelope, HiPhone, HiMapPin } from 'react-icons/hi2';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub, FaCreditCard, FaTruck, FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto border-t border-gray-800">
      {/* Trust Badges Strip */}
      <div className="border-b border-gray-800 py-8 bg-gray-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <FaTruck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Free Global Delivery</h4>
                <p className="text-xs text-gray-400 mt-0.5">On all orders exceeding $50</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Secure Payment</h4>
                <p className="text-xs text-gray-400 mt-0.5">100% encrypted & secure checkout</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                <FaCreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Cash on Delivery</h4>
                <p className="text-xs text-gray-400 mt-0.5">Pay conveniently upon package arrival</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <HiShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Shop<span className="text-indigo-500">Ease</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              ShopEase is your modern e-commerce destination for curated lifestyle, tech, and home essentials. Quality products, fast shipping, and transparent prices.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-indigo-600 flex items-center justify-center transition-colors">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-indigo-600 flex items-center justify-center transition-colors">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-indigo-600 flex items-center justify-center transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-indigo-600 flex items-center justify-center transition-colors">
                <FaGithub className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Shop Links */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Shop Categories</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="hover:text-white transition-colors">Electronics & Gadgets</Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-white transition-colors">Fashion & Apparel</Link>
              </li>
              <li>
                <Link to="/products?category=Home" className="hover:text-white transition-colors">Home & Living</Link>
              </li>
              <li>
                <Link to="/products?category=Books" className="hover:text-white transition-colors">Books & Media</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Customer Care</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">Track Your Order</Link>
              </li>
              <li>
                <a href="#shipping" className="hover:text-white transition-colors">Shipping & Delivery Rates</a>
              </li>
              <li>
                <a href="#returns" className="hover:text-white transition-colors">30-Day Easy Returns</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase mb-2">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <HiMapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>123 Commerce Blvd, Innovation Park, CA 94016</span>
              </li>
              <li className="flex items-center gap-3">
                <HiPhone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span>+1 (800) 555-SHOP (7467)</span>
              </li>
              <li className="flex items-center gap-3">
                <HiEnvelope className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span>support@shopease.example.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 ShopEase Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-white transition-colors">Cookie Preferences</a>
            <a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
