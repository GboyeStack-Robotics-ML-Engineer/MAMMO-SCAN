import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  image: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Amina Okafor",
    role: "Chief Radiologist",
    location: "Lagos University Teaching Hospital, Nigeria",
    image: "https://ui-avatars.com/api/?name=Amina+Okafor&background=6366f1&color=fff&size=200",
    quote: "Mammo Scan has transformed our diagnostic workflow. We can now process twice as many patients with the same staff, and the AI explanations help our junior radiologists learn faster.",
    rating: 5
  },
  {
    id: 2,
    name: "Dr. Kwame Mensah",
    role: "Oncologist",
    location: "Korle Bu Teaching Hospital, Ghana",
    image: "https://ui-avatars.com/api/?name=Kwame+Mensah&background=10b981&color=fff&size=200",
    quote: "Early detection rates have improved by 40% since we started using this system. The offline capability is crucial for our remote clinics with unreliable internet.",
    rating: 5
  },
  {
    id: 3,
    name: "Sarah Mutua",
    role: "Breast Cancer Survivor",
    location: "Nairobi, Kenya",
    image: "https://ui-avatars.com/api/?name=Sarah+Mutua&background=ec4899&color=fff&size=200",
    quote: "I was diagnosed at stage 1 thanks to this technology. My doctor said without the AI assistant, my small tumor might have been missed. I'm forever grateful.",
    rating: 5
  },
  {
    id: 4,
    name: "Dr. Ibrahim Hassan",
    role: "Hospital Administrator",
    location: "Muhimbili National Hospital, Tanzania",
    image: "https://ui-avatars.com/api/?name=Ibrahim+Hassan&background=f59e0b&color=fff&size=200",
    quote: "The cost-effectiveness is remarkable. We're providing world-class diagnostic support at a fraction of what traditional systems would cost. It's exactly what African healthcare needs.",
    rating: 5
  },
  {
    id: 5,
    name: "Dr. Fatima Diallo",
    role: "Resident Radiologist",
    location: "Dakar, Senegal",
    image: "https://ui-avatars.com/api/?name=Fatima+Diallo&background=8b5cf6&color=fff&size=200",
    quote: "As a young doctor, having an AI second opinion gives me confidence. The detailed explanations help me understand what I'm looking at and learn from every case.",
    rating: 5
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const goToTestimonial = (index: number) => {
    if (!isAnimating && index !== currentIndex) {
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-900/20 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Star className="w-4 h-4 fill-current" />
            Trusted by Healthcare Professionals
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Stories from the Field
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Real experiences from doctors, patients, and healthcare workers using Mammo Scan across Africa.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Main testimonial card */}
            <div
              className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 transition-all duration-500 ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <Quote className="w-12 h-12 text-brand-400 mb-6 opacity-50" />
              
              <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
                {/* Profile */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-32 h-32 rounded-full mb-4 border-4 border-brand-500/20 shadow-xl"
                  />
                  <h3 className="text-xl font-bold">{current.name}</h3>
                  <p className="text-brand-400 font-semibold text-sm mb-1">{current.role}</p>
                  <p className="text-slate-400 text-xs">{current.location}</p>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mt-3">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="flex items-center">
                  <p className="text-lg md:text-xl leading-relaxed text-slate-200">
                    "{current.quote}"
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-300 hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-brand-500'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
