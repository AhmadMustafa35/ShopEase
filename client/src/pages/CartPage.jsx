import React from 'react';
import { Link } from 'react-router-dom';
import { HiShoppingCart, HiArrowLeft, HiTrash } from 'react-icons/hi2';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Loading from '../components/common/Loading';

const CartPage = () => {
  const { cart, loading, clearCart, cartCount } = useCart();
  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;

  if (loading && items.length === 0) {
    return <Loading text="Loading your shopping cart..." />;
  }

  const isEmpty = items.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEmpty
              ? 'Your cart is currently empty'
              : `You have ${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart`}
          </p>
        </div>

        {!isEmpty && (
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-red-200 w-fit"
          >
            <HiTrash className="w-4 h-4" />
            <span>Clear Entire Cart</span>
          </button>
        )}
      </div>

      {/* Main Cart Content */}
      {isEmpty ? (
        /* Empty Cart View */
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-xs max-w-xl mx-auto px-6">
          <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <HiShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
            Looks like you haven't added anything to your cart yet. Discover great items in our catalog!
          </p>
          <div className="mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Two Column Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>

            {/* Back link */}
            <div className="pt-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <HiArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Cart Summary (Sticky) */}
          <div className="lg:col-span-4 sticky top-24">
            <CartSummary items={items} totalPrice={totalPrice} />
          </div>

        </div>
      )}

    </div>
  );
};

export default CartPage;
