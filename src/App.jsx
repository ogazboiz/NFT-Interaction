"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "./contexts/appContext"
import useMintToken from "./hooks/useMintToken"
import { Icon } from "@iconify/react/dist/iconify.js"
import { formatEther } from "ethers"
import Footer from "./components/Footer"

function App() {
  const { nextTokenId, tokenMetaData, mintPrice } = useAppContext()
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const tokenMetaDataArray = Array.from(tokenMetaData.values())
  const mintToken = useMintToken()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleMint = (tokenId) => {
    mintToken()
    // Visual feedback
    const element = document.getElementById(`nft-card-${tokenId}`)
    if (element) {
      element.classList.add("scale-95")
      setTimeout(() => {
        element.classList.remove("scale-95")
      }, 200)
    }
  }

  const isOwned = (tokenId) => Number(nextTokenId) > tokenId
  const canMint = (tokenId) => Number(nextTokenId) === tokenId

  const openDetails = (token, tokenId) => {
    setSelectedNFT({ ...token, tokenId })
    setShowDetails(true)
  }

  const closeDetails = () => {
    setShowDetails(false)
    setTimeout(() => setSelectedNFT(null), 300)
  }

  return (
    <div
      className={`min-h-screen bg-[#13111C] transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-[url('/bg-grid.svg')] bg-repeat opacity-5"></div>
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#FF3D71]/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#FF9E3D]/5 blur-3xl"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient-hot">IGNITE</span> YOUR COLLECTION
          </h1>
          <p className="text-[#E0E0E0] text-xl max-w-2xl mx-auto mb-10">
            Discover, mint, and collect unique digital assets on the blockchain
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-hot rounded-full opacity-70 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative px-6 py-3 bg-[#1A1625] rounded-full flex items-center gap-2 transition-all duration-300 group-hover:shadow-lg border border-[#FF3D71]/30">
                <Icon icon="ph:rocket-launch-bold" className="w-5 h-5 text-[#FF3D71]" />
                <span className="text-white font-medium">EXPLORE NFTs</span>
              </div>
            </button>

            <button className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF9E3D] to-[#FFCC33] rounded-full opacity-70 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative px-6 py-3 bg-[#1A1625] rounded-full flex items-center gap-2 transition-all duration-300 group-hover:shadow-lg border border-[#FF9E3D]/30">
                <Icon icon="ph:cube-bold" className="w-5 h-5 text-[#FF9E3D]" />
                <span className="text-white font-medium">MY COLLECTION</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Featured NFTs Section */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Icon icon="ph:fire-bold" className="w-8 h-8 text-[#FF3D71]" />
              <span className="text-gradient-hot">FEATURED NFTs</span>
            </h2>

            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-[#211A2E] text-[#FF3D71] hover:bg-[#2A2339] transition-colors duration-200">
                <Icon icon="ph:funnel-bold" className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#211A2E] text-[#FF3D71] hover:bg-[#2A2339] transition-colors duration-200 flex items-center gap-2">
                <span>VIEW ALL</span>
                <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tokenMetaDataArray.map((token, i) => (
              <div
                key={token.name.split(" ").join("")}
                id={`nft-card-${i}`}
                className="bg-[#1A1625] rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(255,61,113,0.2)] transition-all duration-300"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animation: isLoaded ? `fadeIn 500ms ${i * 100}ms both` : "none",
                }}
              >
                {/* Card Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={token.image || "/placeholder.svg"}
                    alt={token.name}
                    className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
                  />

                  {/* Price Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-[#13111C]/80 backdrop-blur-sm px-3 py-1.5">
                    <Icon icon="ph:currency-eth-bold" className="h-4 w-4 text-[#FF3D71]" />
                    <span className="text-white font-medium text-sm">{formatEther(mintPrice)} ETH</span>
                  </div>

                  {/* Info Button */}
                  <button
                    onClick={() => openDetails(token, i)}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-[#13111C]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[#FF3D71]/20 transition-all duration-200"
                  >
                    <Icon icon="ph:info-bold" className="h-4 w-4 text-white" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{token.name}</h3>
                  <p className="text-[#9E9E9E] text-sm mb-4 line-clamp-2">{token.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#211A2E] flex items-center justify-center">
                        <Icon icon="ph:cube-bold" className="w-4 h-4 text-[#FF9E3D]" />
                      </div>
                      <span className="text-[#E0E0E0] text-sm">{token.attributes.length} Attributes</span>
                    </div>

                    <button
                      disabled={!canMint(i)}
                      onClick={() => handleMint(i)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        isOwned(i)
                          ? "bg-[#211A2E]/40 text-[#9E9E9E]/50 cursor-not-allowed"
                          : canMint(i)
                            ? "bg-gradient-hot text-white hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                            : "bg-[#211A2E]/40 text-[#9E9E9E]/50 cursor-not-allowed"
                      }`}
                    >
                      {isOwned(i) ? "OWNED" : "MINT NFT"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NFT Details Modal */}
      {showDetails && (
        <div
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
            showDetails ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeDetails}
        >
          <div
            className={`w-full max-w-2xl transition-all duration-500 ${
              showDetails ? "opacity-100 transform scale-100" : "opacity-0 transform scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-hot p-0.5 rounded-2xl shadow-2xl">
              <div className="bg-[#13111C] rounded-xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* NFT Image */}
                  <div className="md:w-1/2">
                    <div className="relative h-64 md:h-full">
                      <img
                        src={selectedNFT?.image || "/placeholder.svg"}
                        alt={selectedNFT?.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  {/* NFT Details */}
                  <div className="md:w-1/2 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold text-white">{selectedNFT?.name}</h2>
                      <button
                        onClick={closeDetails}
                        className="w-8 h-8 rounded-full bg-[#211A2E] flex items-center justify-center hover:bg-[#FF3D71]/20 transition-colors duration-200"
                      >
                        <Icon icon="ph:x-bold" className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="text-sm text-[#9E9E9E]">Description</h3>
                        <p className="text-[#E0E0E0]">{selectedNFT?.description}</p>
                      </div>

                      <div className="flex gap-4">
                        <div>
                          <h3 className="text-sm text-[#9E9E9E]">Token ID</h3>
                          <p className="text-[#E0E0E0]">{selectedNFT?.tokenId}</p>
                        </div>

                        <div>
                          <h3 className="text-sm text-[#9E9E9E]">Price</h3>
                          <p className="flex items-center gap-1 text-[#E0E0E0]">
                            <Icon icon="ph:currency-eth-bold" className="h-4 w-4 text-[#FF3D71]" />
                            {formatEther(mintPrice)} ETH
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm text-[#9E9E9E] mb-2">Attributes</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedNFT?.attributes.map((attr, index) => (
                            <div key={index} className="rounded-lg bg-[#211A2E] p-2">
                              <p className="text-xs text-[#9E9E9E]">{attr.trait_type}</p>
                              <p className="text-sm font-medium text-white">{attr.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={!canMint(selectedNFT?.tokenId)}
                      onClick={() => {
                        handleMint(selectedNFT?.tokenId)
                        closeDetails()
                      }}
                      className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                        isOwned(selectedNFT?.tokenId)
                          ? "bg-[#211A2E] text-[#9E9E9E]/50 cursor-not-allowed"
                          : canMint(selectedNFT?.tokenId)
                            ? "bg-gradient-hot hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                            : "bg-[#211A2E] text-[#9E9E9E]/50 cursor-not-allowed"
                      }`}
                    >
                      {isOwned(selectedNFT?.tokenId) ? "ALREADY OWNED" : "MINT THIS NFT"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-16 px-4 relative bg-[#1A1625] skew-y-1">
        <div className="max-w-7xl mx-auto -skew-y-1">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-gradient-warm">PLATFORM FEATURES</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "MINT NFTs",
                description: "Create your own unique digital collectibles with one click",
                icon: "ph:cube-bold",
                color: "from-[#FF3D71] to-[#FF9E3D]",
              },
              {
                title: "MANAGE COLLECTION",
                description: "View and organize your digital assets in one place",
                icon: "ph:stack-bold",
                color: "from-[#FF9E3D] to-[#FFCC33]",
              },
              {
                title: "TRADE ASSETS",
                description: "Buy and sell NFTs on our secure marketplace",
                icon: "ph:currency-circle-dollar-bold",
                color: "from-[#FF3D71] to-[#FFCC33]",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="bg-[#13111C] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isLoaded ? `fadeIn 500ms ${index * 100 + 300}ms both` : "none",
                }}
              >
                <div className={`h-1 bg-gradient-to-r ${feature.color}`}></div>
                <div className="p-6">
                  <div className="hexagon w-16 h-16 bg-[#211A2E] flex items-center justify-center mb-4">
                    <Icon
                      icon={feature.icon}
                      className={`w-8 h-8 bg-gradient-to-r ${feature.color} text-transparent bg-clip-text`}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-[#9E9E9E]">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default App

