// components/walletNfts.jsx
// This component fetches wallet addresses tied to the user and then fetches NFTs for each address.
// It then displays the NFTs in a list.
// TODO: Make the display of NFTs look better, add pagination, fix bugs

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
    <div>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <Slider {...sliderSettings}>
    {nfts.map((nft, index) => (
        <div key={index} className="p-4">
            <Link href={`/nft/${nft.nft_id}/${nft.nft_name}`} passHref legacyBehavior>
                <a className="bg-white rounded-lg shadow overflow-hidden block">
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
                </a>
            </Link>
        </div>
    ))}
</Slider>

    </div>
    );
}

export default WalletNFTs;
