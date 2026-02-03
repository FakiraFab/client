import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orders';
import { useToast } from '../../context/ToastContext';
import Seo from '../../components/Seo/Seo';
import type { Order, OrderStatus } from '../../types/order';

const OrderHistory: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        limit: ordersPerPage,
      };
      
      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const response = await orderApi.getOrders(params);
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load orders',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const getStatusBadgeColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      paid: 'text-green-600',
      pending: 'text-yellow-600',
      failed: 'text-red-600',
      refunded: 'text-blue-600',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title="Order History - Fakira FAB"
        description="View and track your orders"
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="mt-2 text-gray-600">View and track all your orders</p>
          </div>

          {/* Status Filter */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusChange('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === ''
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => handleStatusChange('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === 'pending'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusChange('confirmed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === 'confirmed'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => handleStatusChange('processing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === 'processing'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => handleStatusChange('shipped')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === 'shipped'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => handleStatusChange('delivered')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === 'delivered'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === 'cancelled'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="mt-2 text-gray-600">Start shopping to see your orders here</p>
              <Link
                to="/all-products"
                className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  to={`/account/orders/${order._id}`}
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Items</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Payment Status</p>
                        <p className={`text-sm font-medium mt-1 ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Payment Method</p>
                        <p className="text-sm font-medium text-gray-900 mt-1 uppercase">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </p>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.trackingNumber && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 uppercase">Tracking Number</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{order.trackingNumber}</p>
                        {order.shippingProvider && (
                          <p className="text-xs text-gray-600 mt-1">via {order.shippingProvider}</p>
                        )}
                      </div>
                    )}

                    {/* Expected Delivery */}
                    {order.estimatedDelivery && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Expected delivery by{' '}
                          <span className="font-medium text-gray-900">
                            {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}

              {/* Load More Button */}
              {orders.length >= ordersPerPage && (
                <div className="text-center py-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="px-8 py-3 bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isLoading ? 'Loading...' : 'Load More Orders'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
