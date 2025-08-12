import React from 'react';
import { ArrowRight, Heart, Leaf, Users, Award, Star, Globe } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-red-50 to-orange-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Celebrating Tradition Through 
                  <span className="text-red-900 block">Timeless Prints</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover the story behind our craft and community. From heritage block printing 
                  to modern artistry, we preserve traditions while creating contemporary masterpieces.
                </p>
              </div>
              
              <button className="bg-red-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-all duration-200 flex items-center space-x-2 group">
                <span>Explore Our Journey</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://setufairtrade.com/wp-content/uploads/2022/11/block-print.jpg"
                  alt="Traditional block printing artisan"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-lg font-semibold">Heritage Since 1960</p>
                  <p className="text-sm opacity-90">Preserving Traditional Craftsmanship</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Founder at work"
                  className="w-full h-80 object-cover"
                />
              </div>
              
              {/* Floating Achievement Card */}
              <div className="absolute -bottom-8 -right-8 bg-red-900 text-white rounded-xl p-6 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold">60+</div>
                  <div className="text-sm opacity-90">Years of Excellence</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-gray-900">Our Story</h2>
                <div className="w-16 h-1 bg-red-900 rounded"></div>
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
                  <span className="text-gray-700 font-medium">Passion Driven</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-red-900" />
                  <span className="text-gray-700 font-medium">Heritage Preserved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Process Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Our Craftsmanship Process</h2>
            <div className="w-16 h-1 bg-red-900 rounded mx-auto"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every piece tells a story of tradition, skill, and artistry passed down through generations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                title: "Hand-Carving Blocks",
                description: "Master craftsmen carve intricate patterns into wooden blocks with precision and artistry."
              },
              {
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                title: "Natural Dye Preparation",
                description: "Organic dyes prepared using traditional methods for vibrant, eco-friendly colors."
              },
              {
                image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                title: "Printing on Fabric",
                description: "Each pattern is carefully stamped by hand, creating unique and beautiful textiles."
              }
            ].map((step, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Artisans Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Meet Our Artisans</h2>
            <div className="w-16 h-1 bg-red-900 rounded mx-auto"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The heart of our craft lies in the skilled hands and creative spirits of our artisan community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Ramesh Kumar",
                location: "Rajasthan",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                quote: "Every block tells a story, every print carries our heritage forward."
              },
              {
                name: "Meera Devi",
                location: "Gujarat",
                image: "https://images.unsplash.com/photo-1494790108755-2616b332c8c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                quote: "In each pattern, I weave the dreams and traditions of my ancestors."
              },
              {
                name: "Suresh Patel",
                location: "Ahmedabad",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
                quote: "The art of block printing is not just work, it's a meditation of the soul."
              }
            ].map((artisan, index) => (
              <div key={index} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 text-center space-y-4 hover:shadow-lg transition-shadow duration-300">
                <div className="relative inline-block">
                  <img
                    src={artisan.image}
                    alt={artisan.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-red-900 text-white w-8 h-8 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{artisan.name}</h3>
                  <p className="text-red-900 font-medium">{artisan.location}</p>
                </div>
                <p className="text-gray-600 italic">"{artisan.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability & Impact Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Our Commitment</h2>
            <div className="w-16 h-1 bg-red-900 rounded mx-auto"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sustainability, ethics, and community empowerment are at the core of everything we do.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="h-8 w-8" />,
                title: "Eco-Friendly Dyes",
                description: "We use only natural, organic dyes that are safe for both artisans and the environment."
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Ethical Sourcing",
                description: "Fair trade practices ensure our artisans receive just compensation for their skilled work."
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Community Empowerment",
                description: "Supporting local communities by preserving traditional crafts and providing sustainable livelihoods."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-8 text-center space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full text-red-900">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Continuation Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-gray-900">Legacy Continues</h2>
                <div className="w-16 h-1 bg-red-900 rounded"></div>
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
              
              <div className="flex items-center space-x-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">3</div>
                  <div className="text-sm text-gray-600">Generations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">500+</div>
                  <div className="text-sm text-gray-600">Artisans</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900">1000+</div>
                  <div className="text-sm text-gray-600">Unique Designs</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Modern workshop"
                  className="w-full h-80 object-cover"
                />
              </div>
              
              <div className="absolute -top-8 -left-8 bg-white rounded-xl p-6 shadow-lg">
                <Globe className="h-8 w-8 text-red-900 mb-2" />
                <div className="text-sm text-gray-600">Reaching customers</div>
                <div className="text-xl font-bold text-gray-900">Worldwide</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-red-900 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Experience the Art of
                <span className="block">Traditional Block Printing</span>
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Discover our exquisite collection of handcrafted fabrics that bring together 
                centuries of tradition with contemporary design.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 group">
                <span>Explore Our Collections</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-red-900 transition-all duration-200">
                Contact Our Artisans
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;