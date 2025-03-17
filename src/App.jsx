"use client"

import Footer from "./components/Footer"
import { useAppContext } from "./contexts/appContext"
import NFTCard from "./components/NFTCard"
import useMintToken from "./hooks/useMintToken"
import { useEffect, useState, useRef } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"

function App() {
  const { nextTokenId, tokenMetaData, mintPrice } = useAppContext()
  const [isVisible, setIsVisible] = useState(false)
  const appRef = useRef(null)

  const tokenMetaDataArray = Array.from(tokenMetaData.values())
  const mintToken = useMintToken()

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const AnimatedSection = ({ children, delay = 0, className = "" }) => {
    const [sectionVisible, setSectionVisible] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setSectionVisible(true)
            observer.unobserve(entry.target)
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.1,
        },
      )

      if (sectionRef.current) {
        observer.observe(sectionRef.current)
      }

      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current)
        }
      }
    }, [])

    return (
      <div
        ref={sectionRef}
        className={`transition-all duration-1000 ${className} ${
          sectionVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    )
  }

  return (
    <div ref={appRef} className={`transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <main className="h-full min-h-[calc(100vh-128px)] p-4 pt-24">
        <AnimatedSection>
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <Icon icon="ph:cube-bold" className="w-64 h-64 text-cyan-500" />
            </div>
            <h1 className="text-5xl font-bold text-gradient-glow relative z-10">NEON NEXUS</h1>
            <p className="text-slate-300 font-medium mt-4 text-xl max-w-2xl mx-auto">
              Discover, collect, and trade unique digital assets on the blockchain
            </p>

            <div className="mt-8 flex justify-center">
              <button className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-glow rounded-full opacity-70 blur group-hover:opacity-100 transition duration-500 animate-glow"></div>
                <div className="relative px-6 py-3 bg-slate-800 rounded-full flex items-center gap-2 transition-all duration-300 group-hover:shadow-lg border border-cyan-500/30">
                  <Icon icon="ph:rocket-launch-bold" className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-medium">Explore NFTs</span>
                </div>
              </button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[
              {
                title: "Mint NFTs",
                description: "Create your own unique digital collectibles",
                icon: "ph:cube-bold",
                color: "from-cyan-400 to-cyan-600",
              },
              {
                title: "Manage Collection",
                description: "View and organize your digital assets",
                icon: "ph:squares-four-bold",
                color: "from-blue-400 to-blue-600",
              },
              {
                title: "Trade Assets",
                description: "Buy and sell NFTs on the marketplace",
                icon: "ph:currency-circle-dollar-bold",
                color: "from-teal-400 to-teal-600",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isVisible ? `fadeSlideIn 500ms ${index * 100 + 300}ms both` : "none",
                }}
              >
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <div className="p-6 bg-slate-800">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon
                      icon={item.icon}
                      className={`w-8 h-8 bg-gradient-to-r ${item.color} text-transparent bg-clip-text`}
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-white">{item.title}</h2>
                  <p className="text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <div className="mt-16 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gradient-primary">
                <Icon icon="ph:sparkle-bold" className="w-6 h-6 text-cyan-400" />
                <span>Featured NFTs</span>
              </h2>
              <button className="px-4 py-2 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2">
                <span>View All</span>
                <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {tokenMetaDataArray.map((token, i) => (
              <div
                key={token.name.split(" ").join("")}
                style={{
                  animationDelay: `${i * 100}ms`,
                  animation: isVisible ? `fadeSlideIn 500ms ${i * 100 + 500}ms both` : "none",
                }}
              >
                <NFTCard
                  metadata={token}
                  mintPrice={mintPrice}
                  tokenId={i}
                  nextTokenId={nextTokenId}
                  mintNFT={mintToken}
                />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  )
}

export default App

