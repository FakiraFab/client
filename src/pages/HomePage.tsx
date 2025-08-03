import React from 'react';
import InstagramReels from '../components/InstagramReels/InstgramReels';
import NewArrivals from '../components/NewArrivals/NewArrivals';
import CategoriesGrid from '../components/Categories/CategoriesGrid';
import ProductsByCategory from '../components/ProductByCategory/ProductByCategory';
import WorkRegistration from '../components/WorkRegistration/WorkRegistration';
import SupportArtisans from '../components/SupportArtisans/SupportArtisans';
import Carousel from '../components/Carousel/Carousel';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useQuery } from '@tanstack/react-query';
import type { Category, Product } from '../types';

// Fetch categories
const fetchCategories = async ():Promise<Category[]> => {
  const res = await apiClient.get('/categories');
  return res.data.data;
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
  console.log('Fetched New Arrivals:', res.data.data);
  return res.data.data;
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Carousel data (unchanged)
  const carouselData = [
    {
      id: '1',
      image: 'https://shopmulmul.com/cdn/shop/files/b_6.jpg?v=1752839478&width=1800',
      ctaText: 'SHOP NOW',
      ctaLink: '#',
    },
    {
      id: '2',
      image: 'https://shopmulmul.com/cdn/shop/files/b_5.jpg?v=1752839478&width=1800',
      ctaText: 'SHOP NOW',
      ctaLink: '#',
    },
    {
      id: '3',
      image: 'https://shopmulmul.com/cdn/shop/files/b_2.jpg?v=1752839478&width=1800',
      ctaText: 'SHOP NOW',
      ctaLink: '#',
    },
  ];

  // Sample data for Instagram Reels (unchanged)
  const reelsData = [
    {
      id: '1',
      title: 'Bird Block Printed best Cotton Fabric',
      price: '₹276',
      image: 'https://cdn.shopify.com/videos/c/vp/2345a3fec28b4ece9bcbe807c62fdb25/2345a3fec28b4ece9bcbe807c62fdb25.HD-1080p-7.2Mbps-49954218.mp4',
      isVideo: true,
    },
    {
      id: '2',
      title: 'Bird Block Printed best Cotton Fabric',
      price: '₹276',
      image: 'https://cdn.shopify.com/videos/c/vp/e5282c31259042978ff302ba75a321f3/e5282c31259042978ff302ba75a321f3.HD-1080p-4.8Mbps-49954706.mp4',
      isVideo: true,
    },
    {
      id: '3',
      title: 'Bird Block Printed best Cotton Fabric',
      price: '₹276',
      image: 'https://cdn.shopify.com/videos/c/vp/094b53fa4923489ebd388d9eeb9b7061/094b53fa4923489ebd388d9eeb9b7061.HD-1080p-7.2Mbps-49954705.mp4',
      isVideo: true,
    },
    {
      id: '4',
      title: 'Bird Block Printed best Cotton Fabric',
      price: '₹276',
      image: 'https://cdn.shopify.com/videos/c/vp/bebe663301934bda950482304bee24f9/bebe663301934bda950482304bee24f9.HD-1080p-7.2Mbps-49954704.mp4',
      isVideo: true,
    },
  ];

  // Sample data for Fabric Collections (unchanged)
  const fabricCollectionsData = [
    {
      id: '1',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/DS51A_45c0ed31-da46-4825-8776-8d0aac073246.jpg?v=1751864592&width=720',
      stockLeft: 36,
    },
    {
      id: '2',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/DS53B_cd9c3c61-0307-41f9-9f9b-a3d975667c18.jpg?v=1751864592&width=720',
      stockLeft: 36,
    },
    {
      id: '3',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/DS46B_d2901a40-b295-4158-85bc-9d929c62f3f4.jpg?v=1751864586&width=720',
      stockLeft: 36,
    },
    {
      id: '4',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/DS61B_1a05e460-0e87-4136-a9bc-cbe90b6a7ed2.jpg?v=1751864578&width=720',
      stockLeft: 36,
    },
  ];

  // Sample data for Dupattas (unchanged)
  const dupattasData = [
    {
      id: '1',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/ad-150-2_4fa23484-0724-4109-af32-29d9948e5efe.jpg?v=1750846359&width=720',
      stockLeft: 36,
    },
    {
      id: '2',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/ad30ad31DSC08703_57ba7130-f885-48be-8847-2e749ee22fd4.jpg?v=1750845539&width=1080',
      stockLeft: 36,
    },
    {
      id: '3',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/ad22_5a317f5a-fbba-4172-8050-84658d003814.png?v=1750845551&width=1080',
      stockLeft: 36,
    },
    {
      id: '4',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/ad2_fbaccb08-5c2b-4828-be29-2ac0f274418f.png?v=1750845517&width=1080',
      stockLeft: 36,
    },
  ];

  // Fetch categories
  const { data: categoriesData = [] as Category[], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    suspense: true,
  });

  // Fetch new arrivals
  const { data: newArrivalsData = [] as Product[], isLoading: newArrivalsLoading } = useQuery({
  queryKey: ['newArrivals'],
  queryFn: fetchNewArrivals,
  suspense: true,
});

  // Map API categories to CategoriesGrid format
  const mappedCategories = categoriesData?.map((cat) => ({
    id: cat._id,
    name: cat.name,
    description: cat.description,
    image: cat.categoryImage,
  }));

  // Map API new arrivals to NewArrivals component format
  const mappedNewArrivals  = newArrivalsData?.map((product) => ({
    id: product._id,
    name: product.name,
    price: product.price,
    image: product.imageUrl || 'https://via.placeholder.com/800', // Fallback image if none provided
    stockLeft: product.quantity || 0, // Adjust based on your API response
  }));

  const handleViewAll = (category: string) => {
    console.log(`View all ${category} products`);
    navigate(`/category/${category}`);
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Carousel Section */}
      <Carousel items={carouselData} />

      {/* Instagram Reels Section */}
      <InstagramReels reels={reelsData} title="Featured Reels" />

      {/* New Arrivals Section */}
      {newArrivalsLoading ? (
        <div>Loading new arrivals...</div>
      ) : (
        <NewArrivals products={mappedNewArrivals} />
      )}

      {/* Categories Section */}
      {categoriesLoading ? (
        <div>Loading categories...</div>
      ) : (
        <CategoriesGrid categories={mappedCategories} />
      )}

      {/* Fabric Collections Section */}
      <ProductsByCategory
        title="Fabric Collections"
        products={fabricCollectionsData}
        filters={['Hand block print', 'Dabu kantha', 'Mul Mul Fabric']}
        onViewAll={() => handleViewAll('fabrics')}
      />

      {/* Dupattas Section */}
      <ProductsByCategory
        title="Dupattas"
        products={dupattasData}
        filters={['Ajrakh', 'Dabu kantha', 'Mul Mul Fabric']}
        onViewAll={() => handleViewAll('dupattas')}
      />

      {/* Work Registration Section */}
      <WorkRegistration />

      {/* Support Artisans Section */}
      <SupportArtisans />
    </div>
  );
};

export default HomePage;