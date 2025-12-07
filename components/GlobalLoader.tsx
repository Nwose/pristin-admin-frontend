"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import React from "react";

function GlobalLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Show loader when navigation starts
  useEffect(() => {
    const handleClick = (e: MouseEvent | React.MouseEvent) => {
      if (!e.target) return;
      if (!(e.target instanceof HTMLElement)) return;
      const target = e.target.closest("a");
      if (target && target.href && !target.target) {
        const url = new URL(target.href);
        if (
          url.origin === window.location.origin &&
          url.pathname !== pathname
        ) {
          setLoading(true);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>

        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 bg-blue-500 rounded-full animate-pulse"></div>
      </div>

      {/* Optional loading text */}
      <span className="absolute mt-24 text-sm font-medium text-gray-600 animate-pulse">
        Loading...
      </span>
    </div>
  );
}

export default GlobalLoader;
