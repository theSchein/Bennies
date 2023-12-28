// components/walletNfts.jsx
// This component fetches wallet addresses tied to the user and then fetches NFTs for each address.
// It then displays the NFTs in a list.
// TODO: Make the display of NFTs look better, add pagination, fix bugs

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import fallbackImageUrl from "../../public/placeholder.png";

function WalletNFTs() {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { data: session } = useSession();

    useEffect(() => {
        fetchWalletAddresses();
    }, []);

    const fetchWalletAddresses = async () => {
        try {
            const response = await fetch("/api/wallet/fetchWallets", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const walletData = await response.json();
            const addresses = walletData.map((wallet) => wallet.wallet_address);
            fetchNFTsForAllAddresses(addresses);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const fetchNFTsForAddress = async (address) => {
        try {
            const response = await fetch(
                `/api/user_profile/nfts?address=${address}`,
            );
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const fetchNFTsForAllAddresses = async (addresses) => {
        setLoading(true);
        setError("");
        try {
            const allNFTs = await Promise.all(
                addresses.map((address) => fetchNFTsForAddress(address)),
            );
            setNfts(allNFTs.flat());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {nfts.map((nft, index) => (
                    <Link
                    key={nft.nft_id}
                    href={`/nft/${nft.nft_id}/${nft.nft_name}`}
                    passHref
                    legacyBehavior
                >                    
                <div
                        key={index}
                        className="bg-white rounded-lg shadow overflow-hidden relative"
                    >
                        <div className="p-4">
                            <p className="text-lg font-semibold text-gray-800 truncate">
                                {nft.nft_name}
                            </p>
                        </div>
                        <div className="w-full h-64 relative">
                            {nft.media_url ? (
                                <Image
                                    src={nft.media_url}
                                    alt={nft.nft_name}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            ) : (
                                <Image
                                    src={fallbackImageUrl}
                                    alt="Fallback Image"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            )}
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default WalletNFTs;
