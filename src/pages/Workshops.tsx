import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllWorkshops, createRegistration } from '../api/workshopApi';

// Interface for workshop data
interface Workshop {
  _id: string;
  name: string;
  description: string;
  price: number;
  maxParticipants: number;
  registrationsCount: number;
}

// Interface for registration form data
interface RegistrationForm {
  workshopId: string;
  fullName: string;
  age: number;
  institution: string;
  educationLevel: string;
  email: string;
  contactNumber: string;
  specialRequirements?: string;
}

const Workshops = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState<RegistrationForm>({
    workshopId: '',
    fullName: '',
    age: 0,
    institution: '',
    educationLevel: '',
    email: '',
    contactNumber: '',
    specialRequirements: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch workshops using TanStack Query
  const { data: workshops = [], isLoading, error } = useQuery<Workshop[]>({
    queryKey: ['workshops'],
    queryFn: getAllWorkshops,
    select: (data) => data || [],
  });

  // Create registration mutation
  const mutation = useMutation({
    mutationFn: createRegistration,
    onSuccess: () => {
      setToastMessage('Your request for registration has been registered successfully! You will get confirmation in some time.');
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
      setTimeout(() => {
        setIsModalOpen(false);
        setShowPaymentStep(false);
        setToastMessage(null);
      }, 3000); // Close modal and clear toast after 3 seconds
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.message || 'Registration failed. Please try again.');
    },
    onSettled: () => {
      // Reset form and proceed to payment step regardless of success or failure
      setShowPaymentStep(false);
      setFormData({
        workshopId: '',
        fullName: '',
        age: 0,
        institution: '',
        educationLevel: '',
        email: '',
        contactNumber: '',
        specialRequirements: '',
      });
    },
  });

  // Clear form error when opening modal
  useEffect(() => {
    if (isModalOpen) {
      setFormError(null);
    }
  }, [isModalOpen]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'age' ? parseInt(value) || 0 : value 
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setToastMessage(null);

    if (selectedWorkshop && formData.workshopId) {
      mutation.mutate({
        workshopId: formData.workshopId,
        fullName: formData.fullName,
        age: formData.age,
        institution: formData.institution,
        educationLevel: formData.educationLevel,
        email: formData.email,
        contactNumber: formData.contactNumber,
        specialRequirements: formData.specialRequirements,
      });
    }
  };

  // Open modal and set selected workshop
  const openModal = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setFormData((prev) => ({ ...prev, workshopId: workshop._id }));
    setIsModalOpen(true);
    setShowPaymentStep(false);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWorkshop(null);
    setShowPaymentStep(false);
    setFormError(null);
    setToastMessage(null);
    setFormData({
      workshopId: '',
      fullName: '',
      age: 0,
      institution: '',
      educationLevel: '',
      email: '',
      contactNumber: '',
      specialRequirements: '',
    });
  };

  // Proceed to payment step
  const proceedToPayment = () => {
    setShowPaymentStep(true);
  };

  const registrationSteps = [
    {
      step: 1,
      title: "Select your preferred block print class and fill in your details in the registration form.",
      bgColor: "bg-pink-200"
    },
    {
      step: 2,
      title: "Scan the QR code provided to make the payment.",
      bgColor: "bg-red-200"
    },
    {
      step: 3,
      title: "Wait for approval, which will be shared with you via email or message.",
      bgColor: "bg-red-300"
    }
  ];

  if (isLoading) return <div className="text-center p-20">Loading workshops...</div>;
  if (error) return <div className="text-center p-20 text-red-600">Error loading workshops: {error.message}</div>;

  return (
    <div className="min-h-screen p-20 bg-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
            <p className="text-sm">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/20 via-transparent to-red-100/20"></div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          <div className="flex flex-col justify-center px-8 lg:px-20 py-16 lg:py-24 z-10">
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent text-sm font-semibold tracking-wide uppercase mb-4">
                Traditional Craft Workshop
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Block Printing<br />
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Workshop
                </span>
              </h1>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed max-w-lg mb-8">
              Join our hands-on masterclass and create beautiful fabric art pieces using traditional methods. 
              Discover the timeless joy of handcrafting unique patterns with authentic block printing techniques 
              passed down through generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Explore Workshops
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-orange-500 hover:text-orange-500 transition-all duration-300">
                Watch Videos
              </button>
            </div>
          </div>
          <div className="relative px-8 lg:px-12 py-8 lg:py-16">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-red-400 to-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
              
              <div className="relative z-10">
                <div className="h-64 lg:h-80 bg-white rounded-2xl mb-6 relative overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://yogipod.co.uk/wp-content/uploads/2024/06/Yogipod-block-printing-984x554.jpg?x62763"
                    alt="Block printing pattern creation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="h-32 lg:h-40 bg-white rounded-2xl relative overflow-hidden shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://www.cottonmonk.com/wp-content/uploads/2024/09/Block-Printing.jpg"
                    alt="Workshop participants"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="px-8 lg:px-20 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Workshops</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our carefully curated selection of traditional block printing workshops designed for all skill levels
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.length > 0 ? (
            workshops.map((workshop: Workshop) => (
              <div key={workshop._id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                {/* Card Header with Gradient */}
                <div className="relative h-48 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-6 text-white">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Traditional Craft</span>
                    </div>
                  </div>
                  {/* Floating availability badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      workshop.registrationsCount >= workshop.maxParticipants 
                        ? 'bg-red-500 text-white' 
                        : workshop.registrationsCount / workshop.maxParticipants > 0.8
                        ? 'bg-orange-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      {workshop.registrationsCount >= workshop.maxParticipants 
                        ? 'Full' 
                        : `${workshop.maxParticipants - workshop.registrationsCount} spots left`
                      }
                    </div>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {workshop.name}
                    </h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${(workshop.registrationsCount / workshop.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      {workshop.registrationsCount}/{workshop.maxParticipants} participants enrolled
                    </p>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-6 leading-relaxed line-clamp-3">
                    {workshop.description}
                  </p>
                  
                  {/* Price and Features */}
                  <div className="mb-6">
                    <div className="flex items-baseline space-x-2 mb-3">
                      <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        ₹{workshop.price}
                      </span>
                      <span className="text-sm text-gray-500">per person</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        ✨ All Materials Included
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        🎓 Certificate Provided
                      </span>
                    </div>
                  </div>
                  
                  <button
                    className={`w-full py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 transform ${
                      workshop.registrationsCount >= workshop.maxParticipants
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-105 shadow-lg hover:shadow-xl'
                    }`}
                    onClick={() => openModal(workshop)}
                    disabled={workshop.registrationsCount >= workshop.maxParticipants}
                  >
                    {workshop.registrationsCount >= workshop.maxParticipants ? '🚫 Workshop Full' : '🎨 Book Your Spot'}
                  </button>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 transition-all duration-300 pointer-events-none rounded-2xl"></div>
              </div>
            ))
          ) : (
            <div className="text-center col-span-full py-12">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No workshops available</h3>
              <p className="text-gray-600">Check back soon for exciting new workshops!</p>
            </div>
          )}
        </div>
      </div>

      {/* Past Workshops Video Section */}
      <div className="px-8 lg:px-20 py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Workshop Highlights</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Watch our past workshop sessions and see the amazing creations our participants have made
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Video 1 */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=300&fit=crop"
                alt="Block printing workshop session"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-0 h-0 border-l-[12px] border-r-0 border-b-[8px] border-t-[8px] border-l-white border-r-transparent border-b-transparent border-t-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  🔴 LIVE
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                Beginner's Block Printing Journey
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Watch how complete beginners create their first masterpiece in this 2-hour intensive workshop session.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">👥 24 participants</span>
                <span className="text-xs text-gray-500">⏱️ 15 min</span>
              </div>
            </div>
          </div>

          {/* Video 2 */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500&h=300&fit=crop"
                alt="Advanced pattern making workshop"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-0 h-0 border-l-[12px] border-r-0 border-b-[8px] border-t-[8px] border-l-white border-r-transparent border-b-transparent border-t-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  ⭐ POPULAR
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                Advanced Pattern Techniques
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Discover intricate pattern-making secrets and advanced block printing techniques used by master craftsmen.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">👥 18 participants</span>
                <span className="text-xs text-gray-500">⏱️ 22 min</span>
              </div>
            </div>
          </div>

          {/* Video 3 */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop"
                alt="Traditional fabric dyeing workshop"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-0 h-0 border-l-[12px] border-r-0 border-b-[8px] border-t-[8px] border-l-white border-r-transparent border-b-transparent border-t-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  🆕 NEW
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                Natural Dye Workshop
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Learn the ancient art of creating natural dyes from plants and herbs for authentic block printing.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">👥 12 participants</span>
                <span className="text-xs text-gray-500">⏱️ 18 min</span>
              </div>
            </div>
          </div>

          {/* Video 4 */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop"
                alt="Kids block printing workshop"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-0 h-0 border-l-[12px] border-r-0 border-b-[8px] border-t-[8px] border-l-white border-r-transparent border-b-transparent border-t-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  👶 KIDS
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                Kids Creative Workshop
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Watch young artists (ages 8-14) discover the joy of traditional crafts in this specially designed session.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">👥 16 participants</span>
                <span className="text-xs text-gray-500">⏱️ 12 min</span>
              </div>
            </div>
          </div>

          {/* Video 5 */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500&h=300&fit=crop"
                alt="Group collaboration workshop"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-0 h-0 border-l-[12px] border-r-0 border-b-[8px] border-t-[8px] border-l-white border-r-transparent border-b-transparent border-t-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  🤝 TEAM
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                Collaborative Art Project
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Teams work together to create a large-scale block printed mural showcasing traditional motifs.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">👥 30 participants</span>
                <span className="text-xs text-gray-500">⏱️ 25 min</span>
              </div>
            </div>
          </div>

          {/* Video 6 */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"
                alt="Master craftsman demonstration"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-0 h-0 border-l-[12px] border-r-0 border-b-[8px] border-t-[8px] border-l-white border-r-transparent border-b-transparent border-t-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  🎯 MASTER
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                Master Craftsman Demo
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Watch a 60-year-old master craftsman demonstrate centuries-old techniques passed down through generations.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">👥 45 participants</span>
                <span className="text-xs text-gray-500">⏱️ 35 min</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* View More Videos Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            📺 View All Workshop Videos
          </button>
        </div>
      </div>

      {/* Registration Steps Section */}
      <div className="px-8 lg:px-20 py-16 bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Register</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Follow these simple steps to secure your spot in our traditional block printing workshops
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {registrationSteps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connector Line (hidden on mobile) */}
                {index < registrationSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-200 to-red-200 transform translate-x-4 z-0"></div>
                )}
                
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100 group-hover:border-orange-300">
                  {/* Step Number */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  
                  {/* Step Icon */}
                  <div className="text-center mb-4">
                    <div className="text-4xl">
                      {index === 0 && '🎨'}
                      {index === 1 && '💳'}
                      {index === 2 && '✉️'}
                    </div>
                  </div>
                  
                  {/* Step Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                    {index === 0 && 'Choose & Register'}
                    {index === 1 && 'Make Payment'}
                    {index === 2 && 'Get Confirmation'}
                  </h3>
                  
                  {/* Step Description */}
                  <p className="text-gray-600 text-sm leading-relaxed text-center">
                    {step.title}
                  </p>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-red-400 to-pink-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Creative Journey?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of artists who have discovered the timeless beauty of traditional block printing. 
                Book your workshop today and take home your handcrafted masterpiece!
              </p>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                🚀 Browse Workshops Above
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {!showPaymentStep ? (
              <>
                <h2 className="text-2xl font-medium text-black mb-6">
                  Register for {selectedWorkshop?.name}
                </h2>
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                      min="1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    >
                      <option value="">Select Education Level</option>
                      <option value="High School">High School</option>
                      <option value="College">College</option>
                      <option value="University">University</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements (Optional)</label>
                    <textarea
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      rows={3}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Note: You can only register once per email for each workshop.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="py-2 px-4 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={proceedToPayment}
                      className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-medium text-black mb-6">
                  Payment for {selectedWorkshop?.name}
                </h2>
                {formError && <p className="text-red-600 text-sm mb-4">{formError}</p>}
                <div className="mb-6">
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 mb-2">Amount to Pay:</p>
                    <p className="text-2xl font-bold text-black">₹{selectedWorkshop?.price}</p>
                  </div>
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-3">Scan QR Code to Pay</p>
                    <div className="bg-white border-2 border-gray-200 p-4 rounded-lg inline-block">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://pay.google.com/pay"
                        alt="Payment QR Code"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Please manually enter the amount: ₹{selectedWorkshop?.price}
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowPaymentStep(false)}
                        className="py-2 px-4 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-400"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? 'Submitting...' : 'Submit Registration'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workshops;