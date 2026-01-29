import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderApi } from '../api/orders';
import type { Order } from '../types/order';
import Seo from '../components/Seo/Seo';

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder(id);
      clearCart();
    }
  }, [id]);

  const fetchOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      const response = await orderApi.getOrder(orderId);
      setOrder(response.data);
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to load order',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEstimatedDeliveryDate = () => {
    if (order?.estimatedDelivery) {
      return formatDate(order.estimatedDelivery);
    }
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    return formatDate(deliveryDate.toISOString());
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Seo
          title="Order Confirmation - Fakira Fab"
          description="Your order has been placed successfully"
        />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Seo
          title="Order Not Found - Fakira Fab"
          description="Order not found"
        />
        <h1 className="text-3xl font-bold mb-4">Order not found</h1>
        <p className="text-gray-600 mb-8">We couldn't find the order you're looking for</p>
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Seo
        title={`Order Confirmation - ${order.orderNumber} - Fakira Fab`}
        description="Your order has been placed successfully at Fakira Fab"
      />
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Icon and Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600">
              Thank you for your order. We'll send you shipping updates to your email.
            </p>
          </div>

          {/* Order Number */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="font-semibold text-blue-900">Estimated Delivery</p>
                <p className="text-blue-800">{getEstimatedDeliveryDate()}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Items ({order.items.length})</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (GST)</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{order.shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Paid</span>
                  <span className="text-red-600">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold">
                {order.paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-gray-600">Payment Status:</span>
              <span
                className={`font-semibold ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {order.paymentStatus === 'paid'
                  ? 'Paid'
                  : order.paymentStatus === 'pending'
                  ? 'Pending'
                  : order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-lg">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600">{order.shippingAddress.phone}</p>
              <p className="text-gray-600 mt-2">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-gray-600">{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(`/account/orders/${order._id}`)}
              className="flex-1 bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-300 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Confetti Animation (CSS) */}
        <style>{`
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          
          .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            background: #f44336;
            animation: confetti-fall 3s linear;
            pointer-events: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default OrderConfirmation;
