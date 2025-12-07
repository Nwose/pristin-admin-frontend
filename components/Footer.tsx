"use client";

import React, { useState } from "react";
import { Linkedin, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-slate-800 text-white">
      {/* Subscription Section */}
      <div className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Subscribe</h2>

          {/* Email Subscription Form */}
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
          >
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-80 px-6 py-4 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Subscribe
            </button>
          </form>

          {/* Privacy Policy Text */}
          <p className="text-gray-300 text-sm mb-12">
            By subscribing you agree to with our{" "}
            <a href="#" className="text-white underline hover:text-gray-200">
              Privacy Policy
            </a>
          </p>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-8 mb-16">
            <a
              href="https://www.linkedin.com/company/pristin-capital/"
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://x.com/pristincapital?s=21"
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/pristincapital?igsh=MTN3MzJvbTVsemI3"
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>

          {/* Divider Line */}
          <div className="w-full h-px bg-gray-600 mb-8"></div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="py-6 px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          {/* Footer Links */}
          <div className="flex space-x-8 mb-4 sm:mb-0">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors underline"
            >
              Terms of Service
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-300 text-sm">2025. All right reserved.</div>
        </div>
      </div>
    </footer>
  );
}
