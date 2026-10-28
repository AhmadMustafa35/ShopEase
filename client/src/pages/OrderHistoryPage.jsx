import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiClipboardDocumentList, 
  HiCalendar, 
  HiChevronRight, 
  HiArrowRight,
  HiClock,
  HiPhoto
} from 'react-icons/hi2';
import { getMyOrders, getImageUrl } from '../services/api';
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

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        if (isMounted && res?.success && Array.isArray(res.orders)) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Failed to fetch user orders:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <Loading text="Fetching your order history..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Header */}
      <div className="mb-8 border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Check the status of current and past orders
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-xs max-w-lg mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <HiClipboardDocumentList className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">No orders found</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
            You haven't placed any orders yet. Discover our latest items!
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
            >
              <span>Explore Products</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recent';

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Order Top Meta */}
                <div className="bg-gray-50/70 p-4 sm:px-6 sm:py-3.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div>
                      <span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold">Order ID</span>
                      <span className="font-mono font-bold text-gray-900">{order.orderRef || order._id}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold">Date Placed</span>
                      <span className="font-medium text-gray-700">{formattedDate}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold">Total</span>
                      <span className="font-bold text-indigo-600">${Number(order.totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-2 sm:pb-0">
                    {order.items?.slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        title={`${item.name} (${item.quantity}x)`}
                        className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 relative flex items-center justify-center group"
                      >
                        {item.image ? (
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <HiPhoto className="w-6 h-6 text-gray-300" />
                        )}
                        <span className="absolute bottom-0 right-0 bg-gray-900/80 text-white text-[10px] px-1 rounded-tl font-bold">
                          ×{item.quantity}
                        </span>
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                        +{order.items.length - 4} more
                      </div>
                    )}
                  </div>

                  {/* View Details Link */}
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-indigo-600 text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors self-end sm:self-center"
                  >
                    <span>View Order Details</span>
                    <HiChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default OrderHistoryPage;
