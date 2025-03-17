"use client"

import { Icon } from "@iconify/react/dist/iconify.js"
import { formatEther } from "ethers"
import { useState } from "react"
import { truncateString } from "../../utils"

const NFTCard = ({ metadata, mintPrice, tokenId, nextTokenId, mintNFT }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleMint = () => {
    setIsClicked(true)
    mintNFT()
    setTimeout(() => setIsClicked(false), 300)
  }

  const isOwned = Number(nextTokenId) > tokenId

  return (
    <div
      className={`group perspective w-full h-[450px] cursor-pointer ${isFlipped ? "z-10" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        if (!isClicked) setIsFlipped(false)
      }}
    >
      <div className={`relative preserve-3d w-full h-full duration-700 ${isFlipped ? "rotate-y-180" : ""}`}>
        {/* Front of card */}
        <div className="absolute backface-hidden w-full h-full">
          <div
            className={`w-full h-full rounded-2xl overflow-hidden transition-all duration-500 ${
              isHovered ? "shadow-[0_10px_30px_rgba(6,_182,_212,_0.5)]" : "shadow-lg"
            } ${isClicked ? "scale-95" : ""}`}
          >
            <div className="relative h-[65%] overflow-hidden">
              <img
                src={metadata.image || "/placeholder.svg"}
                alt={`${metadata.name} image`}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isHovered ? "scale-110 filter brightness-110" : ""
                }`}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent transition-opacity duration-300 ${
                  isHovered ? "opacity-70" : "opacity-0"
                }`}
              ></div>

              {/* Info button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(!isFlipped)
                }}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center transition-all duration-300 ${
                  isHovered ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-2"
                }`}
              >
                <Icon icon="ph:info-bold" className="w-4 h-4 text-cyan-700" />
              </button>

              {/* Price tag */}
              <div
                className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white/80 flex items-center gap-1.5 transition-all duration-300 ${
                  isHovered ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-2"
                }`}
              >
                <Icon icon="ph:currency-eth-bold" className="w-4 h-4 text-cyan-700" />
                <span className="text-cyan-700 font-medium text-sm">{formatEther(mintPrice)}</span>
              </div>
            </div>

            <div className="h-[35%] bg-gradient-primary p-4">
              <h1 className="font-bold text-lg text-black mb-1">{metadata.name}</h1>
              <p className="text-slate-200 text-sm mb-3 line-clamp-2">{truncateString(metadata.description, 80)}</p>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-slate-200 text-sm">
                  <Icon icon="ph:cube-bold" className="w-4 h-4" />
                  <span>{metadata.attributes.length} Attributes</span>
                </div>

                <button
                  disabled={Number(nextTokenId) !== tokenId}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMint()
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    isOwned
                      ? "bg-slate-700/40 text-slate-300/50 cursor-not-allowed"
                      : Number(nextTokenId) === tokenId
                        ? "bg-white text-cyan-700 hover:bg-slate-100 hover:shadow-md"
                        : "bg-slate-700/40 text-slate-300/50 cursor-not-allowed"
                  }`}
                >
                  {isOwned ? "Owned" : "Mint NFT"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute backface-hidden w-full h-full rotate-y-180">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-dark p-5 shadow-lg">
            <div className="h-full flex flex-col">
              <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <Icon icon="ph:info-bold" className="w-5 h-5 text-cyan-400" />
                NFT Details
              </h2>

              <div className="flex-1 overflow-auto custom-scrollbar">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-slate-400 text-sm">Name</h3>
                    <p className="text-white font-medium">{metadata.name}</p>
                  </div>

                  <div>
                    <h3 className="text-slate-400 text-sm">Description</h3>
                    <p className="text-white">{metadata.description}</p>
                  </div>

                  <div>
                    <h3 className="text-slate-400 text-sm">Token ID</h3>
                    <p className="text-white">{tokenId}</p>
                  </div>

                  <div>
                    <h3 className="text-slate-400 text-sm">Price</h3>
                    <p className="text-white flex items-center gap-1">
                      <Icon icon="ph:currency-eth-bold" className="w-4 h-4" />
                      {formatEther(mintPrice)} ETH
                    </p>
                  </div>

                  <div>
                    <h3 className="text-slate-400 text-sm">Attributes</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {metadata.attributes.map((attr, index) => (
                        <div key={index} className="bg-slate-800/50 rounded-lg p-2">
                          <p className=" text-emerald-950 text-xs">{attr.trait_type}</p>
                          <p className="text-white text-sm font-medium">{attr.value}</p>
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
                className="mt-4 w-full py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
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

