import { Contract } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { getReadOnlyProvider } from "../utils";
import NFT_ABI from "../ABI/nft.json";
import { useAccount } from "wagmi";

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const { address: userAddress, isConnected } = useAccount();

    const [nextTokenId, setNextTokenId] = useState(null);
    const [maxSupply, setMaxSupply] = useState(null);
    const [baseTokenURI, setBaseTokenURI] = useState("");
    const [tokenMetaData, setTokenMetaData] = useState(new Map());
    const [mintPrice, setMintPrice] = useState(null);
    const [userNFTs, setUserNFTs] = useState([]);

    useEffect(() => {
        console.log("Fetching contract details...");

        const provider = getReadOnlyProvider();
        if (!provider) {
            console.error("Provider is not available.");
            return;
        }

        const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
        if (!contractAddress) {
            console.error("VITE_NFT_CONTRACT_ADDRESS is missing.");
            return;
        }

        const contract = new Contract(contractAddress, NFT_ABI, provider);

        contract.nextTokenId()
            .then((id) => setNextTokenId(id))
            .catch((error) => console.error("Error fetching nextTokenId:", error));

        contract.baseTokenURI()
            .then((uri) => setBaseTokenURI(uri))
            .catch((error) => console.error("Error fetching baseTokenURI:", error));

        contract.maxSupply()
            .then((supply) => setMaxSupply(supply))
            .catch((error) => console.error("Error fetching maxSupply:", error));

        contract.mintPrice()
            .then((price) => setMintPrice(price))
            .catch((error) => console.error("Error fetching mintPrice:", error));
    }, []);

    useEffect(() => {
        if (!maxSupply || !baseTokenURI) return;

        console.log("Fetching token metadata...");
        const tokenIds = Array.from({ length: Number(maxSupply) }, (_, i) => i);

        const promises = tokenIds.map((id) =>
            fetch(`${baseTokenURI}${id}.json`)
                .then((response) => response.json())
                .then((data) => ({ id, data }))
        );

        Promise.all(promises)
            .then((responses) => {
                const metadataMap = new Map();
                responses.forEach(({ id, data }) => metadataMap.set(id, data));
                setTokenMetaData(metadataMap);
                console.log("Token metadata loaded.");
            })
            .catch((error) => console.error("Error fetching metadata:", error));
    }, [baseTokenURI, maxSupply]);

    useEffect(() => {
        console.log("Setting up event listener for 'Minted' event...");
        
        const provider = getReadOnlyProvider();
        if (!provider) {
            console.error("Provider is not available for event listener.");
            return;
        }

        const contract = new Contract(import.meta.env.VITE_NFT_CONTRACT_ADDRESS, NFT_ABI, provider);

        const handleMintedNFT = (receiver, nftTokenId) => {
            console.log(`NFT ${nftTokenId} minted to ${receiver}`);
            contract.nextTokenId()
                .then((id) => setNextTokenId(id))
                .catch((error) => console.error("Error updating nextTokenId:", error));
        };

        contract.on("Minted", handleMintedNFT);

        return () => {
            console.log("Cleaning up 'Minted' event listener...");
            contract.off("Minted", handleMintedNFT);
        };
    }, []);

    useEffect(() => {
        if (!userAddress || !isConnected || nextTokenId === null) return;
        fetchUserNFTs();
    }, [userAddress, isConnected, nextTokenId]);

    const fetchUserNFTs = async () => {
        try {
            console.log(`Fetching NFTs owned by ${userAddress}...`);
            const provider = getReadOnlyProvider();
            if (!provider) {
                console.error("Provider is not available.");
                return;
            }

            const contract = new Contract(import.meta.env.VITE_NFT_CONTRACT_ADDRESS, NFT_ABI, provider);

            const userOwnedNFTs = [];
            for (let i = 0; i < nextTokenId; i++) {
                const owner = await contract.ownerOf(i);
                if (owner.toLowerCase() === userAddress.toLowerCase()) {
                    userOwnedNFTs.push(i);
                }
            }

            setUserNFTs(userOwnedNFTs);
            console.log(`User NFTs: ${userOwnedNFTs}`);
        } catch (error) {
            console.error("Error fetching user NFTs:", error);
        }
    };

    const transferNFT = async (tokenId, recipientAddress, signer) => {
        if (!recipientAddress) {
            console.error("Recipient address is required.");
            return;
        }
        if (!signer) {
            console.error("No signer available. Ensure your wallet is connected.");
            return;
        }

        try {
            console.log(`Transferring NFT ${tokenId} to ${recipientAddress}...`);
            const contract = new Contract(
                import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
                NFT_ABI,
                signer
            );

            const tx = await contract.safeTransferFrom(await signer.getAddress(), recipientAddress, tokenId);
            await tx.wait(); // Wait for confirmation
            console.log(`NFT ${tokenId} transferred to ${recipientAddress}`);

            // Refresh user NFTs after transfer
            fetchUserNFTs();
        } catch (error) {
            console.error("Error transferring NFT:", error);
        }
    };

    console.log("Rendering AppProvider with state:", {
        nextTokenId,
        maxSupply,
        baseTokenURI,
        mintPrice,
        userNFTs,
    });

    return (
        <AppContext.Provider
            value={{
                nextTokenId,
                maxSupply,
                baseTokenURI,
                tokenMetaData,
                mintPrice,
                userNFTs,
                transferNFT,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
