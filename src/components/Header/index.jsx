"use client"

import { useState, useEffect } from "react"
import WalletConnection from "./WalletConnection"
import { Icon } from "@iconify/react/dist/iconify.js"

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("explore")

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  const navItems = [
    { id: "explore", label: "EXPLORE", icon: "ph:planet-bold" },
    { id: "create", label: "CREATE", icon: "ph:magic-wand-bold" },
    { id: "collection", label: "COLLECTION", icon: "ph:stack-bold" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-effect py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative w-10 h-10 mr-3">
              <div className="absolute inset-0 bg-gradient-hot rounded-md blur-sm animate-pulse"></div>
              <div className="relative w-full h-full bg-[#13111C] rounded-md flex items-center justify-center">
                <Icon icon="ph:fire-bold" className="w-6 h-6 text-[#FF3D71]" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-wider text-gradient-hot">IGNITE</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`group flex flex-col items-center transition-all duration-300 ${
                  activeSection === item.id ? "text-[#FF3D71]" : "text-white hover:text-[#FF9E3D]"
                }`}
              >
                <Icon
                  icon={item.icon}
                  className={`w-5 h-5 mb-1 transition-transform duration-300 group-hover:scale-110 ${
                    activeSection === item.id ? "text-[#FF3D71]" : "text-white group-hover:text-[#FF9E3D]"
                  }`}
                />
                <span className="text-xs font-medium tracking-wider">{item.label}</span>
                <div
                  className={`h-0.5 w-0 bg-[#FF3D71] transition-all duration-300 mt-1 ${
                    activeSection === item.id ? "w-full" : "group-hover:w-full"
                  }`}
                ></div>
              </button>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center">
            <WalletConnection />

            {/* Mobile Menu Button */}
            <button
              className="ml-4 md:hidden relative z-10 w-10 h-10 flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="relative w-8 h-8 flex flex-col items-center justify-center">
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 glass-effect z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center gap-10">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                setMenuOpen(false)
              }}
              className={`flex flex-col items-center transition-all duration-300 ${
                activeSection === item.id ? "text-[#FF3D71]" : "text-white"
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: menuOpen ? "slideUp 0.5s ease-out forwards" : "none",
              }}
            >
              <Icon
                icon={item.icon}
                className={`w-8 h-8 mb-2 ${activeSection === item.id ? "text-[#FF3D71]" : "text-white"}`}
              />
              <span className="text-lg font-medium tracking-wider">{item.label}</span>
              <div
                className={`h-0.5 w-0 bg-[#FF3D71] transition-all duration-300 mt-2 ${
                  activeSection === item.id ? "w-full" : ""
                }`}
              ></div>
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header

