"use client"

import { useEffect, useState, useRef } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false)
  const footerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [])

  return (
    <footer
      ref={footerRef}
      className={`relative py-12 transition-all duration-1000 ${
        isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
      }`}
    >
      <div className="absolute inset-0 bg-[#1A1625] skew-y-1"></div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <div className="relative w-8 h-8 mr-2">
                <div className="absolute inset-0 bg-gradient-hot rounded-md blur-sm animate-pulse"></div>
                <div className="relative w-full h-full bg-[#13111C] rounded-md flex items-center justify-center">
                  <Icon icon="ph:fire-bold" className="w-5 h-5 text-[#FF3D71]" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-wider text-gradient-hot">IGNITE</span>
            </div>
            <p className="text-[#9E9E9E] text-sm text-center md:text-left">
              Discover, collect, and trade unique digital assets in our vibrant NFT marketplace
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-white font-bold mb-4 text-lg">Connect With Us</h3>
            <div className="flex gap-4">
              {[
                { icon: "ph:twitter-logo-bold", label: "Twitter" },
                { icon: "ph:discord-logo-bold", label: "Discord" },
                { icon: "ph:instagram-logo-bold", label: "Instagram" },
                { icon: "ph:github-logo-bold", label: "GitHub" },
              ].map((social, index) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="relative group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible ? `fadeIn 500ms ${index * 100}ms both` : "none",
                  }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-hot rounded-md opacity-0 blur-sm group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-10 h-10 bg-[#211A2E] rounded-md flex items-center justify-center transition-all duration-300 group-hover:bg-[#13111C]">
                    <Icon
                      icon={social.icon}
                      className="w-5 h-5 text-[#FF3D71] group-hover:text-[#FF9E3D] transition-colors duration-300"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-end">
            <p className="text-[#9E9E9E] text-sm">&copy; 2025 cohort XII</p>
            <p className="text-[#9E9E9E]/70 text-xs mt-2">All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

