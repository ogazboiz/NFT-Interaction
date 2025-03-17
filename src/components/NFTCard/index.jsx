"use client"

import { useState } from "react"
import { formatEther } from "ethers"
import { truncateString } from "../../utils"
import { Icon } from "@iconify/react/dist/iconify.js"

const NFTCard = ({ metadata, mintPrice, tokenId, nextTokenId, mintNFT }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const handleMint = () => {
    setIsClicked(true)
    mintNFT()
    setTimeout(() => setIsClicked(false), 300)
  }

  const isOwned = Number(nextTokenId) > tokenId

  return (
    <div
      className="card-flip h-[450px] w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        if (!isClicked) setIsFlipped(false)
      }}
    >
      <div className={`card-flip-inner h-full w-full ${isFlipped ? "transform rotateY(180deg)" : ""}`}>
        {/* Front of card */}
        <div className="card-flip-front h-full w-full">
          <div
            className={`h-full w-full card-neo transition-all duration-300 ${
              isHovered ? "shadow-[0_0_20px_rgba(255,61,113,0.3)]" : ""
            } ${isClicked ? "scale-95" : ""}`}
          >
            {/* Card Image */}
            <div className="relative h-[65%] overflow-hidden rounded-t-xl">
              <img
                src={metadata.image || "/placeholder.svg"}
                alt={metadata.name}
                className={`h-full w-full object-cover transition-all duration-500 ${
                  isHovered ? "scale-110 filter brightness-110" : ""
                }`}
              />

              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-[#13111C]/90 to-transparent transition-opacity duration-300 ${
                  isHovered ? "opacity-80" : "opacity-0"
                }`}
              ></div>

              {/* Info Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(!isFlipped)
                }}
                className={`absolute top-3 right-3 h-10 w-10 rounded-full bg-[#1A1625]/80 flex items-center justify-center transition-all duration-300 ${
                  isHovered ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2"
                }`}
              >
                <Icon icon="ph:info-bold" className="h-5 w-5 text-[#FF3D71]" />
              </button>

              {/* Price Tag */}
              <div
                className={`absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-[#1A1625]/80 px-4 py-2 transition-all duration-300 ${
                  isHovered ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2"
                }`}
              >
                <Icon icon="ph:currency-eth-bold" className="h-4 w-4 text-[#FF3D71]" />
                <span className="text-white font-medium">{formatEther(mintPrice)} ETH</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="h-[35%] p-4 bg-[#1A1625]">
              <h3 className="mb-1 text-xl font-bold text-white">{metadata.name}</h3>
              <p className="mb-3 line-clamp-2 text-sm text-[#E0E0E0]">{truncateString(metadata.description, 80)}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#9E9E9E]">
                  <Icon icon="ph:cube-bold" className="h-4 w-4 text-[#FF9E3D]" />
                  <span>{metadata.attributes.length} Attributes</span>
                </div>

                <button
                  disabled={Number(nextTokenId) !== tokenId}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMint()
                  }}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                    isOwned
                      ? "bg-[#211A2E]/40 text-[#9E9E9E]/50 cursor-not-allowed"
                      : Number(nextTokenId) === tokenId
                        ? "bg-gradient-hot text-white hover:shadow-lg transform hover:-translate-y-0.5"
                        : "bg-[#211A2E]/40 text-[#9E9E9E]/50 cursor-not-allowed"
                  }`}
                >
                  {isOwned ? "OWNED" : "MINT NFT"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="card-flip-back h-full w-full">
          <div className="h-full w-full rounded-xl bg-[#1A1625] p-5 shadow-lg">
            <div className="flex h-full flex-col">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gradient-hot">
                <Icon icon="ph:info-bold" className="h-5 w-5 text-[#FF3D71]" />
                NFT Details
              </h2>

              <div className="custom-scrollbar flex-1 overflow-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-[#9E9E9E]">Name</h3>
                    <p className="font-medium text-white">{metadata.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm text-[#9E9E9E]">Description</h3>
                    <p className="text-[#E0E0E0]">{metadata.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm text-[#9E9E9E]">Token ID</h3>
                    <p className="text-[#E0E0E0]">{tokenId}</p>
                  </div>

                  <div>
                    <h3 className="text-sm text-[#9E9E9E]">Price</h3>
                    <p className="flex items-center gap-1 text-[#E0E0E0]">
                      <Icon icon="ph:currency-eth-bold" className="h-4 w-4 text-[#FF3D71]" />
                      {formatEther(mintPrice)} ETH
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-[#9E9E9E]">Attributes</h3>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {metadata.attributes.map((attr, index) => (
                        <div key={index} className="rounded-lg bg-[#211A2E] p-2">
                          <p className="text-xs text-[#9E9E9E]">{attr.trait_type}</p>
                          <p className="text-sm font-medium text-white">{attr.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(false)
                }}
                className="mt-4 w-full rounded-lg bg-gradient-hot py-2 text-white transition-all duration-200 hover:shadow-lg"
              >
                Back to Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTCard

