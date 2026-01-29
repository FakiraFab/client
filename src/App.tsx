import  { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollTop/ScrollTop';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { HelmetProvider } from 'react-helmet-async';
import ToastContainer from './components/Toast/ToastContainer';
import { Analytics } from '@vercel/analytics/react';
import { GAListener } from './components/GAListener';
import { FaqSection } from './components/StaticSections';
import WhatsAppButton from './components/WhatsAppButton';


const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Categories = lazy(() => import('./components/Categories/Categories'));
const Workshops = lazy(() => import('./pages/Workshops'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetails'));
const AllProducts = lazy(() => import('./pages/AllProducts'));
const NewArrivals = lazy(() => import('./pages/NewArrivals'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));

// Auth pages
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Account pages
const Dashboard = lazy(() => import('./pages/account/Dashboard'));
const ProfileInfo = lazy(() => import('./pages/account/ProfileInfo'));
const AddressManagement = lazy(() => import('./pages/account/AddressManagement'));
const OrderHistory = lazy(() => import('./pages/account/OrderHistory'));
const OrderDetails = lazy(() => import('./pages/account/OrderDetails'));
const Wishlist = lazy(() => import('./pages/account/Wishlist'));

// Checkout pages
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { toasts, removeToast } = useToast();
  
  return (
    <>
      <ScrollToTop />
      {/* Google Analytics 4 Listener for SPA page tracking */}
      {/* Detects route changes and sends page_path to GA4 */}
      <GAListener />
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path='/category' element={<Categories/>}/>
              <Route path='/workshops' element={<Workshops/>}/>
              <Route path='/about' element={<AboutUs/>}/>
              <Route path='/OurPolicy' element={<TermsAndConditions/>}/>
              <Route path="/all-products" element={<AllProducts />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/products/:productId" element={<ProductDetailsPage />} />
              <Route path ="/FAQ" element={<FaqSection/>}/>
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Checkout pages - Protected */}
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
              
              {/* Account pages - Protected */}
              <Route path="/account" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/account/profile" element={<ProtectedRoute><ProfileInfo /></ProtectedRoute>} />
              <Route path="/account/addresses" element={<ProtectedRoute><AddressManagement /></ProtectedRoute>} />
              <Route path="/account/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path="/account/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
              <Route path="/account/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </main>
        <Footer/>
      </div>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <WhatsAppButton 
        phoneNumber="919998042577" 
        message="Hi! I'm interested in your handcrafted products."
      />
    </>
  );
}
//+91-99980-42577

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <AppContent />
              <Analytics />
            </Router>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;