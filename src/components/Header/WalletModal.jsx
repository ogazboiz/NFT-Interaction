"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useConnect } from "wagmi";

const WalletModal = () => {
  const { connectors, connect, pendingConnector, isLoading } = useConnect();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState(null);

  const walletConnectConnector = connectors.find((connector) => connector.id === "walletConnect");
  const otherConnectors = connectors.filter((connector) => connector.id !== "walletConnect");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setSelectedConnector(null);
    }
  }, [isOpen]);

  const connectWallet = (connector) => {
    try {
      setSelectedConnector(connector);
      connect({ connector });
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const getConnectorIcon = (connectorId) => {
    switch (connectorId) {
      case "metaMask":
        return "logos:metamask-icon";
      case "coinbaseWallet":
        return "logos:coinbase-icon";
      case "walletConnect":
        return "logos:walletconnect-icon";
      default:
        return "ph:wallet-bold";
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="relative btn-glow">
        <div className="relative px-5 py-2.5 bg-[#1A1625] rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-lg border border-[#FF3D71]/30">
          <Icon icon="ph:wallet-bold" className="w-5 h-5 text-[#FF3D71]" />
          <span className="text-white font-medium">CONNECT</span>
        </div>
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div
            className={`w-full max-w-md transition-all duration-500 ${
              isVisible ? "opacity-100 transform scale-100" : "opacity-0 transform scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Design */}
            <div className="bg-gradient-hot p-0.5 rounded-2xl shadow-2xl">
              <div className="bg-[#13111C] rounded-xl overflow-hidden">
                {!selectedConnector ? (
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gradient-hot flex items-center gap-2">
                        <Icon icon="ph:wallet-bold" className="w-6 h-6 text-[#FF3D71]" />
                        Connect Wallet
                      </h2>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 rounded-full bg-[#211A2E] flex items-center justify-center hover:bg-[#FF3D71]/20 transition-colors duration-200"
                      >
                        <Icon icon="ph:x-bold" className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <p className="text-[#9E9E9E] text-sm mb-6">Choose your preferred wallet to connect to IGNITE</p>

                    {/* Wallet Options */}
                    <div className="space-y-4">
                      {walletConnectConnector && (
                        <button
                          onClick={() => connectWallet(walletConnectConnector)}
                          disabled={isLoading && pendingConnector?.id === walletConnectConnector.id}
                          className="w-full flex items-center p-4 bg-[#211A2E] hover:bg-[#2A2339] rounded-xl transition-all duration-200 border border-[#FF3D71]/10 hover:border-[#FF3D71]/30"
                          style={{ animation: isVisible ? "slideUp 0.5s ease-out forwards" : "none" }}
                        >
                          <div className="w-12 h-12 rounded-xl bg-[#2A2339] flex items-center justify-center mr-4">
                            <Icon icon={getConnectorIcon(walletConnectConnector.id)} className="w-7 h-7" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-white font-medium text-lg">WalletConnect</p>
                            <p className="text-[#9E9E9E] text-xs">Connect with mobile wallet</p>
                          </div>
                          {isLoading && pendingConnector?.id === walletConnectConnector.id ? (
                            <div className="w-6 h-6 border-2 border-[#FF3D71]/30 border-t-[#FF3D71] rounded-full animate-spin"></div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#2A2339] flex items-center justify-center">
                              <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-[#FF3D71]" />
                            </div>
                          )}
                        </button>
                      )}

                      {otherConnectors.map((connector, index) => (
                        <button
                          key={connector.id}
                          onClick={() => connectWallet(connector)}
                          disabled={isLoading && pendingConnector?.id === connector.id}
                          className="w-full flex items-center p-4 bg-[#211A2E] hover:bg-[#2A2339] rounded-xl transition-all duration-200 border border-[#FF3D71]/10 hover:border-[#FF3D71]/30"
                          style={{
                            animationDelay: `${(index + 1) * 100}ms`,
                            animation: isVisible ? `slideUp 0.5s ${(index + 1) * 100}ms ease-out forwards` : "none",
                          }}
                        >
                          <div className="w-12 h-12 rounded-xl bg-[#2A2339] flex items-center justify-center mr-4">
                            <Icon icon={getConnectorIcon(connector.id)} className="w-7 h-7" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-white font-medium text-lg">{connector.name}</p>
                            <p className="text-[#9E9E9E] text-xs">Connect with {connector.name}</p>
                          </div>
                          {isLoading && pendingConnector?.id === connector.id ? (
                            <div className="w-6 h-6 border-2 border-[#FF3D71]/30 border-t-[#FF3D71] rounded-full animate-spin"></div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#2A2339] flex items-center justify-center">
                              <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-[#FF3D71]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-20 h-20 rounded-xl bg-[#211A2E] flex items-center justify-center mb-6">
                        <Icon icon={getConnectorIcon(selectedConnector.id)} className="w-12 h-12" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Connecting to {selectedConnector.name}</h3>
                      <p className="text-[#9E9E9E] text-sm text-center mb-6">Confirm the connection in your wallet</p>
                      <div className="w-8 h-8 border-2 border-[#FF3D71]/30 border-t-[#FF3D71] rounded-full animate-spin mb-6"></div>
                      <button
                        onClick={() => setSelectedConnector(null)}
                        className="text-[#FF3D71] hover:text-[#FF9E3D] transition-colors duration-200"
                      >
                        Go back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletModal;