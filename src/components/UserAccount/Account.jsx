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
      const signer = await provider.getSigner() // Get signer from wallet client
      await transferNFT(tokenId, recipient, signer) // Pass signer properly

      // Clear input field after successful transfer
      setRecipientMap((prev) => ({
        ...prev,
        [tokenId]: "",
      }))
    } catch (error) {
      console.error("Transfer failed:", error)
    }
  }

  return (
    <div
      className={`transition-all duration-700 ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"}`}
    >
      <main>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4 transition-colors duration-300 hover:text-blue-600">Account Page</h1>
          {isConnected ? (
            <>
              <p className="mb-2 transition-all duration-300">Manage your NFT collection</p>
              <p className="text-gray-600 mb-4 transition-all duration-300">
                Connected Wallet: <span className="font-medium">{userAddress}</span>
              </p>
              <p className="font-medium mb-6 text-lg transition-all duration-300">
                You own <span className="text-blue-600">{userNFTs.length}</span> NFT(s)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {userNFTs.length > 0 ? (
                  userNFTs.map((tokenId, index) => {
                    const metadata = tokenMetaData.get(tokenId)
                    if (!metadata) return null

                    return (
                      <div
                        key={tokenId}
                        className="border border-primary/20 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: isVisible ? `fadeSlideIn 500ms ${index * 100}ms both` : "none",
                        }}
                      >
                        <NFTCard
                          metadata={metadata}
                          mintPrice={mintPrice}
                          tokenId={tokenId}
                          nextTokenId={nextTokenId}
                        />
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Icon icon="mdi:transfer" className="w-5 h-5" />
                            <span>Transfer this NFT</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Enter recipient address"
                            value={recipientMap[tokenId] || ""}
                            onChange={(e) => handleInputChange(tokenId, e.target.value)}
                            className="mt-2 p-3 border border-gray-300 rounded-lg w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            className="mt-2 bg-primary text-secondary px-4 py-3 rounded-lg w-full transition-all duration-300 hover:bg-primary/90 hover:shadow-md transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                            onClick={() => handleTransfer(tokenId)}
                          >
                            <Icon icon="mdi:send" className="w-5 h-5" />
                            Transfer NFT
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="col-span-full text-center text-gray-500 p-8 border border-dashed border-gray-300 rounded-xl">
                    No NFTs found. Mint some NFTs to see them here.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center p-8 border border-dashed border-red-300 rounded-xl bg-red-50">
              <p className="text-red-500 flex items-center justify-center gap-2">
                <Icon icon="mdi:alert-circle" className="w-6 h-6" />
                Please connect your wallet to view your NFTs.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Account

