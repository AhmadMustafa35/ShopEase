import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  HiLockClosed, 
  HiTruck, 
  HiExclamationCircle, 
  HiShieldCheck, 
  HiBuildingStorefront, 
  HiUser, 
  HiPhone, 
  HiMapPin, 
  HiBuildingOffice2,
  HiPhoto
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { placeOrder, getImageUrl } from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const totalPrice = cart?.totalPrice || 0;

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  // Client validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+()-\s]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please provide a valid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (items.length === 0) {
      toast.error('Your cart is empty. Add products before checking out.');
      navigate('/products');
      return;
    }

    if (!validateForm()) {
      toast.error('Please complete all required shipping fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
      };

      const res = await placeOrder(payload);

      if (res?.success && res.order) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${res.order._id}`);
      } else {
        setServerError(res?.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Order submission failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'Error processing your order. Please try again.';
      setServerError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-gray-500 mt-2">There are no items to checkout.</p>
        <Link
          to="/products"
          className="mt-6 inline-block px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Checkout
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete your delivery details to place your Cash on Delivery order
        </p>
      </div>

      {serverError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
          <HiExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Delivery Information Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <HiTruck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Delivery Information</h2>
                <p className="text-xs text-gray-500">Enter where we should ship your package</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1">
                  Recipient Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <HiUser className="w-5 h-5" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Johnathan Smith"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                      errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <HiPhone className="w-5 h-5" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +1 (555) 019-2834"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                      errors.phone ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              {/* Delivery Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">
                  Street Address / Apartment <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute top-3 left-3.5 flex items-center pointer-events-none text-gray-400">
                    <HiMapPin className="w-5 h-5" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                      errors.address ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1">
                  City / Town <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <HiBuildingOffice2 className="w-5 h-5" />
                  </div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Springfield"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                      errors.city ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3 mt-6">
              <HiShieldCheck className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-indigo-900">Payment on Delivery (COD)</h4>
                <p className="text-xs text-indigo-700 mt-0.5 leading-relaxed">
                  You do not need to make an online payment now. You will pay the courier in cash or via mobile payment upon delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">
                Order Review ({items.length} items)
              </h2>

              {/* Items List Preview */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.product?.image ? (
                          <img
                            src={getImageUrl(item.product.image)}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <HiPhoto className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-xs sm:text-sm">
                          {item.product?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × ${Number(item.product?.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 flex-shrink-0 text-sm">
                      ${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Totals */}
              <div className="space-y-3 pt-4 border-t border-gray-200 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">${Number(totalPrice).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="font-semibold text-emerald-600 uppercase text-xs">FREE</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Payment Mode:</span>
                  <span className="font-medium text-gray-800">Cash on Delivery</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-gray-200 flex items-baseline justify-between">
                <span className="text-base font-bold text-gray-900">Order Total:</span>
                <span className="text-2xl font-black text-indigo-600">
                  ${Number(totalPrice).toFixed(2)}
                </span>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <HiLockClosed className="w-5 h-5" />
                    <span>Place Order (Pay on Delivery)</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/cart"
                  className="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  ← Edit items in cart
                </Link>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
