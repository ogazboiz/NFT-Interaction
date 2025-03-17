"use client"

import { useState } from "react"
import { useAccount, useDisconnect } from "wagmi"
import WalletModal from "./WalletModal"
import { shortenAddress } from "../../utils"
import { Icon } from "@iconify/react/dist/iconify.js"
import { supportedNetworks } from "../../config/wallet-connection/wagmi"
import { useNavigate } from "react-router-dom"

const WalletConnection = () => {
  const navigate = useNavigate()
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!account.address) {
    return <WalletModal />
  }

  return (
    <div className="relative">
      <button className="relative btn-neo" onClick={() => setShowDropdown(!showDropdown)}>
        <div className="absolute -inset-0.5 bg-gradient-hot rounded-full opacity-70 blur-sm"></div>
        <div className="relative flex items-center gap-2 px-4 py-2 bg-[#1A1625] rounded-full border border-[#FF3D71]/20">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-white font-medium">{shortenAddress(account.address)}</span>
          <Icon
            icon="ph:caret-down-bold"
            className={`w-4 h-4 text-[#FF3D71] transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden shadow-xl animate-scale-in z-50"
          style={{ transformOrigin: "top right" }}
        >
          <div className="bg-gradient-hot p-0.5 rounded-xl">
            <div className="bg-[#1A1625] rounded-lg overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#FF3D71]/20">
                <div className="flex items-center gap-3">
                  <div className="hexagon-sm w-10 h-10 bg-[#211A2E] flex items-center justify-center">
                    <Icon icon="ph:wallet-bold" className="w-5 h-5 text-[#FF3D71]" />
                  </div>
                  <div>
                    <p className="text-[#9E9E9E] text-xs">Connected Wallet</p>
                    <p className="text-white text-sm font-medium">{shortenAddress(account.address)}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-1 p-1">
                <a
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-[#211A2E] transition-all duration-200"
                  href={`${supportedNetworks[0].blockExplorers.default.url}/address/${account.address}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="ph:arrow-square-out-bold" className="w-5 h-5 text-[#FF9E3D]" />
                  <span className="text-white text-sm">View on Explorer</span>
                </a>
                <button
                  onClick={() => copyToClipboard(account.address)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-[#211A2E] transition-all duration-200"
                >
                  {copied ? (
                    <Icon icon="ph:check-bold" className="w-5 h-5 text-green-400 animate-fade-in" />
                  ) : (
                    <Icon icon="ph:copy-bold" className="w-5 h-5 text-[#FF9E3D]" />
                  )}
                  <span className="text-white text-sm">{copied ? "Copied!" : "Copy Address"}</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/account")
                    setShowDropdown(false)
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-[#211A2E] transition-all duration-200"
                >
                  <Icon icon="ph:user-bold" className="w-5 h-5 text-[#FF9E3D]" />
                  <span className="text-white text-sm">My Collection</span>
                </button>
                <button
                  onClick={() => {
                    disconnect()
                    setShowDropdown(false)
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-900/20 transition-all duration-200"
                >
                  <Icon icon="ph:power-bold" className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm">Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletConnection

