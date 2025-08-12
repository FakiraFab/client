const WorkshopSection: React.FC<{ onRegisterClick: () => void }> = ({ onRegisterClick }) => {
    return (
      <section className="py-16 bg-white border-t border-gray-200 border-b border-gray-200  ">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            {/* Workshop Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dhkaucebl/image/upload/v1754541548/WhatsApp_Image_2024-07-27_at_13.05.06_b780f152_1_lpcth9.png"
                  alt="Block printing workshop with artisans"
                  className="w-full h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                />
                {/* Optional overlay for better text contrast */}
                <div className="absolute inset-0  bg-opacity-10 rounded-lg"></div>
              </div>
            </div>
  
            {/* Workshop Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-serif text-gray-800 mb-6 leading-tight">
                Register for our workshop
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md">
                Join our hands-on class and create beautiful fabric art using age-old block printing methods. 
                Discover the joy of handcrafting unique patterns with traditional block printing techniques.
              </p>
              <button
                onClick={onRegisterClick}
                className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-md font-medium transition-colors duration-200 transform hover:scale-105 shadow-md"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };


export default WorkshopSection;