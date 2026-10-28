import React from 'react';
import { Link } from 'react-router-dom';
import { HiLockClosed, HiArrowRight, HiShieldCheck } from 'react-icons/hi2';

const CartSummary = ({ items = [], totalPrice = 0 }) => {
  const itemCount = items.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const formattedSubtotal = Number(totalPrice).toFixed(2);
  const shippingCost = 0.00; // Free shipping
  const estimatedTax = 0.00; // Included or calculated at checkout
  const grandTotal = Number(totalPrice + shippingCost + estimatedTax).toFixed(2);

  const isCartEmpty = items.length === 0;

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200/80 p-6 sm:p-7 shadow-xs space-y-6">
      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">
        Order Summary
      </h2>

      {/* Breakdown Details */}
      <div className="space-y-3.5 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Items Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):</span>
          <span className="font-semibold text-gray-900">${formattedSubtotal}</span>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <span className="flex items-center gap-1.5">
            Standard Delivery:
          </span>
          <span className="font-semibold text-emerald-600 uppercase text-xs tracking-wider">
            FREE
          </span>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <span>Payment Method:</span>
          <span className="font-medium text-gray-700">Cash on Delivery</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-base font-bold text-gray-900">Total Amount:</span>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-indigo-600">${grandTotal}</span>
            <p className="text-xs text-gray-400 mt-0.5">Taxes included if applicable</p>
          </div>
        </div>
      </div>

      {/* Primary Checkout CTA */}
      <div className="space-y-3 pt-2">
        <Link
          to={isCartEmpty ? '#' : '/checkout'}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-base shadow-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            isCartEmpty
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md'
          }`}
        >
          <span>Proceed to Checkout</span>
          <HiArrowRight className="w-5 h-5" />
        </Link>

        <div className="text-center">
          <Link
            to="/products"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors inline-block pt-1"
          >
            or Continue Shopping
          </Link>
        </div>
      </div>

      {/* Trust & Guarantee */}
      <div className="border-t border-gray-200/80 pt-5 space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <HiLockClosed className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Encrypted and secure checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <HiShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>30-day money-back guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
