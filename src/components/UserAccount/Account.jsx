"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "../../contexts/appContext"
import { useAccount, useWalletClient } from "wagmi"
import NFTCard from "../NFTCard/index"
import { ethers } from "ethers"
import { Icon } from "@iconify/react/dist/iconify.js"

const Account = () => {
  const { userNFTs, tokenMetaData = new Map(), mintPrice, nextTokenId, transferNFT } = useAppContext()
  const { address: userAddress, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [recipientMap, setRecipientMap] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("collection")

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (tokenId, value) => {
    setRecipientMap((prev) => ({
      ...prev,
      [tokenId]: value,
    }))
  }

  const handleTransfer = async (tokenId) => {
    const recipient = recipientMap[tokenId]
    if (!recipient) {
      console.error("Please enter a recipient address.")
      return
    }

    if (!walletClient) {
      console.error("No wallet client available. Please connect your wallet.")
      return
    }

    try {
      const provider = new ethers.BrowserProvider(walletClient)
      const signer = await provider.getSigner()
      await transferNFT(tokenId, recipient, signer)

      setRecipientMap((prev) => ({
        ...prev,
        [tokenId]: "",
      }))
    } catch (error) {
      console.error("Transfer failed:", error)
    }
  }

  const tabs = [
    { id: "collection", label: "MY COLLECTION", icon: "ph:image-square-bold" },
    { id: "activity", label: "ACTIVITY", icon: "ph:activity-bold" },
    { id: "settings", label: "SETTINGS", icon: "ph:gear-six-bold" },
  ]

  return (
    <div
      className={`transition-all duration-700 ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"}`}
    >
      <main className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="relative">
            <div className="h-48 w-full bg-gradient-hot rounded-xl"></div>
            <div className="absolute -bottom-12 left-8 hexagon w-24 h-24 border-4 border-[#13111C] bg-gradient-hot flex items-center justify-center">
              <Icon icon="ph:user-bold" className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="mt-16 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient-hot">MY NFT COLLECTION</h1>
              {isConnected && (
                <p className="text-[#9E9E9E] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  {shortenAddress(userAddress)}
                </p>
              )}
            </div>

            <div className="mt-4 md:mt-0 flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-hot text-white shadow-md"
                      : "bg-[#211A2E] text-[#9E9E9E] hover:bg-[#2A2339]"
                  }`}
                >
                  <Icon icon={tab.icon} className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs font-medium tracking-wider">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center p-12 border border-dashed border-red-300 rounded-xl bg-[#211A2E]/50">
            <Icon icon="ph:warning-circle-bold" className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 text-lg font-medium">Please connect your wallet to view your NFTs</p>
          </div>
        ) : userNFTs.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-[#FF3D71]/30 rounded-xl bg-[#211A2E]/50">
            <Icon icon="ph:image-square-bold" className="w-16 h-16 text-[#FF3D71] mx-auto mb-4" />
            <p className="text-[#FF3D71] text-lg font-medium">You don't own any NFTs yet</p>
            <p className="text-[#9E9E9E] mt-2">Mint some NFTs to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userNFTs.map((tokenId, index) => {
              const metadata = tokenMetaData.get(tokenId)
              if (!metadata) return null

              return (
                <div
                  key={tokenId}
                  className="card-neo overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible ? `slideUp 500ms ${index * 100}ms both` : "none",
                  }}
                >
                  <div className="p-4">
                    <NFTCard metadata={metadata} mintPrice={mintPrice} tokenId={tokenId} nextTokenId={nextTokenId} />
                  </div>

                  <div className="bg-[#211A2E] p-4 border-t border-[#FF3D71]/10">
                    <p className="text-[#FF3D71] font-medium mb-2 flex items-center gap-2">
                      <Icon icon="ph:arrow-square-out-bold" className="w-5 h-5" />
                      TRANSFER NFT
                    </p>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter recipient address"
                          value={recipientMap[tokenId] || ""}
                          onChange={(e) => handleInputChange(tokenId, e.target.value)}
                          className="w-full px-4 py-3 pr-10 rounded-lg border border-[#FF3D71]/20 bg-[#1A1625] text-white focus:ring-2 focus:ring-[#FF3D71] focus:border-[#FF3D71] transition-all duration-200"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9E9E9E]">
                          <Icon icon="ph:address-book-bold" className="w-5 h-5" />
                        </div>
                      </div>
                      <button
                        onClick={() => handleTransfer(tokenId)}
                        className="w-full py-3 rounded-lg bg-gradient-hot text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <Icon icon="ph:paper-plane-right-bold" className="w-5 h-5" />
                        TRANSFER
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

// Helper function to shorten address
const shortenAddress = (address) => {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default Account

