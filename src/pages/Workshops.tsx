const Workshops = () => {
  const workshopOptions = [
    {
      title: "Level 1",
      subtitle: "Best suited for beginners",
      description: "Learn basic printing techniques, create beautiful fabric art.",
      price: "₹40",
      buttonText: "Book class"
    },
    {
      title: "Level 2", 
      subtitle: "Best suited for Intermediates",
      description: "Create complex designs and multi-layered patterns on fabric.",
      price: "₹140",
      buttonText: "Book class"
    },
    {
      title: "Level 3",
      subtitle: "Best suited for experts",
      description: "Master advanced techniques and create intricate textile designs.",
      price: "₹240", 
      buttonText: "Book class"
    }
  ];

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

  return (
    <div className="min-h-screen p-20 bg-white">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left side - Text content */}
        <div className="flex flex-col justify-center px-8 lg:px-20 py-16 lg:py-24">
          <h1 className="text-5xl lg:text-6xl font-light text-black mb-6 leading-tight">
            Block Printing<br />
            Workshop
          </h1>
          <p className="text-gray-600 text-base leading-relaxed max-w-sm">
            Join our hands-on class and create beautiful fabric art pieces using traditional methods. Discover the joy of handcrafting unique patterns with traditional block printing techniques.
          </p>
        </div>
        

        {/* Right side - Images */}
<div className="relative px-8 lg:px-0">
  {/* Main large image */}
  <div className="h-64 lg:h-80 bg-gray-300 mb-4 relative overflow-hidden">
    <img
      src="https://yogipod.co.uk/wp-content/uploads/2024/06/Yogipod-block-printing-984x554.jpg?x62763"
      alt="Block printing pattern creation"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Small image below */}
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
          {workshopOptions.map((option, index) => (
            <div key={index} className="bg-white border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-black mb-1">{option.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{option.subtitle}</p>
              <p className="text-gray-700 text-sm mb-6 leading-relaxed">{option.description}</p>
              
              <div className="mb-6">
                <span className="text-2xl font-bold text-black">{option.price}</span>
              </div>
              
              <button className="w-full bg-red-600 text-white py-2.5 px-4 text-sm font-medium hover:bg-red-700 transition-colors">
                {option.buttonText}
              </button>
            </div>
          ))}
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
    </div>
  );
};

export default Workshops;