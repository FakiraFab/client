import React from 'react';
import InstagramReels from '../components/InstagramReels/InstgramReels';
import NewArrivals from '../components/NewArrivals/NewArrivals';
import CategoriesGrid from '../components/Categories/CategoriesGrid';
import ProductsByCategory from '../components/ProductByCategory/ProductByCategory';

// import SupportArtisans from '../components/SupportArtisans/SupportArtisans';
import Carousel from '../components/Carousel/Carousel';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useQuery } from '@tanstack/react-query';
import type { Category, Product, Reel, Banner, ApiResponse } from '../types';
import { fetchActiveReels } from '../api/products';
import { fetchActiveBanners } from '../api/banners';
import WorkshopSection from '../components/WorkshopSection/WorkshopSection';
import { IndigoPatternSection, TouchFeelCreateHero } from '../components/StaticSections';
import { 
  HeroSkeleton, 
  ReelsGridSkeleton, 
  ProductGridSkeleton, 
  CategoriesGridSkeleton 
} from '../components/SkeletonLoader';
import AutoCarousel from '../components/AutoCarousel/AutoCarousel';
import StaticCarousel from '../components/StaticSections/StaticComponent';
import FeaturesSection from '../components/StaticSections/FeaturesSection';
import Testimonials from '../components/Testimonials/Testimonial';



const slides : string[] = [
   "Fast Track Shipping",
  "Free Shipping – Just Spend ₹2000 or More",
  "Cash on Delivery Accepted", 
  "Smooth Exchange Process"
]


const sampleImages = [


    {
        _id: '1',
        image: 'https://res.cloudinary.com/dtst7rqhw/image/upload/v1758265781/6226250966609545669_fyv5xp.jpg',
        title: 'Sample Image 1',
        ctaText: 'Shop Now',
        ctaLink: '/categories',
    },
    {
        _id: '2',
        image: 'https://res.cloudinary.com/dtst7rqhw/image/upload/v1758265776/6226250966609545684_jfzhvs.jpg',
        title: 'Sample Image 2',
        ctaText: 'Explore',
        ctaLink: '/categories',
    },
    {
        _id: '3',
        image: 'https://res.cloudinary.com/dtst7rqhw/image/upload/v1758265764/6226250966609545687_r7bw2p.jpg',
        title: 'Sample Image 3',
        ctaText: 'Learn More',
        ctaLink: '/categories',
    },
   
  ];

// Fetch categories
const fetchCategories = async ():Promise<Category[]> => {
  //we need to pass the limit to the categories api
  const res = await apiClient.get('/categories', {
    params: {
      limit: 20,
    }
  });
  return res.data.data;
};

// Fetch products by category
const fetchProductsByCategory = async (categoryId: string, limit: number = 4): Promise<ApiResponse<Product[]>> => {
  const res = await apiClient.get(`/products`, {
    params: {
      category: categoryId,
      limit: limit,
      sort: '-createdAt'
    }
  });
  // console.log('Fetched Products by Category:', res.data.data);
  return res.data;
};

// Fetch new arrivals
const fetchNewArrivals = async ():Promise<Product[]> => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const res = await apiClient.get('/products', {
    params: {
      createdAt: {
        $gte: twoWeeksAgo.toISOString(),
      },
      sort: '-createdAt',
      limit: 4,
    },
  });
  // console.log('Fetched New Arrivals:', res.data.data);
  return res.data.data;
};

