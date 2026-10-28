import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HiArrowLeft, 
  HiMapPin, 
  HiCalendar, 
  HiUser, 
  HiPhone, 
  HiPhoto
} from 'react-icons/hi2';
import { getAdminOrder, updateOrderStatus, getImageUrl } from '../../services/api';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('pending');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      try {
        const res = await getAdminOrder(id);
        if (isMounted && res?.success && res.order) {
          setOrder(res.order);
          setCurrentStatus(res.order.status || 'pending');
        }
      } catch (err) {
        toast.error('Failed to load order details');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await updateOrderStatus(id, newStatus);
      if (res?.success) {
        setCurrentStatus(newStatus);
        toast.success(`Order marked as ${newStatus}`);
      }
    } catch (err) {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loading text="Loading order management record..." />;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link to="/admin/orders" className="text-indigo-600 font-semibold mt-2 inline-block">
          Return to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/orders"
          className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:text-indigo-600 shadow-xs transition-colors"
        >
          <HiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-mono tracking-tight">
            Order #{order.orderRef || order._id}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Items breakdown */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">
            Ordered Line Items ({order.items?.length || 0})
          </h2>

          <div className="divide-y divide-gray-100">
            {order.items?.map((item, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <HiPhoto className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">
                    ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">${Number(item.price || 0).toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
            <span className="font-bold text-gray-900">Total Charged:</span>
            <span className="text-2xl font-black text-indigo-600">${Number(order.totalAmount || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Right: Status and Customer Delivery */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Updater Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Fulfillment Status</h3>
            <select
              value={currentStatus.toLowerCase()}
              disabled={updating}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Customer Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">Customer & Shipping</h3>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <HiUser className="w-4 h-4 text-gray-400" />
              <span>{order.deliveryInfo?.fullName}</span>
            </p>
            <p className="text-xs text-gray-600 pl-6 leading-relaxed">
              {order.deliveryInfo?.address}<br />
              {order.deliveryInfo?.city}
            </p>
            <p className="text-xs text-gray-500 pl-6 flex items-center gap-2 pt-1">
              <HiPhone className="w-3.5 h-3.5 text-gray-400" />
              <span>{order.deliveryInfo?.phone}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
