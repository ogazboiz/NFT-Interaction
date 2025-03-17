import { Icon } from "@iconify/react/dist/iconify.js";
import { Dialog, Flex } from "@radix-ui/themes";
import React, { useState, useEffect } from "react";
import { useConnectors } from "wagmi";

const WalletModal = () => {
    const connectors = useConnectors();
    const [pendingConnectorUID, setPendingConnectorUID] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const walletConnectConnector = connectors.find(
        (connector) => connector.id === "walletConnect"
    );

    const otherConnectors = connectors.filter(
        (connector) => connector.id !== "walletConnect"
    );

    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure the DOM is updated before starting the animation
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const connectWallet = async (connector) => {
        try {
            setPendingConnectorUID(connector.id);
            await connector.connect();
        } catch (error) {
            console.error(error);
        } finally {
            setPendingConnectorUID(null);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger>
                <button className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-glow rounded-full opacity-70 blur group-hover:opacity-100 transition duration-500 animate-glow"></div>
                    <div className="relative px-5 py-2.5 bg-slate-800 rounded-full flex items-center gap-2 transition-all duration-300 group-hover:shadow-lg border border-cyan-500/30">
                        <Icon icon="ph:wallet-bold" className="w-5 h-5 text-cyan-400" />
                        <span className="text-white font-medium">Connect</span>
                    </div>
                </button>
            </Dialog.Trigger>

            <Dialog.Content 
                maxWidth="450px" 
                className={`!p-0 !bg-transparent border-none transition-all duration-300 ease-in-out ${
                    isVisible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'
                }`}
            >
                <div className="bg-gradient-glow p-0.5 rounded-2xl shadow-2xl">
                    <div className="bg-slate-900 rounded-xl overflow-hidden">
                        <div className="p-6">
                            <Dialog.Title className="text-white text-xl font-bold mb-2 flex items-center gap-2">
                                <Icon icon="ph:wallet-bold" className="w-6 h-6 text-cyan-400" />
                                Connect Your Wallet
                            </Dialog.Title>
                            <Dialog.Description className="text-slate-400 text-sm mb-6">
                                Choose your preferred wallet to connect to our dApp
                            </Dialog.Description>

                            <Flex direction="column" gap="3">
                                {walletConnectConnector && (
                                    <button
                                        onClick={() => connectWallet(walletConnectConnector)}
                                        disabled={pendingConnectorUID === walletConnectConnector.uid}
                                        className="w-full flex items-center p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-200 border border-slate-700"
                                        style={{ animation: isVisible ? `fadeSlideIn 300ms 0ms both` : 'none' }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                                            <img
                                                src="https://logosarchive.com/wp-content/uploads/2022/02/WalletConnect-icon.svg"
                                                className="w-6 h-6"
                                                alt="WalletConnect"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium text-left">WalletConnect</p>
                                            <p className="text-slate-400 text-xs text-left">Connect with mobile wallet</p>
                                        </div>
                                        {pendingConnectorUID === walletConnectConnector.uid ? (
                                            <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                                        ) : (
                                            <Icon icon="ph:arrow-right-bold" className="w-5 h-5 text-cyan-400" />
                                        )}
                                    </button>
                                )}
                                <div className="flex flex-col gap-3 mt-2">
                                    {otherConnectors.map((connector, index) => (
                                        <button
                                            key={connector.id}
                                            onClick={() => connectWallet(connector)}
                                            disabled={pendingConnectorUID === connector.uid}
                                            className="w-full flex items-center p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-200 border border-slate-700"
                                            style={{ 
                                                animationDelay: `${(index + 1) * 100}ms`,
                                                animation: isVisible ? `fadeSlideIn 300ms ${(index + 1) * 100}ms both` : 'none'
                                            }}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                                                <img src={connector.icon || "/placeholder.svg"} className="w-6 h-6" alt={connector.name} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium text-left">{connector.name}</p>
                                                <p className="text-slate-400 text-xs text-left">Connect with {connector.name}</p>
                                            </div>
                                            {pendingConnectorUID === connector.uid ? (
                                                <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                                            ) : (
                                                <Icon icon="ph:arrow-right-bold" className="w-5 h-5 text-cyan-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </Flex>
                        </div>
                    </div>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default WalletModal;
