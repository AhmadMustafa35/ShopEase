import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiMagnifyingGlass, HiEye } from 'react-icons/hi2';
import { getAdminOrders, updateOrderStatus } from '../../services/api';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getAdminOrders({
        status: statusFilter,
        search: searchTerm,
      });
      if (res?.success && Array.isArray(res.orders)) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchTerm]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res?.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Manage Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review placed orders, update shipping progress, and inspect customer details
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <HiMagnifyingGlass className="w-5 h-5 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ref or customer..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <Loading text="Loading order records..." />
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No customer orders found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-5">Ref / ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-5 font-mono font-bold text-gray-900">
                      {order.orderRef || order._id}
                    </td>
                    <td className="py-4 px-4 text-xs">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{order.deliveryInfo?.fullName || 'Customer'}</p>
                      <p className="text-xs text-gray-400">{order.deliveryInfo?.city}</p>
                    </td>
                    <td className="py-4 px-4 font-bold text-indigo-600">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={order.status?.toLowerCase() || 'pending'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="py-1 px-2.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:text-indigo-600 hover:border-indigo-600 transition-colors"
                      >
                        <HiEye className="w-4 h-4" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrdersPage;
