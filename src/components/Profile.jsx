import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
} from "wagmi";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";
import Image from "next/image";
import ArtistForm from "../components/newArtist";

const WalletAddressContext = createContext();

export const useWalletAddress = () => {
    return useContext(WalletAddressContext);
};

export function Profile() {
    const { address, connector, isConnected } = useAccount();
    const { data: ensAvatar } = useEnsAvatar({ address });
    const { data: ensName } = useEnsName({ address });
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: session } = useSession();
    const [isEligible, setIsEligible] = useState(null);

    const claimWallet = useCallback(async () => {
        if (!session) {
            return;
        }
        try {
            const response = await fetch("/api/claimWallet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address }),
                credentials: "include",
            });

            const data = await response.json();
        } catch (error) {
            console.error("Failed to claim wallet:", error);
        }
    }, [session, address]);

    const fetchNFTs = async () => {
        if (!session) {
            return;
        }
        try {
            const response = await fetch("/api/get_wallet_nfts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address }),
                credentials: "include",
            });
            const data = await response.json();
        } catch (error) {
            console.error("Failed to claim wallet:", error);
        }
    };

    const fetchArtistEligibility = async () => {
        if (!session) {
            return;
        }
        try {
            const response = await fetch("/api/checkArtistEligibility", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address }),
            });
            const data = await response.json();
            setIsEligible(data.isEligible);
        } catch (error) {
            console.error("Failed:", error);
        }
    };

    useEffect(() => {
        if (isConnected && address) {
            claimWallet(address);
        }
    }, [isConnected, address, claimWallet]);

    if (isConnected) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                    <WalletAddressContext.Provider value={address}>
                        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 space-y-4">
                            <div className="flex justify-center">
                                <Image
                                    src={ensAvatar}
                                    alt="ENS Avatar"
                                    className="w-24 h-24 rounded-full"
                                />
                            </div>
                            <div className="text-center text-lg font-medium">
                                {ensName ? `${ensName} (${address})` : address}
                            </div>
                            <div className="text-center text-sm text-gray-600">
                                {connector
                                    ? `Connected to ${connector.name}`
                                    : "Not connected"}
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={disconnect}
                                    className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                                >
                                    {`Disconnect`}
                                </button>

                                {/* <button
                                    onClick={fetchNFTs}
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                                >
                                    Fetch NFTs
                                </button> */}

                                <button
                                    onClick={fetchArtistEligibility}
                                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
                                >
                                    {`Check Eligibility`}
                                </button>
                            </div>

                            <div className="text-center p-4">
                                {isEligible ? (
                                    <div className="text-green-500 font-bold">
                                        {`You are eligible to create an artist page!`}
                                    </div>
                                ) : (
                                    <div className="text-red-500">
                                        {`You are not eligible to create an artist page.`}
                                    </div>
                                )}
                            </div>
                        </div>
                    </WalletAddressContext.Provider>
                </div>
            </>
        );
    }

    return (
        <div>
            {connectors.map((connector) => (
                <button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className={`bg-rainbow-gradient text-white font-bold py-2 px-4 rounded-full shadow-md transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed {
                        !connector.ready && "cursor-not-allowed"
                    }`}
                >
                    {connector.name}
                    {!connector.ready && " (Not Available on this Device)"}
                    {isLoading &&
                        connector.id === pendingConnector?.id &&
                        " (connecting)"}
                </button>
            ))}

            {error && <div>{error.message}</div>}
        </div>
    );
}
