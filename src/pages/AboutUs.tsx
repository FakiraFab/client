import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Heart, Award, Star, ChevronLeft, ChevronRight, VolumeX, Pause, Volume2, Play, Facebook, Linkedin, Twitter, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo/Seo';
import JsonLd from '../components/Seo/JsonLd';

const AboutUs: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
   const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  function generateCloudninaryUrl(publicId: string, width: number, height: number): string {  
    // Use c_fit to avoid cropping (fits the image within given box), enable dpr_auto for high-DPI
    // and f_auto/q_auto for optimal format and quality.
    return `https://res.cloudinary.com/dtst7rqhw/image/upload/q_auto,f_auto,dpr_auto,w_${width},h_${height},c_fit/${publicId}`;
  }

  // Carousel images for Legacy section
  const legacyImages = [
    "v1758265742/6226250966609545718_nxjegg.jpg",
    "v1758265743/6226250966609545721_q1ljen.jpg",
    "v1758265788/6226250966609545674_ffihzy.jpg",
    "v1758265765/6226250966609545688_jw5unq.jpg",
    "v1758265744/6226250966609545722_bk2csb.jpg",
    "v1758265781/6226250966609545668_ptgha7.jpg",
    "v1758265768/6226250966609545675_1_rwep5g.jpg",
    "v1758265752/6226250966609545701_cs0baf.jpg",
    "v1758265789/6226250966609545671_lj8ofd.jpg"
  

    
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % legacyImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [legacyImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % legacyImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + legacyImages.length) % legacyImages.length);
  };



  // Intersection Observer for auto play/pause on scroll
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play();
          setIsPlaying(true);
        } else {
          el.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Update progress bar
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const updateProgress = () => {
      setProgress((el.currentTime / el.duration) * 100 || 0);
    };

    el.addEventListener("timeupdate", updateProgress);
    return () => el.removeEventListener("timeupdate", updateProgress);
  }, []);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;

    if (isPlaying) {
      el.pause();
    } else {
      el.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = videoRef.current;
    if (!el) return;

    const newTime = (parseFloat(e.target.value) / 100) * el.duration;
    el.currentTime = newTime;
  };


  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="About Fakira FAB — Heritage Block-Printed Fabrics"
        description="Learn about Fakira FAB's history, craftsmanship and artisans. We preserve traditional block printing and natural dye techniques to create authentic textiles."
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Fakira FAB",
          "description": "Fakira FAB preserves traditional block printing and creates handcrafted textiles in India."
        }}
      />
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-red-50 to-orange-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Celebrating Tradition Through 
                  <span className="text-red-900 block">Timeless Prints</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  Discover the story behind our craft and community. From heritage block printing 
                  to modern artistry, we preserve traditions while creating contemporary masterpieces.
                </p>
              </div>
              
              <button className="bg-red-900 text-white px-6 md:px-8 py-3 md:py-4 font-semibold hover:bg-red-800 transition-all duration-200 flex items-center space-x-2 group">
                <span>Explore Our Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
            
            <div className="relative overflow-hidden shadow-2xl group">
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/dtst7rqhw/video/upload/v1758209874/IMG_3219_jvrul9.mp4"
        className="w-full h-64 md:h-80 lg:h-96 object-cover"
        playsInline
        loop
        muted={false}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

      {/* Caption */}
      <div className="absolute bottom-16 md:bottom-20 left-4 md:left-6 text-white">
        <p className="text-base md:text-lg font-semibold">Heritage Since 1960</p>
        <p className="text-sm opacity-90">Preserving Traditional Craftsmanship</p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center px-4 space-x-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Play / Pause */}
        <button onClick={togglePlay} className="p-2 rounded-full bg-black/50 hover:bg-black/70">
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        {/* Mute / Unmute */}
        <button onClick={toggleMute} className="p-2 rounded-full bg-black/50 hover:bg-black/70">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Progress bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="flex-1 h-1 accent-red-600 cursor-pointer"
        />
      </div>
    </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="relative">
              <div className="overflow-hidden shadow-xl">
                <img
                  src="https://res.cloudinary.com/dtst7rqhw/image/upload/v1758478763/WhatsApp_Image_2025-09-19_at_20.23.29_c0d17a57_friuxl.jpg"
                  alt="Founder at work"
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
              
              {/* Floating Achievement Card */}
              <div className="absolute -bottom-6 md:-bottom-8 -right-4 md:-right-8 bg-red-900 text-white p-4 md:p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">60+</div>
                  <div className="text-xs md:text-sm opacity-90">Years of Excellence</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Story</h2>
                <div className="w-16 h-1 bg-red-900"></div>
              </div>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The origins of Fakira Fab trace back to Udaipur, Rajasthan, where Fakruddin Ji, 
                  born into a traditional block printing family, developed a deep passion for 
                  preserving and promoting the age-old art of block printing with organic dyes.
                </p>
                
                <p>
                  In 1960, with the dream of expanding this heritage beyond state borders, he came 
                  to Ahmedabad, Gujarat—a move that marked the beginning of an extraordinary journey 
                  that would span generations and touch lives across the globe.
                </p>
                
                <p>
                  By 1964, Fakruddin Ji worked with the renowned Calico Textile Mills, where he 
                  honed his techniques in natural dyeing and heritage block design printing. His 
                  refined approach quickly gained popularity, and his signature style came to be 
                  known as "Saudagari Print"—later rebranded by Calico as the now-iconic "Fakira Print."
                </p>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-900" />
                  <span className="text-gray-700 font-medium text-sm md:text-base">Passion Driven</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-red-900" />
                  <span className="text-gray-700 font-medium text-sm md:text-base">Heritage Preserved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Process Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Craftsmanship Process</h2>
            <div className="w-16 h-1 bg-red-900 mx-auto"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Every piece tells a story of tradition, skill, and artistry passed down through generations.
            </p>
          </div>
          
          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto pb-4">
            <div className="flex space-x-4" style={{ width: 'max-content' }}>
              {[
                {
                  image: "https://res.cloudinary.com/dtst7rqhw/image/upload/q_auto,f_auto,w_400,h_500,c_fill/v1758265781/6226250966609545668_ptgha7.jpg",
                  title: "Hand-Carving Blocks",
                  description: "Master craftsmen carve intricate patterns into wooden blocks with precision and artistry."
                },
                {
                  image: "https://res.cloudinary.com/dtst7rqhw/image/upload/q_auto,f_auto,w_400,h_500,c_fill/v1758265748/6226250966609545707_ungesw.jpg",
                  title: "Natural Dye Preparation",
                  description: "Organic dyes prepared using traditional methods for vibrant, eco-friendly colors."
                },
                {
                  image: "https://res.cloudinary.com/dtst7rqhw/image/upload/q_auto,f_auto,w_400,h_500,c_fill/v1758265750/6226250966609545704_1_f3s7dc.jpg",
                  title: "Printing on Fabric",
                  description: "Each pattern is carefully stamped by hand, creating unique and beautiful textiles."
                }
              ].map((step, index) => (
                <div key={index} className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col" style={{ width: '280px', flexShrink: 0 }}>
                  <div className="relative">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-80 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-red-900 text-white w-10 h-10 flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="p-6 space-y-3 flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-base">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://res.cloudinary.com/dtst7rqhw/image/upload/q_auto,f_auto,w_600,h_400,c_fill/v1758265781/6226250966609545668_ptgha7.jpg",
                title: "Hand-Carving Blocks",
                description: "Master craftsmen carve intricate patterns into wooden blocks with precision and artistry."
              },
              {
                image: "https://res.cloudinary.com/dtst7rqhw/image/upload/q_auto,f_auto,w_600,h_400,c_fill/v1758265748/6226250966609545707_ungesw.jpg",
                title: "Natural Dye Preparation",
                description: "Organic dyes prepared using traditional methods for vibrant, eco-friendly colors."
              },
              {
                image: "https://res.cloudinary.com/dtst7rqhw/image/upload/q_auto,f_auto,w_600,h_400,c_fill/v1758265750/6226250966609545704_1_f3s7dc.jpg",
                title: "Printing on Fabric",
                description: "Each pattern is carefully stamped by hand, creating unique and beautiful textiles."
              }
            ].map((step, index) => (
              <div key={index} className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="relative">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-red-900 text-white w-10 h-10 flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="p-8 space-y-4 flex-grow">
                  <h3 className="text-2xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Artisans Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Artisan Leaders</h2>
            <div className="w-16 h-1 bg-red-900 mx-auto"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              The visionaries and master craftsmen who keep the legacy of block printing alive and thriving.
            </p>
          </div>

          <div className="space-y-16 md:space-y-20">
            {/* Artisan 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1 space-y-6">
                <div>
                  <p className="text-red-900 font-semibold text-sm uppercase tracking-wider mb-2">Chairman</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Faruk Ji</h3>
                  <p className="text-lg text-red-900 font-medium">Ahmedabad</p>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  Carries forward the vision and values of Fakruddin Ji. As Chairman, Faruk Ji provides strategic guidance, preserves heritage-driven craftsmanship, and oversees innovation within the brand. He ensures that Banjara Dyeing, traditional block printing, and artisanal authenticity remain the foundation of Fakira Fab. His leadership bridges the company’s historic roots with modern industry practices.
                </p>
                
                <div className="space-y-3">
                  <p className="italic text-gray-700 font-medium">
                    "Every block tells a story, every print carries our heritage forward."
                  </p>
                  <p className="text-sm text-gray-600">
                    His leadership bridges the company’s historic roots with modern industry practices.
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="#" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="order-1 md:order-2 relative overflow-hidden shadow-2xl">
                <img
                  src="https://res.cloudinary.com/dhkaucebl/image/upload/c_auto,g_auto,h_1200,w_900/6197329464295885798_j6g0co"
                  alt="Sajjid Udaipurwala"
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-900 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-white" />
                  <span className="text-sm font-semibold">Chairman</span>
                </div>
              </div>
            </div>

            {/* Artisan 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="relative overflow-hidden shadow-2xl">
                <img
                  
                  src="https://res.cloudinary.com/dhkaucebl/image/upload/v1765779373/6197329464295885797_giopi6.jpg"
                  alt="Amir Udaipurwala"
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-900 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-white" />
                  <span className="text-sm font-semibold">Managing Director</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-red-900 font-semibold text-sm uppercase tracking-wider mb-2">Managing Director(MD)</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sajid Ji</h3>
                  <p className="text-lg text-red-900 font-medium">Gujarat</p>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  Leads the organization with a focus on operational excellence and creative development. Sajid Ji supervises production workflows, dyeing and printing standardization, and quality benchmarks across departments. He plays a vital role in color innovation, maintaining consistency in Fakira Print and Banjara Dyeing techniques.
                </p>
                
                <div className="space-y-3">
                  <p className="italic text-gray-700 font-medium">
                    "In each pattern, I weave the dreams and traditions of my ancestors."
                  </p>
                  <p className="text-sm text-gray-600">
                   His management ensures timely delivery, efficiency, and continuous improvement throughout the company
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="#" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Artisan 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1 space-y-6">
                <div>
                  <p className="text-red-900 font-semibold text-sm uppercase tracking-wider mb-2">Chief Executive Officer (CEO)</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Aamir Ji</h3>
                  <p className="text-lg text-red-900 font-medium">Ahmedabad</p>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  (Elder Son of Faruk Ji)
Oversees all major business functions, including wholesale sales, market expansion, brand partnerships, and strategic growth planning. Amir Ji drives Fakira Fab’s presence in domestic and international markets while nurturing long-term client relationships. Under his leadership, the brand is scaling with modern business models while staying rooted in traditional craftsmanship.
                </p>
                
                <div className="space-y-3">
                  <p className="italic text-gray-700 font-medium">
                    "The art of block printing is not just work, it's a meditation of the soul."
                  </p>
                  <p className="text-sm text-gray-600">
                    Under his leadership, the brand is scaling with modern business models while staying rooted in traditional craftsmanship.
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="#" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="order-1 md:order-2 relative overflow-hidden shadow-2xl">
                <img
                  src="https://res.cloudinary.com/dhkaucebl/image/upload/v1765779374/6197329464295885796_uhrx7s.jpg"
                  alt="Sakir Udaipurwala"
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-900 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-white" />
                  <span className="text-sm font-semibold">CEO</span>
                </div>
              </div>
            </div>

              {/* Artisan 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="relative overflow-hidden shadow-2xl">
                <img
                  src="https://res.cloudinary.com/dhkaucebl/image/upload/v1765779374/6197329464295885795_ofmfpo.jpg"
                  alt="Amir Udaipurwala"
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-900 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-white" />
                  <span className="text-sm font-semibold">COO</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-red-900 font-semibold text-sm uppercase tracking-wider mb-2">Chief Operating Officer (COO)</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sakir Ji</h3>
                  <p className="text-lg text-red-900 font-medium">Gujarat</p>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  Responsible for the smooth execution of daily operations across dyeing, printing, inventory, and production management. He ensures efficient workflow, maintains product quality standards, supervises artisan teams, and coordinates inter-department processes.
                  He plays a vital role in optimizing resources and streamlining operations to meet customer demands while upholding the brand’s commitment to craftsmanship. 
                </p>
                
                <div className="space-y-3">
                  <p className="italic text-gray-700 font-medium">
                    "Efficiency and quality go hand in hand in our craft."
                  </p>
                  <p className="text-sm text-gray-600">
                   His role is central to maintaining consistency, timely production, and the overall operational strength of Fakira Fab
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="#" className="p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors duration-200">
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

   

      {/* Legacy Continuation Section with Carousel */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Legacy Continues</h2>
                <div className="w-16 h-1 bg-red-900"></div>
              </div>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Fakruddin Ji's legacy was carried forward by his sons. In 1985, his elder son 
                  Faruk Ji joined the enterprise and introduced BANJARA Dyeing, a vibrant color 
                  dyeing technique. A decade later, in 1995, Sajid Ji enriched the process further 
                  by incorporating unique color combinations into both Fakira Print and Banjara Dyeing.
                </p>
                
                <p>
                  Recognizing the need for consistency and scale, the family launched the Fakira Fab 
                  brand in 2021, implementing standardization across dyeing, printing, and quality 
                  control. With this, Fakira Fab began offering fabrics that combined traditional 
                  methods with modern quality assurance—creating textiles that are both artistic and reliable.
                </p>
                
                <p>
                  Today, we proudly offer a wide selection of handcrafted Indian fabrics, sourced 
                  and designed with a commitment to heritage, quality, and creativity.
                </p>
              </div>
              
              <div className="flex items-center space-x-4 md:space-x-6 pt-4">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-red-900">3</div>
                  <div className="text-xs md:text-sm text-gray-600">Generations</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-red-900">500+</div>
                  <div className="text-xs md:text-sm text-gray-600">Artisans</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-red-900">1000+</div>
                  <div className="text-xs md:text-sm text-gray-600">Unique Designs</div>
                </div>
              </div>
            </div>
            
            {/* Image Carousel */}
            <div className="relative">
              <div className="overflow-hidden shadow-xl relative">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {legacyImages.map((image, index) => (
                    <img
                      key={index}
                      src={generateCloudninaryUrl(image,800,600)}
                      alt={`Legacy image ${index + 1}`}
                      className="w-full h-64 md:h-80 object-cover flex-shrink-0"
                    />
                  ))}
                </div>
                
                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2  hover:bg-white text-gray-800 p-2 shadow-lg transition-all duration-200"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2  hover:bg-white text-gray-800  p-2 shadow-lg transition-all duration-200"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                
                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {legacyImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-8 h-0.5 transition-all duration-200 ${
                        currentSlide === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-red-900 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 md:space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Experience the Art of
                <span className="block">Traditional Block Printing</span>
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
                Discover our exquisite collection of handcrafted fabrics that bring together 
                centuries of tradition with contemporary design.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-900 px-6 md:px-8 py-3 md:py-4 font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 group">
                <Link to="/workshops">
                <span>Explore Our Collections</span>
                </Link>
                

                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              {/* Contact Button must take me to whatsapp */}
              <button className="border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 font-semibold hover:bg-white hover:text-red-900 transition-all duration-200">
                <a href="https://wa.me/919998042577?text=Hi%20I%20am%20interested%20in%20your%20artwork" target="_blank" rel="noopener noreferrer">
                Contact Our Artisans 
                </a>
                
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;