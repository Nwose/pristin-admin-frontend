import React from "react";
import LandingNav from "@/components/LandingNav";
import AboutHero from "@/components/AboutHero";
import CoreValues from "@/components/CoreValues";
import MeetTheTeam from "@/components/MeetTheTeam";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />
      <AboutHero />
      <CoreValues />
      <MeetTheTeam />
      <Footer />
    </div>
  );
}
