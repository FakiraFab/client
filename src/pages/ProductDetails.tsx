import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import ProductCard from '../components/ProductCard';
import type { Product, ApiResponse, Enquiry } from '../types';
import EnquiryForm from '../../src/components/EnquiryForm/EnquiryForm';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductInfoTabs from '../components/ProductInfoTabs/ProductInfoTabs';
import KnowYourGarment from '../components/KnowYourGarment/KnowYourGarment';
import ModernProductSpecs from '../components/ModernProductSpecs/ModernProductSpecs';
import Seo from '../components/Seo/Seo';
import JsonLd from '../components/Seo/JsonLd';

const fetchProductDetails = async (productId: string | undefined): Promise<ApiResponse<Product>> => {
  if (!productId) throw new Error('Product ID is required');
  const res = await apiClient.get(`/products/${productId}`);
  // console.log(res.data);
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
  // console.log('Product Data:', product);
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
        //console.log('variant', variant);
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
    return product?.color || 'Default';
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
      {product && (
        <>
          <Seo
            title={`${product.name} — Fakira FAB`}
            description={product.description || product.fullDescription || `Buy ${product.name} at Fakira FAB`}
            image={product.images?.[0] || product.imageUrl}
            type="product"
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Product",
              "name": product.name,
              "image": product.images || [product.imageUrl],
              "description": product.description || product.fullDescription,
              "sku": product._id,
              "offers": {
                "@type": "Offer",
                "priceCurrency": "INR",
                "price": product.price?.toString() || '0',
                "availability": product.quantity && product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                "url": typeof window !== 'undefined' ? window.location.href : ''
              }
            }}
          />
        </>
      )}
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
            <Link to={`/category/${product.category?.name ?? ''}`} className="hover:text-[#7F1416]">
              {product.category?.name ?? ''}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 lg:auto-cols-fr">
          {/* Product Images - Column 1 */}
          <div className="lg:col-span-6">
            {/* Desktop Layout - Thumbnail Strip + Main Image */}
            <div className="hidden lg:flex lg:flex-col lg:gap-4 lg:h-auto">
              {/* Thumbnails and Images Container */}
              <div className="flex gap-4 flex-1">
                {/* Thumbnail Strip - Left Side */}
                <div className="flex flex-col gap-3 w-24 flex-shrink-0">
                  {currentImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-24 h-24 rounded-lg border-2 overflow-hidden flex-shrink-0 ${
                        selectedImage === index ? 'border-red-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image || 'https://via.placeholder.com/96'}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Image - Right Side */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img
                      src={currentImages[selectedImage] || product.imageUrl || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Secondary Image - Only on desktop if available */}
                  {currentImages[1] && (
                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hidden lg:block">
                      <img
                        src={currentImages[1]}
                        alt={`${product.name} alternate`}
                        className="w-full lg:h-[250px] object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Layout - Autoplay Carousel */}
            <div className="lg:hidden">
              <div className="relative overflow-hidden">
                <img
                  src={currentImages[selectedImage] || product.imageUrl || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="w-full h-80 object-cover"
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

              {/* Mobile Thumbnail Strip */}
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

          {/* Product Info & Specs - Column 2 */}
          <div className="lg:col-span-6 space-y-6">
            {/* Product Title & Price */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 leading-tight">{product.name}</h1>
              
              {/* Price Section */}
              <div className="flex items-center space-x-3 mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  Rs. {getCurrentPrice().toLocaleString()}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  Rs. {getOriginalPrice().toLocaleString()}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {Math.round(((getOriginalPrice() - getCurrentPrice()) / getOriginalPrice()) * 100)}% OFF
                </span>
              </div>
              
              {/* Subtext with per-unit price */}
              <p className="text-sm text-gray-600 mb-2">
                (Rs. {Math.round(getCurrentPrice() / 1)} / {product.unit || 'meter'} Rs-{getOriginalPrice()})
              </p>
              
              {/* Sale Tag */}
              <div className="inline-block bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium mb-4">
                Black Friday Sale
              </div>
              
              {/* Reviews & SKU Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex text-red-700">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-700">525 reviews</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">SKU: #fakirafab{product.specifications?.designNo}</p>
              </div>
            </div>

            {/* Feature Icons Section */}
            <div className="flex items-center justify-start space-x-8">
              {/* Artisan Made */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
                <p className="text-xs text-center font-medium text-gray-900">Artisan<br/>Made</p>
              </div>
              
              {/* Hand Block Printed */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31.84 2.41 2 2.83V20c0 .55.45 1 1 1s1-.45 1-1v-.17c1.16-.42 2-1.52 2-2.83 0-1.66-1.34-3-3-3zm13.71-9.71L12 .29c-.39-.39-1.02-.39-1.41 0L.29 10.59c-.39.39-.39 1.02 0 1.41L11 22.71c.39.39 1.02.39 1.41 0L23.71 12c.39-.38.39-1.02 0-1.41zM5 16c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
                  </svg>
                </div>
                <p className="text-xs text-center font-medium text-gray-900">100%<br/>Hand Block<br/>Printed</p>
              </div>
              
              {/* Cotton */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <p className="text-xs text-center font-medium text-gray-900">Cotton</p>
              </div>
            </div>

            {/* Meter Selection Section */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3">{product.unit === 'piece' ? 'Pieces' : 'Meters'}:</h3>
              <div className="flex flex-wrap gap-3">
                {(product.unit === 'piece' ? [1, 2, 5, 10] : [1, 2.5, 5, 10]).map((qty) => (
                  <button
                    key={qty}
                    onClick={() => handleQuickQuantitySelect(qty)}
                    className={`w-12 h-12 rounded-lg border-2 font-semibold text-sm flex items-center justify-center transition-all ${
                      quantity === qty
                        ? 'bg-[#7F1416] text-white border-[#7F1416]'
                        : 'bg-white text-gray-900 border-gray-300 hover:border-[#7F1416]'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Colors Section */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Available Colors</h3>
                <div className="flex flex-wrap gap-3">
                  {/* Default product option */}
                  <button
                    onClick={() => handleVariantSelect(-1)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      selectedVariant === -1 
                        ? 'ring-3 ring-offset-2 ring-gray-900' 
                        : 'ring-2 ring-gray-300'
                    }`}
                    style={{ backgroundColor: product.color?.toLowerCase() }}
                    title={product.color}
                  >
                    {selectedVariant === -1 && (
                      <span className="text-white text-lg font-bold">✓</span>
                    )}
                  </button>
                  {/* Variant options */}
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => handleVariantSelect(index)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        selectedVariant === index 
                          ? 'ring-3 ring-offset-2 ring-gray-900' 
                          : 'ring-2 ring-gray-300'
                      }`}
                      style={{ backgroundColor: variant.color?.toLowerCase() }}
                      title={variant.color}
                    >
                      {selectedVariant === index && (
                        <span className="text-white text-lg font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Section */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3">Quantity:</h3>
              <div className="flex items-center border-2 border-gray-400 rounded-lg overflow-hidden w-fit">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 text-lg font-semibold"
                >
                  −
                </button>
                <span className="px-6 py-3 border-l-2 border-r-2 border-gray-400 text-lg font-semibold text-gray-900 min-w-16 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 text-lg font-semibold"
                >
                  +
                </button>
              </div>
            </div>
            {/* Enquire Now Button */}
            <button 
              onClick={openEnquiryForm}
              className="w-full bg-white border-2 border-gray-800 text-gray-800 py-2.5 rounded-lg font-bold text-sm hover:bg-[#7F1416] hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'ENQUIRE NOW'}
            </button>


            {/* Add to Cart Button with Price */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#7F1416] hover:bg-gray-900 text-white py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center space-x-3"
            >
              <span>ADD TO CART</span>
              <span>:</span>
              <span>RS. {(getCurrentPrice() * quantity).toLocaleString()}</span>
            </button>
            
            

            {/* Product Specs - Below all price, quantity, and buttons */}
            <div>
              <ModernProductSpecs product={product} getCurrentColor={getCurrentColor} />
            </div>
          </div>
        </div>
        
        {/* Product Info Tabs */}
        {/* <div className="mt-12 ">
          <ProductInfoTabs productDescription={product.fullDescription || ''} />
        </div> */}

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>

        {/* Know your garment */}
        <div className="mt-12">
          {/* Assuming KnowYourGarmentCarousel is imported */}
          <KnowYourGarment />
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
        unit={product.unit || 'meter'}
        onSubmit={handleEnquirySubmit}
      />
    </div>
  );
};

export default ProductDetailsPage;