import React, { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import WalletModal from "./WalletModal";
import { shortenAddress } from "../../utils";
import { Flex, Popover } from "@radix-ui/themes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { supportedNetworks } from "../../config/wallet-connection/wagmi";
import { useNavigate } from "react-router-dom";

const WalletConnection = () => {
    const navigate = useNavigate();
    const account = useAccount();
    const { disconnect } = useDisconnect();
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!account.address) {
        return <WalletModal />;
    }

    return (
        <Popover.Root>
            <Popover.Trigger>
                <button className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-glow rounded-full opacity-70 blur group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-cyan-500/30">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-white font-medium">
                            {shortenAddress(account.address)}
                        </span>
                        <Icon
                            icon="ph:caret-down-bold"
                            className="w-4 h-4 text-cyan-400 transition-transform duration-300 group-hover:rotate-180"
                        />
                    </div>
                </button>
            </Popover.Trigger>
            <Popover.Content width="280px" className="!p-0 shadow-xl rounded-xl overflow-hidden border-none animate-fadeIn">
                <div className="bg-gradient-glow p-0.5 rounded-xl">
                    <div className="bg-slate-900 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                    <Icon icon="ph:wallet-bold" className="w-4 h-4 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Connected Wallet</p>
                                    <p className="text-white text-sm font-medium">{shortenAddress(account.address)}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-1 p-1">
                            <a
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-all duration-200"
                                href={`${supportedNetworks[0].blockExplorers.default.url}/address/${account.address}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon icon="ph:arrow-square-out-bold" className="w-5 h-5 text-cyan-400" />
                                <span className="text-white text-sm">View on Explorer</span>
                            </a>
                            <button 
                                onClick={() => copyToClipboard(account.address)}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-all duration-200"
                            >
                                {copied ? (
                                    <Icon icon="ph:check-bold" className="w-5 h-5 text-green-400 animate-checkmark" />
                                ) : (
                                    <Icon icon="ph:copy-bold" className="w-5 h-5 text-cyan-400" />
                                )}
                                <span className="text-white text-sm">{copied ? "Copied!" : "Copy Address"}</span>
                            </button>
                            <button
                                onClick={() => navigate("/account")}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-all duration-200"
                            >
                                <Icon
                                    icon="ph:user-bold"
                                    className="w-5 h-5 text-cyan-400"
                                />
                                <span className="text-white text-sm">My Collection</span>
                            </button>
                            <button
                                onClick={disconnect}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-900/20 transition-all duration-200"
                            >
                                <Icon
                                    icon="ph:power-bold"
                                    className="w-5 h-5 text-red-400"
                                />
                                <span className="text-red-400 text-sm">Disconnect</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Popover.Content>
        </Popover.Root>
    );
};

export default WalletConnection;
