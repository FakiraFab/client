import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { Product, ApiResponse, Enquiry } from '../types';
import EnquiryForm from '../../src/components/EnquiryForm/EnquiryForm';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const fetchProductDetails = async (productId: string | undefined): Promise<ApiResponse<Product>> => {
  if (!productId) throw new Error('Product ID is required');
  const res = await apiClient.get(`/products/${productId}`);
  console.log(res.data);
  return res.data;
};

const fetchRelatedProducts = async (categoryId: string | undefined): Promise<ApiResponse<Product[]>> => {
  if (!categoryId) return { success: true, data: [], pagination: { total: 0, page: 1, pages: 1 } };
  const res = await apiClient.get(`/products?category=${categoryId}`);
  return res.data;
};

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(-1); // Start with -1 to show primary product
  const [quantity, setQuantity] = useState(1);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductDetails(productId),
    enabled: !!productId,
  });

  const product = productData?.data || null;
  const categoryId = product?.category?._id;

  const { data: relatedProductsData } = useQuery({
    queryKey: ['relatedProducts', categoryId],
    queryFn: () => fetchRelatedProducts(categoryId),
    enabled: !!categoryId,
  });

  const relatedProducts = relatedProductsData?.data.filter(p => p._id !== productId) || [];

  useEffect(() => {
    if (product) {
      if (selectedVariant >= 0 && product.variants && product.variants[selectedVariant]) {
        // Show variant images when a variant is selected
        const variant = product.variants[selectedVariant];
        console.log('variant', variant);
        if (variant && variant.images && variant.images.length > 0) {
          setCurrentImages(variant.images);
        } else {
          // Fallback to primary images if variant has no images
          setCurrentImages(product.images || [product.imageUrl]);
        }
      } else {
        // Show primary product images by default
        setCurrentImages(product.images || [product.imageUrl]);
      }
      setSelectedImage(0);
    }
  }, [product, selectedVariant]);


  useEffect(() => {
  if (currentImages.length > 1) {
    const interval = setInterval(() => {
      // Only autoplay on mobile screens
      if (window.innerWidth < 1024) {
        setSelectedImage(prev => (prev + 1) % currentImages.length);
      }
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }
}, [currentImages.length]);
  

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleVariantSelect = (index: number) => {
    setSelectedVariant(index);
    setSelectedImage(0);
  };

  const handleQuickQuantitySelect = (qty: number) => {
    setQuantity(qty);
  };

  const getCurrentPrice = () => {
    if (selectedVariant >= 0 && product?.variants && product.variants[selectedVariant]?.price) {
      return product.variants[selectedVariant].price;
    }
    return product?.price || 0;
  };

  const getOriginalPrice = () => {
    const currentPrice = getCurrentPrice();
    return Math.round(currentPrice * 1.2);
  };

  const getSavings = () => {
    return getOriginalPrice() - getCurrentPrice();
  };

  const getCurrentQuantity = () => {
    if (selectedVariant >= 0 && product?.variants && product.variants[selectedVariant]) {
      return product.variants[selectedVariant].quantity;
    }
    return product?.quantity || 0;
  };

  const getCurrentColor = () => {
    if (selectedVariant >= 0 && product?.variants && product.variants[selectedVariant]) {
      return product.variants[selectedVariant].color;
    }
    return product?.specifications?.color || 'Default';
  };

  const openEnquiryForm = () => {
    setIsEnquiryFormOpen(true);
    setEnquiryStatus(null); // Reset status when opening form
  };

  const closeEnquiryForm = () => {
    setIsEnquiryFormOpen(false);
    setEnquiryStatus(null); // Reset status when closing form
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity, selectedVariant >= 0 ? selectedVariant : undefined, getCurrentColor());
    
    // Show success toast
    showToast({
      type: 'success',
      title: 'Added to Cart!',
      message: `${product.name} has been added to your cart.`,
      duration: 3000
    });
  };

  const handleEnquirySubmit = async (enquiry: Enquiry) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/Inquiry', enquiry);
      if (response.data.success) {
        setEnquiryStatus({ success: true, message: 'Enquiry submitted successfully!' });
      } else {
        setEnquiryStatus({ success: false, message: 'Failed to submit enquiry. Please try again.' });
      }
    } catch (err) {
      setEnquiryStatus({ success: false, message: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <Link to="/category/fabrics" className="text-red-600 hover:underline mt-2 inline-block">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success/Error Toast */}
      {enquiryStatus && (
        <div className={`fixed top-4 right-4 p-4 rounded-md text-white ${enquiryStatus.success ? 'bg-green-600' : 'bg-red-600'}`}>
          {enquiryStatus.message}
          <button
            onClick={() => setEnquiryStatus(null)}
            className="ml-2 text-white font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b">
        <div className="container mx-auto px-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/category/${product.category.name}`} className="hover:text-red-600">
              {product.category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        




{/* Product Images */}
<div>
  {/* Desktop Layout - Thumbnail Strip + Main Image */}
  <div className="hidden lg:flex gap-4">
    {/* Thumbnail Strip - Left Side */}
    <div className="flex flex-col gap-3 w-20">
      {currentImages.map((image, index) => (
        <button
          key={index}
          onClick={() => setSelectedImage(index)}
          className={`w-20 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 ${
            selectedImage === index ? 'border-red-600' : 'border-gray-200'
          }`}
        >
          <img
            src={image || 'https://via.placeholder.com/80'}
            alt={`${product.name} ${index + 1}`}
            className="w-full h-full object-contain"
          />
        </button>
      ))}
    </div>

    {/* Main Image - Right Side */}
    <div className="flex-1">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <img
          src={currentImages[selectedImage] || product.imageUrl || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  </div>

  {/* Mobile Layout - Autoplay Carousel */}
  <div className="lg:hidden">
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <img
        src={currentImages[selectedImage] || product.imageUrl || 'https://via.placeholder.com/400'}
        alt={product.name}
        className="w-full h-80 object-contain"
      />
      
      {/* Carousel Indicators */}
      {currentImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {currentImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                selectedImage === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {currentImages.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
          {selectedImage + 1} / {currentImages.length}
        </div>
      )}
    </div>

    {/* Mobile Thumbnail Strip (Optional - for manual navigation) */}
    {currentImages.length > 1 && (
      <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
        {currentImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
              selectedImage === index ? 'border-red-600' : 'border-gray-200'
            }`}
          >
            <img
              src={image || 'https://via.placeholder.com/64'}
              alt={`${product.name} ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    )}
  </div>
</div>         

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-red-600">
                  Rs. {getCurrentPrice().toLocaleString()}
                </span>
                <span className="text-gray-500 line-through">
                  Rs. {getOriginalPrice().toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600">
                  Quantity left: {getCurrentQuantity()} Meters
                </p>
                <p className="text-sm font-medium text-green-600">
                  Save ₹{getSavings().toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-red-600 mt-1 font-medium">Limited period offer</p>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Color Options</h3>
                <div className="flex flex-wrap gap-3">
                  {/* Default/Primary Product Option */}
                  <button
                    onClick={() => setSelectedVariant(-1)}
                    className={`px-3 py-2 text-sm border-2 rounded-lg ${
                      selectedVariant === -1 ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-300'
                    }`}
                  >
                    Default
                  </button>
                  
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSelect(index)}
                      className={`w-12 h-12 rounded-lg border-2 relative ${
                        selectedVariant === index ? 'border-red-600' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: variant.colorCode }}
                      title={variant.color}
                    >
                      {variant.colorCode === '#ffffff' && (
                        <div className="absolute inset-0 rounded-lg border border-gray-300"></div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {getCurrentColor()}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-2 hover:bg-gray-100 text-lg"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[80px] text-center">
                    {quantity} Meter
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-2 hover:bg-gray-100 text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2.5, 5, 10].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => handleQuickQuantitySelect(qty)}
                    className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                      quantity === qty 
                        ? 'border-red-600 bg-red-50 text-red-600' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {qty} Meter{qty > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                ≈ {getCurrentQuantity()} Meters in stock
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
              >
                Add to Cart
              </button>
              
              <button 
                onClick={openEnquiryForm}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Enquire Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Material</span>
                <span className="text-gray-900">{product.specifications?.material}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Color</span>
                <span className="text-gray-900">{getCurrentColor()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Style</span>
                <span className="text-gray-900">{product.specifications?.style}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Length</span>
                <span className="text-gray-900">{product.specifications?.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Blouse Piece</span>
                <span className="text-gray-900">{product.specifications?.blousePiece}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700">Design No</span>
                <span className="text-gray-900">{product.specifications?.designNo}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-700 leading-relaxed">{product.fullDescription}</p>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/products/${relatedProduct._id}`}>
                  <img
                    src={relatedProduct.imageUrl}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-contain"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-red-600">
                        ₹{relatedProduct.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">per metre</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {relatedProduct.quantity} metres left
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiry Form Modal */}
      <EnquiryForm
        isOpen={isEnquiryFormOpen}
        onClose={closeEnquiryForm}
        productId={productId || ''}
        productName={product.name}
        selectedVariant={getCurrentColor()}
        defaultQuantity={quantity}
        productImage={currentImages[selectedImage] || product.imageUrl}
        onSubmit={handleEnquirySubmit}
      />
    </div>
  );
};

export default ProductDetailsPage;