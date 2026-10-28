import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HiChevronRight, 
  HiArrowLeft, 
  HiMapPin, 
  HiCalendar, 
  HiTruck, 
  HiShieldCheck, 
  HiPhone, 
  HiUser,
  HiPhoto
} from 'react-icons/hi2';
import { getOrder, getImageUrl } from '../services/api';
import Loading from '../components/common/Loading';

const getStatusBadgeClass = (status = '') => {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'processing':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'shipped':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOrderDetails = async () => {
      try {
        const res = await getOrder(id);
        if (isMounted && res?.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Failed to fetch order details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrderDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loading text="Loading order information..." />;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-gray-500 mt-2">Could not locate the requested order details.</p>
        <Link
          to="/orders"
          className="mt-6 inline-block px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm text-gray-500 gap-1.5">
        <Link to="/orders" className="hover:text-indigo-600 transition-colors">
          Orders
        </Link>
        <HiChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-semibold font-mono">
          {order.orderRef || order._id}
        </span>
      </nav>

      {/* Order Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-mono">
              Order #{order.orderRef || order._id}
            </h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusBadgeClass(
                order.status
              )}`}
            >
              {order.status || 'Pending'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-2">
            <HiCalendar className="w-4 h-4 text-gray-400" />
            <span>Placed on {orderDate}</span>
          </p>
        </div>

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors self-start md:self-center"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Main Grid: Items and Delivery Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
            Items in This Order ({order.items?.length || 0})
          </h2>

          <div className="divide-y divide-gray-100">
            {order.items?.map((item, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <HiPhoto className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Quantity: <span className="font-bold text-gray-700">{item.quantity}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-gray-900 block">
                    ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ${Number(item.price || 0).toFixed(2)} each
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Delivery & Payment Details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Delivery Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-base border-b border-gray-100 pb-3">
              <HiMapPin className="w-5 h-5" />
              <h3 className="text-gray-900">Delivery Address</h3>
            </div>
            <div className="text-sm space-y-1.5 text-gray-600">
              <p className="font-bold text-gray-900 flex items-center gap-1.5">
                <HiUser className="w-4 h-4 text-gray-400" />
                <span>{order.deliveryInfo?.fullName}</span>
              </p>
              <p className="leading-relaxed pl-5">
                {order.deliveryInfo?.address}<br />
                {order.deliveryInfo?.city}
              </p>
              <p className="pt-2 pl-5 text-xs text-gray-500 flex items-center gap-1.5">
                <HiPhone className="w-3.5 h-3.5 text-gray-400" />
                <span>{order.deliveryInfo?.phone}</span>
              </p>
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-4 text-sm">
            <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-3">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-gray-600">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-semibold text-gray-900">{order.paymentMethod || 'Cash on Delivery'}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold text-emerald-600 uppercase text-xs">FREE</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
              <span className="font-bold text-gray-900 text-base">Total Amount:</span>
              <span className="text-2xl font-black text-indigo-600">
                ${Number(order.totalAmount || 0).toFixed(2)}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetailPage;
