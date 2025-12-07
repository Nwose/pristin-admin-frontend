"use client";

import Image from "next/image";
import { BsFillBellFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { useState, useEffect } from "react";

const settingsOptions = [
  {
    id: 1,
    title: "Notifications",
    icon: <BsFillBellFill className="w-6 h-6" />,
    hasNotification: true,
  },
  {
    id: 2,
    title: "Security",
    icon: <FaLock className="w-6 h-6" />,
    hasNotification: false,
  },
];

export default function QuickSettings() {
  const images = [
    "/images/t1.png",
    "/images/t2.png",
    "/images/t3.png",
    "/images/t4.png",
  ];
  const [current, setCurrent] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div
      className="bg-white rounded-lg border border-[#ccEaE9]"
      style={{
        width: "1104px",
        height: "176px",
        borderRadius: "8px",
        border: "1px solid #ccEaE9",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 className="text-lg font-semibold text-[#001B2E] mb-3">
        Quick Settings
      </h3>

      <div className="flex flex-row gap-2 items-center flex-1 overflow-hidden">
        {/* Settings Options */}
        <div className="flex-1 flex justify-start overflow-hidden">
          <div className="grid grid-cols-2 gap-2">
            {settingsOptions.map((option) => (
              <button
                key={option.id}
                className={`bg-white transition-shadow hover:shadow-md`}
                style={{
                  width: "257px",
                  height: "78px",
                  borderRadius: "4px",
                  border: "1px solid #c7c9d9",
                  marginTop: "0px",
                  marginLeft: "0px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className="relative mb-1">
                    <span className="text-[#001B2E]">{option.icon}</span>
                    {option.hasNotification && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full flex items-center justify-center text-[8px] text-white font-semibold">
                        15
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#001B2E]">
                    {option.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Promo Image */}
        <div className="flex justify-end items-center pr-2">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl relative overflow-hidden w-[400px] h-[140px]">
            {images.map((src, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 rounded-2xl ${
                  index === current ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={src}
                  alt={`Promo ${index + 1}`}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === current ? "bg-white" : "bg-white/50"
                  } hover:bg-white transition-colors`}
                  onClick={() => setCurrent(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
