import React, { useState } from 'react';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote: "Love the simplicity of the service and the prompt customer support. We can't imagine working without it.",
    author: "Felicity Pierre",
    title: "Head of Design, Layers",
    company: "UX Agency",
    rating: 5
  },
  {
    quote: "The quality of fabrics and craftsmanship is exceptional. Every piece tells a story of tradition and artistry.",
    author: "Priya Sharma",
    title: "Fashion Designer",
    company: "Studio Craft",
    rating: 5
  },
  {
    quote: "Fakira Fab has transformed our understanding of sustainable fashion. Truly authentic handcrafted pieces.",
    author: "Arjun Mehta",
    title: "Creative Director",
    company: "Artisan Collective",
    rating: 5
  }
];

const AuthHeroImage: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const testimonial = testimonials[currentTestimonial];

  return (
    <div className="relative h-full min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Testimonial Card */}
      <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-md">
        <div className="mb-4">
          <div className="flex mb-3">
            {[...Array(testimonial.rating)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <blockquote className="text-gray-800 text-sm leading-relaxed mb-4">
            "{testimonial.quote}"
          </blockquote>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900 text-sm">{testimonial.author}</div>
            <div className="text-gray-600 text-xs">{testimonial.title}</div>
            <div className="text-gray-500 text-xs">{testimonial.company}</div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={prevTestimonial}
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Brand watermark */}
      <div className="absolute top-8 left-8">
        <div className="text-white/80 text-xs font-medium tracking-wide">
          © Fakira Fab 2026
        </div>
      </div>
    </div>
  );
};

export default AuthHeroImage;