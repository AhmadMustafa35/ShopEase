import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HiCheckCircle, 
  HiShoppingBag, 
  HiTruck, 
  HiMapPin, 
  HiCalendar, 
  HiClipboardDocumentCheck,
  HiArrowRight,
  HiPhoto
} from 'react-icons/hi2';
import { getOrder, getImageUrl } from '../services/api';
import Loading from '../components/common/Loading';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      try {
        const res = await getOrder(id);
        if (isMounted && res?.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Failed to retrieve order confirmation details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loading text="Retrieving your order confirmation..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      {/* Success Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-2 shadow-xs animate-in zoom-in-75 duration-300">
          <HiCheckCircle className="w-14 h-14" />
        </div>
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
          Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
          We’ve received your order and have already begun preparing it for delivery.
        </p>

        {/* Order Reference Badge */}
        {order?.orderRef && (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 border border-gray-200 mt-2">
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Order Reference:</span>
            <span className="text-sm sm:text-base font-extrabold text-indigo-600 font-mono tracking-wide">
              {order.orderRef}
            </span>
          </div>
        )}
      </div>

      {/* Order Details Container */}
      <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Meta Bar */}
        <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <HiCalendar className="w-4 h-4 text-gray-400" />
            <span>Placed on: {order?.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Today'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Payment:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium text-xs">
              {order?.paymentMethod || 'Cash on Delivery'}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Purchased Items List */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Items Purchased
            </h3>
            <div className="divide-y divide-gray-100">
              {order?.items?.map((item, index) => (
                <div key={index} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
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
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      ${Number(item.price || 0).toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Cost Breakdown Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            {/* Delivery address */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <HiMapPin className="w-4 h-4 text-indigo-600" />
                <span>Shipping Address</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{order?.deliveryInfo?.fullName}</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {order?.deliveryInfo?.address}<br />
                {order?.deliveryInfo?.city}
              </p>
              <p className="text-xs text-gray-500 pt-1">
                Phone: {order?.deliveryInfo?.phone}
              </p>
            </div>

            {/* Total summary */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-2.5 text-sm">
              <h4 className="font-bold text-gray-900">Payment Breakdown</h4>
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Shipping:</span>
                <span className="text-emerald-600 font-semibold uppercase">Free</span>
              </div>
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Payment Mode:</span>
                <span className="font-medium text-gray-700">Cash on Delivery</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-gray-900">Total Due:</span>
                <span className="text-xl font-extrabold text-indigo-600">
                  ${Number(order?.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Action CTA Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        {order?._id && (
          <Link
            to={`/orders/${order._id}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-colors text-center shadow-xs"
          >
            View Order Status
          </Link>
        )}
        <Link
          to="/products"
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors text-center shadow-sm flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default OrderConfirmationPage;
