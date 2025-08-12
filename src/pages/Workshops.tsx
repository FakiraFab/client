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
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-8 lg:px-20 py-16 lg:py-24">
          <h1 className="text-5xl lg:text-6xl font-light text-black mb-6 leading-tight">
            Block Printing<br />
            Workshop
          </h1>
          <p className="text-gray-600 text-base leading-relaxed max-w-sm">
            Join our hands-on class and create beautiful fabric art pieces using traditional methods. Discover the joy of handcrafting unique patterns with traditional block printing techniques.
          </p>
        </div>
        <div className="relative px-8 lg:px-0">
          <div className="h-64 lg:h-80 bg-gray-300 mb-4 relative overflow-hidden">
            <img
              src="https://yogipod.co.uk/wp-content/uploads/2024/06/Yogipod-block-printing-984x554.jpg?x62763"
              alt="Block printing pattern creation"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-32 lg:h-40 bg-gray-200 relative overflow-hidden">
            <img
              src="https://www.cottonmonk.com/wp-content/uploads/2024/09/Block-Printing.jpg"
              alt="Workshop participants"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="px-8 lg:px-20 py-12">
        <h2 className="text-lg font-normal text-black mb-8">Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workshops.length > 0 ? (
            workshops.map((workshop: Workshop) => (
              <div key={workshop._id} className="bg-white border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-black mb-1">{workshop.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {workshop.registrationsCount}/{workshop.maxParticipants} slots filled
                </p>
                <p className="text-gray-700 text-sm mb-6 leading-relaxed">{workshop.description}</p>
                <div className="mb-6">
                  <span className="text-2xl font-bold text-black">₹{workshop.price}</span>
                </div>
                <button
                  className="w-full bg-red-600 text-white py-2.5 px-4 text-sm font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400"
                  onClick={() => openModal(workshop)}
                  disabled={workshop.registrationsCount >= workshop.maxParticipants}
                >
                  {workshop.registrationsCount >= workshop.maxParticipants ? 'Workshop Full' : 'Book class'}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center col-span-3 text-gray-600">No workshops available at the moment.</div>
          )}
        </div>
      </div>

      {/* Registration Steps Section */}
      <div className="px-8 lg:px-20 py-12 bg-gray-50">
        <h2 className="text-lg font-normal text-black mb-8">Registration Steps</h2>
        <div className="space-y-4 max-w-3xl">
          {registrationSteps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-full ${step.bgColor} flex items-center justify-center text-black text-sm font-medium flex-shrink-0`}>
                {step.step}
              </div>
              <div className="flex-1 pt-2">
                <p className="text-gray-800 text-sm leading-relaxed">{step.title}</p>
              </div>
            </div>
          ))}
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