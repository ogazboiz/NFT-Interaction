import { Box, Flex, Text } from "@radix-ui/themes";
import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    return (
        <Flex
            ref={footerRef}
            gap="3"
            as="footer"
            width="100%"
            align="center"
            justify="between"
            className={`bg-gradient-dark p-12 items-center transition-all duration-1000 ${
                isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}
        >
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center md:items-start">
                    <Text
                        className="text-white text-xl font-bold mb-4 flex items-center gap-2"
                        as="span"
                    >
                        <Icon icon="ph:cube-bold" className="w-6 h-6 text-cyan-400" />
                        <span className="text-gradient-primary">NEON NEXUS</span>
                    </Text>
                    <p className="text-slate-400 text-sm text-center md:text-left">
                        Discover, collect, and trade unique digital assets in our vibrant NFT marketplace
                    </p>
                </div>
                
                <div className="flex flex-col items-center">
                    <h3 className="text-white font-bold mb-4">Connect With Us</h3>
                    <div className="flex gap-4">
                        {[
                            { icon: "ph:twitter-logo-bold", label: "Twitter" },
                            { icon: "ph:discord-logo-bold", label: "Discord" },
                            { icon: "ph:instagram-logo-bold", label: "Instagram" },
                            { icon: "ph:github-logo-bold", label: "GitHub" }
                        ].map((social, index) => (
                            <a 
                                key={social.label}
                                href="#" 
                                aria-label={social.label}
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center transition-all duration-300 hover:bg-cyan-900 hover:scale-110 hover:rotate-6"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: isVisible ? `fadeSlideIn 500ms ${index * 100}ms both` : 'none'
                                }}
                            >
                                <Icon icon={social.icon} className="w-5 h-5 text-cyan-400" />
                            </a>
                        ))}
                    </div>
                </div>
                
                <div className="flex flex-col items-center md:items-end">
                    <Text
                        className="text-slate-400 text-sm"
                        as="span"
                    >
                        &copy; 2025 cohort XII
                    </Text>
                    <p className="text-slate-500 text-xs mt-2">
                        All rights reserved
                    </p>
                </div>
            </div>
        </Flex>
    );
};

export default Footer;
