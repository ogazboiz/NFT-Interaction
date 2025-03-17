import { Box, Flex, Text } from "@radix-ui/themes";
import React, { useState, useEffect } from "react";
import WalletConnection from "./WalletConnection";
import { Icon } from "@iconify/react/dist/iconify.js";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <Flex
            gap="3"
            as="header"
            width="100%"
            align="center"
            justify="between"
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
                scrolled 
                    ? 'glass-dark shadow-lg py-3' 
                    : 'bg-transparent py-5'
            }`}
        >
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Box className="relative z-10">
                    <Text
                        className="font-extrabold text-2xl flex items-center gap-2"
                        as="span"
                        role="img"
                        aria-label="logo"
                    >
                        <div className="relative">
                            <div className="absolute -inset-1 bg-cyan-500/30 rounded-full blur-md"></div>
                            <div className="relative">
                                <Icon icon="ph:cube-bold" className="w-8 h-8 text-cyan-400 animate-float" />
                            </div>
                        </div>
                        <span className="text-white relative">
                            <span className="absolute -inset-1 bg-cyan-500/20 rounded-lg blur"></span>
                            <span className="relative text-gradient-primary">NEON NEXUS</span>
                        </span>
                    </Text>
                </Box>
                
                {/* Mobile menu button */}
                <button 
                    className="md:hidden relative z-10 p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <div className="w-6 h-5 flex flex-col justify-between">
                        <span className={`block h-0.5 w-full bg-cyan-400 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block h-0.5 w-full bg-cyan-400 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block h-0.5 w-full bg-cyan-400 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>
                
                {/* Desktop navigation */}
                <div className="hidden md:flex items-center gap-8 relative z-10">
                    {["Explore", "Create", "Collection"].map((item, index) => (
                        <a 
                            key={item} 
                            href={`#${item.toLowerCase()}`}
                            className="text-slate-300 hover:text-cyan-400 transition-all duration-300 relative group"
                        >
                            <span className="relative z-10">{item}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    ))}
                    <WalletConnection />
                </div>
            </div>
            
            {/* Mobile menu */}
            <div 
                className={`fixed inset-0 glass-dark z-30 flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
                    menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
            >
                <div className="flex flex-col items-center gap-8">
                    {["Explore", "Create", "Collection"].map((item, index) => (
                        <a 
                            key={item} 
                            href={`#${item.toLowerCase()}`}
                            className="text-white text-2xl font-bold transition-all duration-300 hover:text-cyan-400"
                            onClick={() => setMenuOpen(false)}
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animation: menuOpen ? `fadeSlideIn 500ms ${index * 100}ms both` : 'none'
                            }}
                        >
                            {item}
                        </a>
                    ))}
                    <div className="mt-4" onClick={() => setMenuOpen(false)}>
                        <WalletConnection />
                    </div>
                </div>
            </div>
        </Flex>
    );
};

export default Header;
