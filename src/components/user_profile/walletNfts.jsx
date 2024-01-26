// components/user_profile/walletNfts.jsx

import React from "react";
import useWalletNFTs from "../hooks/useWalletNfts";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import fallbackImageUrl from "../../../public/placeholder.png";

function WalletNFTs() {
    const { ownedNfts, deployedNfts, loading, error } = useWalletNFTs();

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

    const NFTItem = ({ nft }) => (
        <div className=" bg-white bg-opacity-75 dark:bg-dark-tertiary dark:text-dark-primary rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out min-w-0">
            <Link href={`/nft/${nft.nft_id}/${nft.nft_name}`} passHref legacyBehavior>
                <a className="block h-full">
                    <div className="p-4">
                        <p className="text-lg font-semibold truncate">{nft.nft_name}</p>
                    </div>
                    <div className="w-full h-64 relative">
                        <Image
                            src={nft.media_url ? nft.media_url : fallbackImageUrl}
                            alt={nft.nft_name || "Fallback Image"}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </a>
            </Link>
        </div>
    );

    const renderNFTs = (nfts, title) => (
        <>
            <h2 className="text-2xl font-semibold m-4">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {nfts.length > 0 ? (
                    nfts.map(nft => <NFTItem key={nft.nft_id} nft={nft} />)
                ) : (
                    <p>No NFTs</p>
                )}
            </div>
        </>
    );

    return (
        <div>
        {/* {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>} */}
        {ownedNfts.length > 0 && renderNFTs(ownedNfts, "Your Owned NFTs")}
        {deployedNfts.length > 0 && renderNFTs(deployedNfts, "Your Deployed NFTs")}
    </div>
    );
}

export default WalletNFTs;
