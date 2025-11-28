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
            <Link to={`/category/${product.category?.name ?? ''}`} className="hover:text-red-600">
              {product.category?.name ?? ''}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
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
      <div className="overflow-hidden">
        <img
          src={currentImages[selectedImage] || product.imageUrl || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>

  {/* Mobile Layout - Autoplay Carousel */}
  <div className="lg:hidden">
    <div className="relative  overflow-hidden">
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
                  Quantity left: {getCurrentQuantity()} {product.unit || 'meters'}
                </p>
                <p className="text-sm font-medium text-green-600">
                  Save ₹{getSavings().toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-red-600 mt-1 font-medium">Limited period offer</p>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Color Options</h3>
                <div className="flex flex-wrap gap-3">
                  {/* Default product option */}
                  <button
                    onClick={() => handleVariantSelect(-1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedVariant === -1 
                        ? 'ring-2 ring-offset-2 ring-red-600' 
                        : 'ring-1 ring-gray-200'
                    }`}
                    style={{ backgroundColor: product.color?.toLowerCase() }}
                  >
                    {selectedVariant === -1 && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </button>
                  {/* Variant options */}
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => handleVariantSelect(index)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedVariant === index 
                          ? 'ring-2 ring-offset-2 ring-red-600' 
                          : 'ring-1 ring-gray-200'
                      }`}
                      style={{ backgroundColor: variant.color?.toLowerCase() }}
                    >
                      {selectedVariant === index && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Selected: {getCurrentColor()}
                </p>
              </div>
            )}

            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-200">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.unit === 'piece' ? [1, 2, 5, 10] : [1, 2.5, 5, 10]).map((qty) => (
                  <button
                    key={qty}
                    onClick={() => handleQuickQuantitySelect(qty)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      quantity === qty
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {qty} {product.unit}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                ≈ {getCurrentQuantity()} {product.unit}s in stock
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
              
              <button 
                onClick={openEnquiryForm}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Enquire Now'}
              </button>
            </div>
          </div>
          </div>

        {/* Product Description */}
        <ModernProductSpecs product={product} getCurrentColor={getCurrentColor} />
        
        {/* Product Info Tabs */}
        <div className="mt-12 ">
          <ProductInfoTabs productDescription={product.fullDescription || ''} />
        </div>

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