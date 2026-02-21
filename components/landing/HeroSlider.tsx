"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Advanced Healthcare Solutions",
    subtitle: "Premium products designed for your everyday wellbeing.",
    image: "/hero-1.jpg",
    cta: "Shop Collection",
    link: "/shop/",
  },
  {
    id: 2,
    title: "Nature Meets Science",
    subtitle: "100% Organic ingredients with laboratory-proven results.",
    image: "/hero-2.jpg",
    cta: "View Organic Range",
    link: "/shop/",
  },
  {
    id: 3,
    title: "Immunity Boosters",
    subtitle: "Strengthen your defense with our vitamin-rich supplements.",
    image: "/hero-3.jpg",
    cta: "Explore Supplements",
    link: "/shop/",
  },
  {
    id: 4,
    title: "Skincare Reimagined",
    subtitle: "Dermatologically tested formulas for sensitive skin.",
    image: "/hero-4.jpg",
    cta: "Shop Skincare",
    link: "/shop/",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // Autoplay Logic with Pause functionality
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative mt-20 pt-24 h-[60vh] w-full overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Optimized Background Image */}
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            priority={current === 0}
            className="object-cover brightness-[0.4]"
            sizes="100vw"
          />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight"
            >
              {slides[current].title}
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg md:text-2xl mb-10 max-w-3xl font-light text-gray-200"
            >
              {slides[current].subtitle}
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link href={slides[current].link}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg cursor-pointer transition-colors"
                >
                  {slides[current].cta}
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto p-3 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-all active:scale-90"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto p-3 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-all active:scale-90"
          aria-label="Next Slide"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              index === current
                ? "bg-white w-10"
                : "bg-white/40 w-4 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
