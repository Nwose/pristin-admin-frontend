"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const VisualProductHighlights = () => {
  const [activeTab, setActiveTab] = useState("Investment Calculator");

  const tabs = ["Loan Application", "Investment Calculator", "Wallet Funding"];

  // Slideshow images
  const images = [
    "/images/laptop.png",
    "/images/laptop2.png",
    "/images/laptop3.png",
    "/images/laptop4.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#B8D4D1]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2C4A47] mb-3 sm:mb-4">
            Product Highlights
          </h2>
          <p className="text-base sm:text-lg text-[#5A7470] max-w-md mx-auto">
            See how our platform works in action
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-[#2C4A47] text-white shadow-lg"
                  : "bg-white/70 text-[#2C4A47] hover:bg-white hover:shadow-md"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Laptop Mockup with Slideshow */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#2C4A47] to-[#1E3330] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl overflow-hidden">
            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-10"
              aria-label="Previous"
            >
              <svg
                className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm z-10"
              aria-label="Next"
            >
              <svg
                className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Laptop Image Slideshow */}
            <div className="flex justify-center relative h-[220px] xs:h-[280px] sm:h-[320px] md:h-[375px]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute"
                >
                  <Image
                    src={images[currentIndex]}
                    alt={`${activeTab} Dashboard Preview`}
                    width={600}
                    height={375}
                    className="max-w-full h-auto rounded-md"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualProductHighlights;
