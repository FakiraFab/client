const FloralPatternSection = () => {
  return (
    <section className="w-full min-h-screen flex flex-col lg:flex-row">
      {/* Text Content Section */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1">
        <div className="max-w-md space-y-6 text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Floral Pattern
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Transform Ordinary Cloth into Extraordinary Creations with our Stunning Floral Prints.
          </p>
          <button className="inline-flex items-center justify-center px-8 py-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95">
            Shop now
          </button>
        </div>
      </div>
      
      {/* Image Section */}
      <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[50vh] lg:min-h-screen order-1 lg:order-2">
        <img
          src="https://www.fabvoguestudio.com/cdn/shop/files/70A4408copy2-min_4232986d-e586-467d-a4a4-e70ed0bce389.jpg?v=1753185451&width=1200"
          alt="Floral Pattern Fabric"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Optional overlay for depth */}
        {/* <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-l from-transparent to-black/10 lg:to-black/5"></div> */}
      </div>
    </section>
  );
};

export default FloralPatternSection;