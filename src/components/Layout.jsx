"use client"

import { useEffect, useState } from "react"
import Header from "../components/Header/index";
import { Outlet } from "react-router-dom"


const Layout = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`p-4 pt-24 flex-grow transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

