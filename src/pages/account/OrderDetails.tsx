import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderApi } from '../../api/orders';
import { useToast } from '../../context/ToastContext';
import Seo from '../../components/Seo/Seo';
import type { Order, OrderStatus, PaymentStatus } from '../../types/order';

const OrderDetails: React.FC = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await orderApi.getOrder(orderId!);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError('Order not found');
      }
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      setError(err.response?.data?.message || 'Failed to load order details');
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load order details',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Please select a cancellation reason',
        duration: 3000,
      });
      return;
    }

    if (cancelReason === 'other' && !otherReason.trim()) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Please provide a reason',
        duration: 3000,
      });
      return;
    }

    try {
      setIsCancelling(true);
      const reason = cancelReason === 'other' ? otherReason : cancelReason;
      const response = await orderApi.cancelOrder(orderId!, { reason });
      
      if (response.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: 'Order cancelled successfully',
          duration: 5000,
        });
        setShowCancelModal(false);
        fetchOrderDetails();
      }
    } catch (err: any) {
      console.error('Error cancelling order:', err);
      showToast({
        type: 'error',
        title: 'Error',
        message: err.response?.data?.message || 'Failed to cancel order',
        duration: 5000,
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadgeColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-500 text-white',
      confirmed: 'bg-blue-500 text-white',
      processing: 'bg-blue-600 text-white',
      shipped: 'bg-green-500 text-white',
      delivered: 'bg-green-600 text-white',
      cancelled: 'bg-red-500 text-white',
      returned: 'bg-gray-500 text-white',
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const badges = {
      paid: 'bg-green-600 text-white',
      pending: 'bg-yellow-500 text-white',
      failed: 'bg-red-500 text-white',
      refunded: 'bg-blue-500 text-white',
    };
    return badges[status] || 'bg-gray-500 text-white';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusTimeline = () => {
    if (order?.status === 'cancelled') {
      return ['pending', 'cancelled'];
    }
    return ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  };

  const isStatusCompleted = (status: OrderStatus) => {
    if (!order) return false;
    
    if (order.status === 'cancelled') {
      return status === 'pending' || status === 'cancelled';
    }

    const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);
    const checkIndex = statusOrder.indexOf(status);
    
    return checkIndex <= currentIndex;
  };

  const canCancelOrder = () => {
    return order?.status === 'pending' || order?.status === 'confirmed';
  };

  const showTrackingInfo = () => {
    return order?.status === 'shipped' || order?.status === 'delivered';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <>
        <Seo title="Order Not Found - Fakira FAB" description="Order details not found" />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/account/orders')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title={`Order #${order.orderNumber} - Fakira FAB`}
        description={`Order details for order #${order.orderNumber}`}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/account/orders')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Orders
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                <p className="mt-1 text-gray-600">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          {order.status !== 'cancelled' && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
              <div className="relative">
                <div className="flex justify-between">
                  {getStatusTimeline().map((status) => (
                    <div key={status} className="flex flex-col items-center flex-1">
                      <div className="relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            isStatusCompleted(status as OrderStatus)
                              ? 'bg-green-500 border-green-500'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {isStatusCompleted(status as OrderStatus) && (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                        isStatusCompleted(status as OrderStatus) ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 -z-0" style={{ left: '5%', right: '5%' }}>
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{
                      width: `${(getStatusTimeline().filter(s => isStatusCompleted(s as OrderStatus)).length - 1) / (getStatusTimeline().length - 1) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cancelled Status */}
          {order.status === 'cancelled' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Order Cancelled</h3>
                  <p className="text-sm text-red-700 mt-1">This order has been cancelled</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <div key={item.product._id} className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
                          <img
                            src={item.product.imageUrl?.[0] || '/placeholder.jpg'}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </Link>
                        <div className="flex-1">
                          <Link
                            to={`/products/${item.product._id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-red-600"
                          >
                            {item.product.name}
                          </Link>
                          {item.selectedOption && (
                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                              {item.selectedOption.color && (
                                <p>Color: <span className="font-medium">{item.selectedOption.color}</span></p>
                              )}
                              {item.selectedOption.size && (
                                <p>Size: <span className="font-medium">{item.selectedOption.size}</span></p>
                              )}
                            </div>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                            <p className="text-gray-600">Quantity: <span className="font-medium text-gray-900">{item.quantity}</span></p>
                            <p className="text-gray-600">Price: <span className="font-medium text-gray-900">₹{item.priceAtOrder.toFixed(2)}</span></p>
                            <p className="text-gray-900 font-semibold">Subtotal: ₹{(item.quantity * item.priceAtOrder).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Information */}
              {showTrackingInfo() && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h2>
                  <div className="space-y-3">
                    {order.shippingProvider && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping Provider:</span>
                        <span className="font-medium text-gray-900">{order.shippingProvider}</span>
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking Number:</span>
                        <span className="font-medium text-gray-900 font-mono">{order.trackingNumber}</span>
                      </div>
                    )}
                    {order.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Delivery:</span>
                        <span className="font-medium text-gray-900">{formatDate(order.estimatedDelivery)}</span>
                      </div>
                    )}
                    {order.trackingNumber && (
                      <button
                        onClick={() => {
                          // You can customize this URL based on the shipping provider
                          const trackingUrl = `https://www.google.com/search?q=${order.trackingNumber}+tracking`;
                          window.open(trackingUrl, '_blank');
                        }}
                        className="w-full mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Track Shipment
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">{order.billingAddress.fullName}</p>
                    <p>{order.billingAddress.addressLine1}</p>
                    {order.billingAddress.addressLine2 && <p>{order.billingAddress.addressLine2}</p>}
                    <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</p>
                    <p>{order.billingAddress.country}</p>
                    <p className="pt-2">Phone: {order.billingAddress.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (GST):</span>
                    <span className="text-gray-900">₹{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-900">₹{order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-red-600">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900 uppercase">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadge(order.paymentStatus)}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cancel Order Button */}
              {canCancelOrder() && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">Please select a reason for cancellation:</p>
            
            <div className="space-y-2 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Changed my mind"
                  checked={cancelReason === 'Changed my mind'}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-700">Changed my mind</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Found better price"
                  checked={cancelReason === 'Found better price'}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-700">Found better price</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Ordered by mistake"
                  checked={cancelReason === 'Ordered by mistake'}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-700">Ordered by mistake</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="cancelReason"
                  value="other"
                  checked={cancelReason === 'other'}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-700">Other</span>
              </label>
            </div>

            {cancelReason === 'other' && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Please specify your reason..."
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  setOtherReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isCancelling}
              >
                Back
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling || !cancelReason}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;
