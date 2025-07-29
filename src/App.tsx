import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

const HomePage = lazy(() => import('./pages/HomePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Categories = lazy(() => import('./components/Categories/Categories'));
const Workshops = lazy(() => import('./pages/Workshops'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetails'));

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className = "flex-grow">
          <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path='/category' element={<Categories/>}/>
              <Route path='/workshops' element={<Workshops/>}/>
              <Route path='/about' element={<AboutUs/>}/>
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/products/:productId" element={<ProductDetailsPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;