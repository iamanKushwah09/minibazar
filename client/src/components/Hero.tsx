'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const heroSlides = [
  {
    id: 1,
    title: "Authentic Indian Spices",
    subtitle: "Premium quality whole and blended spices sourced directly from the finest farms",
    cta: "Shop Spices",
    link: "/",
    image: "/images/hero/hero1.png",
    bg: "bg-orange-900/40",
  },
  {
    id: 2,
    title: "Rich Culinary Heritage",
    subtitle: "Elevate your daily cooking with our expertly crafted traditional masala blends",
    cta: "Explore Blends",
    link: "/",
    image: "/images/hero/hero2.png",
    bg: "bg-amber-900/40",
  },
  {
    id: 3,
    title: "Pure & Fresh Ingredients",
    subtitle: "100% natural, unadulterated spices ensuring the perfect aroma and taste in every dish",
    cta: "Shop Essentials",
    link: "/",
    image: "/images/hero/hero3.png",
    bg: "bg-red-900/40",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(400px, 60vw, 700px)' }}>
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] scale-110"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)'
            }}
          />
          {/* Overlay */}
          <div className={`absolute inset-0 ${slide.bg} backdrop-blur-[2px]`} />
          
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-4 sm:mb-6 drop-shadow-2xl">
                {slide.title}
              </h1>
              <p className="text-base sm:text-xl md:text-2xl text-white/90 font-medium tracking-wide mb-8 sm:mb-12 drop-shadow-lg max-w-2xl">
                {slide.subtitle}
              </p>
              <Link
                href={slide.link}
                className="inline-block bg-white text-blue-900 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-sm sm:text-base uppercase tracking-[0.2em] hover:bg-blue-50 transition-all active:scale-95 shadow-2xl hover:shadow-blue-500/20"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 sm:p-4 rounded-full transition-all z-20 border border-white/20"
      >
        <ChevronLeftIcon className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 sm:p-4 rounded-full transition-all z-20 border border-white/20"
      >
        <ChevronRightIcon className="h-6 w-6 sm:h-8 sm:w-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? 'w-12 h-3 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                : 'w-3 h-3 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
