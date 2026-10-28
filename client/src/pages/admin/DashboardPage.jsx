import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiCurrencyDollar, 
  HiShoppingBag, 
  HiClipboardDocumentList, 
  HiClock,
  HiArrowRight,
  HiPlus
} from 'react-icons/hi2';
import { getAdminStats, getAdminOrders } from '../../services/api';
import Loading from '../../components/common/Loading';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.allSettled([
          getAdminStats(),
          getAdminOrders({ limit: 5 }),
        ]);

        if (isMounted) {
          if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
            setStats(statsRes.value.stats || statsRes.value);
          }
          if (ordersRes.status === 'fulfilled' && ordersRes.value?.success) {
            setRecentOrders(ordersRes.value.orders || []);
          }
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <Loading text="Loading admin analytics..." />;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${Number(stats.totalSales || stats.totalRevenue || 0).toFixed(2)}`,
      icon: HiCurrencyDollar,
      bgColor: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: HiClipboardDocumentList,
      bgColor: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Active Products',
      value: stats.totalProducts || 0,
      icon: HiShoppingBag,
      bgColor: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders || 0,
      icon: HiClock,
      bgColor: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Store Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time statistics & quick admin actions</p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
        >
          <HiPlus className="w-5 h-5" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bgColor}`}>
              <card.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Customer Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest transactions placed in your store</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {order.orderRef || order._id}
                    </td>
                    <td className="py-3.5 px-4 text-gray-800">{order.deliveryInfo?.fullName || 'Customer'}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-600">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 capitalize">
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs"
                      >
                        Manage →
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

export default DashboardPage;
