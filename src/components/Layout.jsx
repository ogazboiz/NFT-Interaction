"use client"

import { useEffect, useState } from "react"
import Header from "./Header/index"
import { Outlet } from "react-router-dom"


const Layout = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#13111C] noise-bg">
      {/* Background Elements */}
      <div className="fixed inset-0 cyberpunk-grid -z-10"></div>
      <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-[#FF3D71]/5 via-transparent to-transparent -z-10"></div>
      <div className="fixed bottom-0 right-0 w-full h-screen bg-gradient-to-t from-[#FF9E3D]/5 via-transparent to-transparent -z-10"></div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 rounded-full bg-[#FF3D71]/5 blur-3xl -z-10 animate-float"></div>
      <div
        className="fixed bottom-20 right-10 w-80 h-80 rounded-full bg-[#FF9E3D]/5 blur-3xl -z-10 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <Header />
      <main className={`p-4 pt-24 flex-grow transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

