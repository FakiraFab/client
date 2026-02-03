import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart, type CartItem } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { addressApi } from '../api/addresses';
import { orderApi } from '../api/orders';
import type { Address, AddressFormData } from '../types/address';
import type { PaymentMethod } from '../types/order';
import Seo from '../components/Seo/Seo';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, clearCart, getCartTotal } = useCart();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>('');
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<string>('');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState<AddressFormData>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    addressType: 'home',
    isDefault: false,
  });

  const items = state.items;
  const subtotal = getCartTotal();
  const tax = subtotal * 0.18;
  const shipping = 50;
  const grandTotal = subtotal + tax + shipping;

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await addressApi.getAddresses();
      setAddresses(response.data);
      const defaultAddress = response.data.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedShippingAddress(defaultAddress._id);
        setSelectedBillingAddress(defaultAddress._id);
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to load addresses',
        duration: 3000,
      });
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await addressApi.createAddress(newAddress);
      setAddresses([...addresses, response.data]);
      setSelectedShippingAddress(response.data._id);
      setSelectedBillingAddress(response.data._id);
      setShowAddressForm(false);
      setNewAddress({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: 'India',
        postalCode: '',
        addressType: 'home',
        isDefault: false,
      });
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Address added successfully',
        duration: 3000,
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to add address',
        duration: 3000,
      });
    }
  };

  const handleContinueToReview = () => {
    if (!selectedShippingAddress) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Please select a shipping address',
        duration: 3000,
      });
      return;
    }
    setCurrentStep(2);
  };

  const handleContinueToPayment = () => {
    if (sameAsShipping) {
      setSelectedBillingAddress(selectedShippingAddress);
    } else if (!selectedBillingAddress) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Please select a billing address',
        duration: 3000,
      });
      return;
    }
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Your cart is empty',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        shippingAddressId: selectedShippingAddress,
        billingAddressId: sameAsShipping ? selectedShippingAddress : selectedBillingAddress,
        paymentMethod,
      };

      const response = await orderApi.createOrder(orderData);
      const order = response.data.order;

      if (paymentMethod === 'razorpay' && response.data.razorpay) {
        const razorpayData = response.data.razorpay;
        const options = {
          key: razorpayData.keyId,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
          order_id: razorpayData.orderId,
          name: 'Fakira Fab',
          description: 'Order Payment',
          image: '/logo.png',
          handler: async function (razorpayResponse: any) {
            try {
              await orderApi.verifyPayment({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
              });
              clearCart();
              navigate(`/order-confirmation/${order._id}`);
            } catch (error: any) {
              showToast({
                type: 'error',
                title: 'Payment Verification Failed',
                message: error.response?.data?.message || 'Payment verification failed',
                duration: 3000,
              });
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: { color: '#7F1416' },
          modal: {
            ondismiss: function () {
              showToast({
                type: 'info',
                title: 'Payment Cancelled',
                message: 'You cancelled the payment',
                duration: 3000,
              });
              setIsLoading(false);
            },
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        clearCart();
        navigate(`/order-confirmation/${order._id}`);
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to place order',
        duration: 3000,
      });
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Seo
          title="Checkout - Fakira Fab"
          description="Complete your order at Fakira Fab"
        />
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some items to your cart before checking out</p>
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Seo
        title="Checkout - Fakira Fab"
        description="Complete your order at Fakira Fab"
      />
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Shipping' },
              { step: 2, label: 'Review' },
              { step: 3, label: 'Payment' },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= item.step
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {item.step}
                  </div>
                  <span
                    className={`text-sm mt-2 ${
                      currentStep >= item.step ? 'text-red-600 font-semibold' : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`h-1 flex-1 mx-4 ${
                      currentStep > item.step ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                {loadingAddresses ? (
                  <div className="text-center py-8">Loading addresses...</div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {addresses.map((address) => (
                        <label
                          key={address._id}
                          className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                            selectedShippingAddress === address._id
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingAddress"
                            value={address._id}
                            checked={selectedShippingAddress === address._id}
                            onChange={(e) => setSelectedShippingAddress(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-lg">{address.fullName}</p>
                              <p className="text-gray-600">{address.phone}</p>
                              <p className="text-gray-600 mt-2">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                              </p>
                              <p className="text-gray-600">
                                {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-gray-600">{address.country}</p>
                              {address.isDefault && (
                                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>

                    {!showAddressForm ? (
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="text-red-600 font-semibold hover:text-red-700 mb-6"
                      >
                        + Add New Address
                      </button>
                    ) : (
                      <div className="border-2 border-gray-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold mb-4">Add New Address</h3>
                        <form onSubmit={handleAddAddress} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Full Name *"
                              value={newAddress.fullName}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, fullName: e.target.value })
                              }
                              required
                              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <input
                              type="tel"
                              placeholder="Phone *"
                              value={newAddress.phone}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, phone: e.target.value })
                              }
                              required
                              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Address Line 1 *"
                            value={newAddress.addressLine1}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, addressLine1: e.target.value })
                            }
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                          <input
                            type="text"
                            placeholder="Address Line 2"
                            value={newAddress.addressLine2}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, addressLine2: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                              type="text"
                              placeholder="City *"
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, city: e.target.value })
                              }
                              required
                              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <input
                              type="text"
                              placeholder="State *"
                              value={newAddress.state}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, state: e.target.value })
                              }
                              required
                              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <input
                              type="text"
                              placeholder="Postal Code *"
                              value={newAddress.postalCode}
                              onChange={(e) =>
                                setNewAddress({ ...newAddress, postalCode: e.target.value })
                              }
                              required
                              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                          <select
                            value={newAddress.addressType}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                addressType: e.target.value as 'home' | 'work' | 'other',
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                          <div className="flex gap-4">
                            <button
                              type="submit"
                              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
                            >
                              Save Address
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddressForm(false)}
                              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    <button
                      onClick={handleContinueToReview}
                      disabled={!selectedShippingAddress}
                      className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Order Review */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Order Review</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        {item.selectedColor && (
                          <p className="text-sm text-gray-600">Color: {item.selectedColor}</p>
                        )}
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹{item.product.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Billing Address */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Billing Address</h3>
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="w-4 h-4 text-red-600"
                    />
                    <span>Same as shipping address</span>
                  </label>

                  {!sameAsShipping && (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <label
                          key={address._id}
                          className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                            selectedBillingAddress === address._id
                              ? 'border-red-600 bg-red-50'
                              : 'border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="billingAddress"
                            value={address._id}
                            checked={selectedBillingAddress === address._id}
                            onChange={(e) => setSelectedBillingAddress(e.target.value)}
                            className="sr-only"
                          />
                          <div>
                            <p className="font-semibold">{address.fullName}</p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                            <p className="text-sm text-gray-600">
                              {address.addressLine1}, {address.city}, {address.state}{' '}
                              {address.postalCode}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Coupon Code</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      disabled
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                    <button
                      disabled
                      className="bg-gray-300 text-gray-500 px-6 py-2 rounded-md cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Coming soon</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleContinueToPayment}
                    className="flex-1 bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

                <div className="space-y-4 mb-6">
                  <label
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === 'razorpay'
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="sr-only"
                    />
                    <div>
                      <p className="font-semibold text-lg">Razorpay</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay securely using Cards, UPI, Wallets, or NetBanking
                      </p>
                    </div>
                  </label>

                  <label
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="sr-only"
                    />
                    <div>
                      <p className="font-semibold text-lg">Cash on Delivery (COD)</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay with cash when you receive your order
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="flex-1 bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Grand Total</span>
                    <span className="font-bold text-red-600">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
