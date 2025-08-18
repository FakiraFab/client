import React, { useState, useEffect } from 'react';
import { X, Phone, MapPin, User, Building, Package, MessageSquare } from 'lucide-react';
import type { Enquiry } from '../../types';

interface EnquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  selectedVariant?: string;
  defaultQuantity?: number;
  productImage?: string;
  unit?: string;
  onSubmit: (enquiry: Enquiry) => void;
}

interface EnquiryFormData {
  userName: string;
  userEmail: string;
  whatsappNumber: string;
  buyOption: 'Personal' | 'Wholesale' | 'Other';
  location: string;
  quantity: number;
  companyName: string;
  message: string;
}

type EnquiryFormErrors = {
  [K in keyof EnquiryFormData]?: string;
};

const EnquiryForm: React.FC<EnquiryFormProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  selectedVariant = '',
  defaultQuantity = 1,
  productImage,
  unit = 'meter',
  onSubmit,
}) => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    userName: '',
    userEmail: '',
    whatsappNumber: '',
    buyOption: 'Personal',
    location: '',
    quantity: defaultQuantity,
    companyName: '',
    message: '',
  });

  const [errors, setErrors] = useState<EnquiryFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Reset form when default quantity changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      quantity: defaultQuantity,
    }));
  }, [defaultQuantity]);

  // Prevent body scroll when form is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Auto-close form on successful submission after delay
  useEffect(() => {
    if (submitStatus?.success) {
      const timer = setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus, onClose]);

  const validateForm = (): boolean => {
    const newErrors: EnquiryFormErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Full name is required';
    } else if (formData.userName.length > 100) {
      newErrors.userName = 'Full name cannot exceed 100 characters';
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Please enter a valid WhatsApp number';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.length > 300) {
      newErrors.location = 'Location cannot exceed 300 characters';
    }

    if (formData.quantity < 1) {
      newErrors.quantity = `Quantity must be at least 1 ${unit}`;
    }

    if (formData.buyOption === 'Wholesale' && !formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required for wholesale inquiries';
    }

    if (formData.message && formData.message.length > 500) {
      newErrors.message = 'Message cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));

    if (errors[name as keyof EnquiryFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    if (name === 'buyOption' && value !== 'Wholesale') {
      setFormData(prev => ({ ...prev, companyName: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    const payload: Enquiry = {
      productId,
      productName,
      productImage: productImage || '',
      variant: selectedVariant || undefined,
      userName: formData.userName,
      userEmail: formData.userEmail,
      whatsappNumber: formData.whatsappNumber,
      buyOption: formData.buyOption,
      location: formData.location,
      quantity: formData.quantity,
      companyName: formData.buyOption === 'Wholesale' ? formData.companyName : undefined,
      message: formData.message || undefined,
    };

    try {
      await onSubmit(payload);
      setSubmitStatus({
        success: true,
        message: 'Enquiry submitted successfully!',
      });
      setFormData({
        userName: '',
        userEmail: '',
        whatsappNumber: '',
        buyOption: 'Personal',
        location: '',
        quantity: defaultQuantity,
        companyName: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error submitting enquiry:', error);
      setSubmitStatus({
        success: false,
        message: 'Failed to submit enquiry. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Toast Notification */}
      {submitStatus && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md text-white z-[60] shadow-lg transition-all duration-300 ${
            submitStatus.success ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          <div className="flex items-center">
            {submitStatus.success ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{submitStatus.message}</span>
            <button
              onClick={() => setSubmitStatus(null)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Form Container */}
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div
          className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-600 to-red-700 text-white">
            <div className="flex items-center space-x-4">
              {productImage && (
                <img
                  src={productImage}
                  alt={productName}
                  className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm"
                />
              )}
              <div>
                <h2 className="text-xl font-bold">Enquire About</h2>
                <p className="text-lg font-medium line-clamp-1">{productName}</p>
                {selectedVariant && (
                  <p className="text-sm opacity-90 line-clamp-1">Variant: {selectedVariant}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close enquiry form"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Product Summary */}
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {productImage && (
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-20 h-20 object-contain rounded-lg border border-gray-200 bg-white p-1"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{productName}</h3>
                  {selectedVariant && (
                    <p className="text-sm text-gray-600 mt-1 truncate">Variant: {selectedVariant}</p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formData.quantity} {unit}{formData.quantity !== 1 ? 's' : ''}
                  </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-red-600 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-red-600" />
                    Your Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                          errors.userName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.userName && <p className="mt-1 text-sm text-red-600">{errors.userName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                          errors.userEmail ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.userEmail && <p className="mt-1 text-sm text-red-600">{errors.userEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                          errors.whatsappNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    {errors.whatsappNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                          errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="City, State, Country"
                      />
                    </div>
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                  </div>
                </div>
              </div>

              {/* Purchase Details */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-red-600 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-red-600" />
                    Purchase Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Type <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="buyOption"
                        value={formData.buyOption}
                        onChange={handleInputChange}
                        className="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white hover:border-gray-400 transition-colors"
                      >
                        <option value="Personal">Personal</option>
                        <option value="Wholesale">Wholesale</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity (Meters) <span className="text-red-600">*</span>
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        disabled={formData.quantity <= 1 || loading}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className={`flex-1 px-3 py-3 text-center border-x border-gray-300 focus:ring-0 focus:outline-none ${
                          errors.quantity ? 'bg-red-50' : 'bg-white'
                        }`}
                        min="1"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        disabled={loading}
                      >
                        +
                      </button>
                    </div>
                    {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                  </div>
                </div>

                {formData.buyOption === 'Wholesale' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                          errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Enter your company name"
                        disabled={loading}
                      />
                    </div>
                    {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                  </div>
                )}
              </div>

              {/* Additional Message */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-red-600 rounded-full mr-3"></div>
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-red-600" />
                    Additional Message (Optional)
                  </label>
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-colors ${
                    errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Any specific requirements or questions..."
                  disabled={loading}
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                <p className="text-xs text-gray-500 text-right">
                  {formData.message.length}/500 characters
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center pt-6 gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full sm:w-auto px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {loading && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  <span>{loading ? 'Submitting...' : 'Send Enquiry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryForm;