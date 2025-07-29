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

const fetchCategories = async () => {
  const res = await apiClient.get('/categories');
  return res.data.data;
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Carousel data
  const carouselData = [

    {
      id: '1',
      image: 'https://shopmulmul.com/cdn/shop/files/b_6.jpg?v=1752839478&width=1800',
      ctaText: 'SHOP NOW',
      ctaLink: '#'
    },
    {
      id: '2',
      image: 'https://shopmulmul.com/cdn/shop/files/b_5.jpg?v=1752839478&width=1800',
      ctaText: 'SHOP NOW',
      ctaLink: '#'
    },
    {
      id: '3',
      image: 'https://shopmulmul.com/cdn/shop/files/b_2.jpg?v=1752839478&width=1800',
      ctaText: 'SHOP NOW',
      ctaLink: '#'
    },
    
    
  ];

  // Sample data for Instagram Reels
  const reelsData = [
    {
      id: '1',
      title: 'Bird Block Printed best Cotton Fabric',
      price: '₹276',
      image: 'https://shopmulmul.com/cdn/shop/files/2_1274612e-b71e-4993-97a4-8c772c3ae04e.jpg?v=1751608581&width=700',
      isVideo: true
    },
    {
      id: '2',
      title: 'Bird Block Printed best Cotton Fabric',
      price: '₹276',
      image: 'https://shopmulmul.com/cdn/shop/files/2_c14f2cb2-3022-4324-80d9-d5173adc8960.jpg?v=1751439015&width=500',
      isVideo: true
    },
    {
      id: '3',
      title: 'Bird Block Printed best Cotton Fabric',
      price: '₹276',
      image: 'https://shopmulmul.com/cdn/shop/files/3_eeeed856-68a5-4faa-bc67-b1bdab866e42.jpg?v=1749105702&width=500',
      isVideo: false
    },
    {
      id: '4',
      title: 'Bird Block Printed best Cotton Fabric',
      price: '₹276',
      image: 'https://shopmulmul.com/cdn/shop/files/PDPINFLUENCERS_1_2862bfe0-c3c0-4aa6-bf6c-20aa364465c6.jpg?v=1748945548&width=500',
      isVideo: true
    }
  ];

  // Sample data for New Arrivals
  const newArrivalsData = [
    {
      id: '1',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://shopmulmul.com/cdn/shop/files/2_b3c0f124-c7e8-49e6-809e-29f7e038cf48_800x.jpg?v=1751262423',
      stockLeft: 36
    },
    {
      id: '2',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://shopmulmul.com/cdn/shop/files/18_dcc60a26-8d54-45f8-ab97-4d53e2d267ea_800x.jpg?v=1751611399',
      stockLeft: 36
    },
    {
      id: '3',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://shopmulmul.com/cdn/shop/files/31_e42b6788-d226-4c8d-97a6-88d4e4c84bc2_800x.jpg?v=1751262436',
      stockLeft: 36
    },
    {
      id: '4',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://shopmulmul.com/cdn/shop/files/30_ed645db7-3e2c-4501-8ed9-23426d2b9d54.jpg?v=1751262509&width=800',
      stockLeft: 36
    }
  ];

  // Sample data for Fabric Collections
  const fabricCollectionsData = [
    {
      id: '1',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/DS51A_45c0ed31-da46-4825-8776-8d0aac073246.jpg?v=1751864592&width=720',
      stockLeft: 36
    },
    {
      id: '2',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/DS53B_cd9c3c61-0307-41f9-9f9b-a3d975667c18.jpg?v=1751864592&width=720',
      stockLeft: 36
    },
    {
      id: '3',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/DS46B_d2901a40-b295-4158-85bc-9d929c62f3f4.jpg?v=1751864586&width=720',
      stockLeft: 36
    },
    {
      id: '4',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/DS61B_1a05e460-0e87-4136-a9bc-cbe90b6a7ed2.jpg?v=1751864578&width=720',
      stockLeft: 36
    }
  ];

  // Sample data for Dupattas
  const dupattasData = [
    {
      id: '1',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/ad-150-2_4fa23484-0724-4109-af32-29d9948e5efe.jpg?v=1750846359&width=720',
      stockLeft: 36
    },
    {
      id: '2',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/ad30ad31DSC08703_57ba7130-f885-48be-8847-2e749ee22fd4.jpg?v=1750845539&width=1080',
      stockLeft: 36
    },
    {
      id: '3',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/ad22_5a317f5a-fbba-4172-8050-84658d003814.png?v=1750845551&width=1080',
      stockLeft: 36
    },
    {
      id: '4',
      name: 'Banjara print blue fabric cotton',
      price: 2300,
      image: 'https://www.matkatus.com/cdn/shop/files/ad2_fbaccb08-5c2b-4828-be29-2ac0f274418f.png?v=1750845517&width=1080',
      stockLeft: 36
    }
  ];

  const handleViewAll = (category: string) => {
    console.log(`View all ${category} products`);
    navigate(`/category/${category}`);
  };

  const { data: categoriesData = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    suspense: true,
  });

  // Map API categories to CategoriesGrid format
  const mappedCategories = categoriesData.map((cat) => ({
    id: cat._id,
    name: cat.name,
    description: cat.description,
    image: cat.categoryImage,
  }));

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 lg:px-12">

      

      {/* Carousel Section */}
      <Carousel items = {carouselData} />

      {/* Instagram Reels Section */}
      <InstagramReels reels={reelsData} title="Featured Reels" />

      {/* New Arrivals Section */}
      <NewArrivals products={newArrivalsData} />

      {/* Categories Section */}
      <CategoriesGrid categories={mappedCategories} />

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