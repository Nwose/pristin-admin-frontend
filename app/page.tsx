import React from "react";
import LandingNav from "@/components/LandingNav";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import VisualProductHighlights from "@/components/VisualProductHighlights";
import WhyTrustPristin from "@/components/WhyTrustPristin";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />
      <Hero />
      <FeaturesSection />
      <VisualProductHighlights />
      <HowItWorks /> 
      <WhyTrustPristin />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
