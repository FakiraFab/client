import  { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollTop/ScrollTop';
import { CartProvider } from './context/CartContext';
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
        <CartProvider>
          <Router>
            <AppContent />
            <Analytics />
          </Router>
        </CartProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;