// Fetch active reels
const fetchReels = async (): Promise<Reel[]> => {
  const res = await fetchActiveReels();
  return res.data;
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Fetch banners
  const { data: bannersData = [] as Banner[], isLoading: bannersLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: fetchActiveBanners,
  });

  //console.log('Banners Data:', bannersData);

  // Fetch categories
  const { data: categoriesData = [] as Category[], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  //console.log('Categories Data:', categoriesData);

  // Find specific categories for dynamic data
  const fabricCategory = categoriesData.find(cat => 
    cat.name.includes('Unstitch Fabrics') || 
    cat.name.toLowerCase().includes('textile')
  );
//  console.log('Categories Data:', categoriesData);
  
  const dupattaCategory = categoriesData.find(cat => 
    cat.name.toLowerCase().includes('sarees') || 
    cat.name.toLowerCase().includes('stole')
  );
  //console.log('Fabric Category:', fabricCategory);
  //console.log('Dupatta Category:', dupattaCategory);

  // Fetch products for Fabric Collections
  const { data: fabricProductsData = { data: [] }, isLoading: fabricLoading } = useQuery({
    queryKey: ['fabricProducts', fabricCategory?._id],
    queryFn: () => fetchProductsByCategory(fabricCategory?._id || '', 4),
    enabled: !!fabricCategory?._id,
  });

  // Fetch products for Dupattas
  const { data: dupattaProductsData = { data: [] }, isLoading: dupattaLoading } = useQuery({
    queryKey: ['dupattaProducts', dupattaCategory?._id],
    queryFn: () => fetchProductsByCategory(dupattaCategory?._id || '', 4),
    enabled: !!dupattaCategory?._id,
  });

  // Fetch new arrivals
  const { data: newArrivalsData = [] as Product[], isLoading: newArrivalsLoading } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: fetchNewArrivals,
  });

  // Fetch active reels
  const { data: reelsData = [] as Reel[], isLoading: reelsLoading } = useQuery({
    queryKey: ['reels'],
    queryFn: fetchReels,
  });

  // Map API categories to CategoriesGrid format
  const mappedCategories = categoriesData.map((cat: Category) => ({
    id: cat._id,
    name: cat.name,
    description: cat.description,
    image: cat.categoryImage,
  }));

  // Map API new arrivals to NewArrivals component format
  const mappedNewArrivals = newArrivalsData.map((product: Product) => ({
    _id: product._id,
    name: product.name,
    subcategory: product.subcategory,
    category: product.category,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl || 'https://via.placeholder.com/800',
    quantity: product.quantity || 0,
    options: product.options,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    __v: product.__v,
    images: product.images,
    variants: product.variants,
    unit: product.unit,
    specifications: product.specifications,
    fullDescription: product.fullDescription,
    material: product.material,
    style: product.style,
    length: product.length,
    blousePiece: product.blousePiece,
    designNo: product.designNo,
  }));

  // Map fabric products to ProductsByCategory format
  const mappedFabricProducts = fabricProductsData.data.map((product: Product) => ({
    _id: product._id,
    name: product.name,
    subcategory: product.subcategory,
    category: product.category,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl || 'https://via.placeholder.com/800',
    quantity: product.quantity || 0,
    options: product.options,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    __v: product.__v,
    images: product.images,
    variants: product.variants,
    unit: product.unit,
    specifications: product.specifications,
    fullDescription: product.fullDescription,
    material: product.material,
    style: product.style,
    length: product.length,
    blousePiece: product.blousePiece,
    designNo: product.designNo,
  }));

  // Map dupatta products to ProductsByCategory format
  const mappedDupattaProducts = dupattaProductsData.data.map((product: Product) => ({
    _id: product._id,
    name: product.name,
    subcategory: product.subcategory,
    category: product.category,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl || 'https://via.placeholder.com/800',
    quantity: product.quantity || 0,
    options: product.options,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    __v: product.__v,
    images: product.images,
    variants: product.variants,
    specifications: product.specifications,
    unit: product.unit,
    fullDescription: product.fullDescription,
    material: product.material,
    style: product.style,
    length: product.length,
    blousePiece: product.blousePiece,
    designNo: product.designNo,
  }));

  const handleViewAll = (category: string) => {
    //console.log(`View all ${category} products`);
    navigate(`/category/${category}`);
  };

  const handleWorkshopRegister = () => {
    navigate('/workshops');
  };

  return (
    <div className="min-h-screen mt-5 bg-white px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Carousel Section */}
      {bannersLoading ? (
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
          <HeroSkeleton className="w-full h-full" />
        </div>
      ) : (
        <Carousel banners={bannersData} />
      )}

      {/* Instagram Reels Section */}
      {reelsLoading ? (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Reels</h2>
            </div>
            <ReelsGridSkeleton />
          </div>
        </div>
      ) : (
        <div className='mt-12 mb-12  bg-gray-50'>
          <InstagramReels reels={reelsData} />
        </div>
        
      )}

      {/* New Arrivals Section */}
      {newArrivalsLoading ? (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
            </div>
            <ProductGridSkeleton count={4} />
          </div>
        </div>
      ) : (
        <NewArrivals products={mappedNewArrivals} />
      )}

      

      {/* Categories Section */}
      {categoriesLoading ? (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            </div>
            <CategoriesGridSkeleton />
          </div>
        </div>
      ) : (

        <div className='mt-12 mb-12  bg-gray-50'>
          <CategoriesGrid categories={mappedCategories} />
        </div>
        
      )}

    <TouchFeelCreateHero/>


      {/* Fabric Collections Section */}
      {fabricLoading ? (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Unstich Fabric Collections</h2>
            </div>
            <ProductGridSkeleton count={4} />
          </div>
        </div>
      ) : fabricCategory && mappedFabricProducts.length > 0 ? (
        <div className='mt-12 mb-12 flex justify-center bg-gray-50'>
          <ProductsByCategory
          title={fabricCategory.name}
          products={mappedFabricProducts}
          filters={['Hand block print', 'Dabu kantha', 'Mul Mul Fabric']}
          onViewAll={() => handleViewAll(fabricCategory._id)}
        />

        </div>
      ) : null}

      
      

      
      


      {/* 
        Fix: The 'slides' prop type for AutoCarousel expects 'never[]', but 'slides' is 'string[]'.
        Solution: If AutoCarousel is meant to accept string[] (e.g., image URLs), update its prop type.
        If not, and you want to avoid the error for now, cast as 'any' or fix the prop type in AutoCarousel.
        Here, we cast as 'any[]' to resolve the type error.
      */}
      <AutoCarousel
        slides={slides as []}
      />
      

      

      {/* Dupattas Section */}
      {dupattaLoading ? (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Dupattas</h2>
            </div>
            <ProductGridSkeleton count={4} />
          </div>
        </div>
      ) : dupattaCategory && mappedDupattaProducts.length > 0 ? (
        <div className='mt-12 mb-12 flex justify-center bg-gray-50'>
          <ProductsByCategory
          title={dupattaCategory.name}
          products={mappedDupattaProducts}
          filters={['Ajrakh', 'Dabu kantha', 'Mul Mul Fabric']}
          onViewAll={() => handleViewAll(dupattaCategory._id)}
        />
        </div>

        
      ) : null}



      <div className='mt-12 mb-12 flex justify-center'>
          <StaticCarousel  banners={sampleImages}/>
      </div>

     

      
      {/* Static Floral Pattern Section */}
      <IndigoPatternSection/>

      {/* Static Best Seller Section */}
      {/* <BestSellerSection /> */}


      {/* Workshop Section */}
      <WorkshopSection onRegisterClick={handleWorkshopRegister} />

      {/* Features Section */}
      <div className='mt-12 mb-12 flex justify-center bg-gray-50'>
        <FeaturesSection/>
      </div>

      <div className='mt-12 mb-12 flex justify-center bg-gray-50'>
      <Testimonials/>
      </div>

      

      

      {/* Support Artisans Section */}
      {/* <SupportArtisans /> */}
    </div>
  );
};

export default HomePage;