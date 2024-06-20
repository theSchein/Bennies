import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getImageSource } from "@/components/utils/getImageSource";
import fallbackImageUrl from "../../../public/placeholder.png";
import EditPageButton from "../edit/editPageButton";
import IsOwner from "../check/isOwner";
import IsDeployer from "../check/isDeployer";
import NewsFeed from "../newsfeed/newsfeed";
import { useTheme } from "@mui/material/styles";

function NftTile({ nft }) {
    const theme = useTheme();
    const license = nft.license || nft.collection_licence;
    const utility = nft.nft_utility || nft.collection_utility;
    const category = nft.category || nft.collection_category;

    const isOwner = IsOwner(nft.owners);
    const isDeployer = IsDeployer(nft.deployer_address);
    const [message, setMessage] = useState("");

    const handleFindBenefitsClick = async () => {
        try {
            const response = await fetch("/api/crawl/addToStaging", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contractAddress: nft.contractAddress,
                    tokenType: "ERC721",
                    collectionName: nft.collectionName || "Unknown Collection",
                }),
            });

            if (response.ok) {
                setMessage("Contract address added to staging");
            } else {
                setMessage("Failed to add contract address to staging");
            }
        } catch (error) {
            console.error("Error adding to staging:", error);
            setMessage("Error adding contract address to staging");
        }
    };

    const handleSpamClick = async () => {
        try {
            const response = await fetch("/api/crawl/markSpam", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contractAddress: nft.contractAddress,
                    tokenType: "ERC721",
                    collectionName: nft.collectionName || "Unknown Collection",
                }),
            });

            if (response.ok) {
                setMessage("Contract address marked as spam");
            } else {
                setMessage("Failed to mark contract address as spam");
            }
        } catch (error) {
            console.error("Error marking as spam:", error);
            setMessage("Error marking contract address as spam");
        }
    };

    return (
        <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 text-light-font dark:text-dark-primary rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 ease-in-out h-full flex flex-col">
            <div className="p-2 font-heading text-sm">
                {nft.inDatabase ? (
                    <Link
                        href={`/collection/${nft.collection_id}`}
                        passHref
                        legacyBehavior
                    >
                        <a className="text-sm font-semibold text-primary hover:underline truncate">
                            {nft.collection_name}
                        </a>
                    </Link>
                ) : (
                    <p className="text-sm font-semibold text-primary truncate">
                        {nft.collectionName || "Unknown Collection"}
                    </p>
                )}
            </div>
            <div className="relative w-full h-40">
                {nft.inDatabase ? (
                    <Link
                        href={`/nft/${nft.nft_id}/${nft.nftName || "unknown"}`}
                        passHref
                        legacyBehavior
                    >
                        <a className="block">
                            <Image
                                src={getImageSource(
                                    nft.media_url || nft.mediaUrl,
                                    fallbackImageUrl,
                                )}
                                alt={nft.nft_name || nft.nftName || "NFT Image"}
                                layout="fill"
                                objectFit="cover"
                                className="transition duration-300 ease-in-out transform hover:scale-105"
                            />
                        </a>
                    </Link>
                ) : (
                    <Image
                        src={getImageSource(
                            nft.media_url || nft.mediaUrl,
                            fallbackImageUrl,
                        )}
                        alt={nft.nft_name || nft.nftName || "NFT Image"}
                        layout="fill"
                        objectFit="cover"
                        className="transition duration-300 ease-in-out transform hover:scale-105"
                    />
                )}
            </div>
            <div className="p-2 space-y-2 flex-grow">
                <h2 className="text-lg font-bold truncate">
                    {nft.nft_name || nft.nftName || "Unknown NFT"}
                </h2>
                {nft.inDatabase ? (
                    <>
                        <div className="flex justify-between items-center text-xs">
                            <span>Category: {category}</span>
                            <span>License: {license}</span>
                        </div>
                        {utility && (
                            <div className="bg-light-tertiary dark:bg-dark-tertieary shadow-xl p-2 rounded-xl">
                                <p className="font-bold text-xs">Ownership Perks</p>
                                <p className="text-xs line-clamp-3">{utility}</p>
                            </div>
                        )}
                        {isOwner || isDeployer ? (
                            <EditPageButton pageData={nft} />
                        ) : null}
                    </>
                ) : (
                    <>
                        <p className="text-sm mb-2 text-center">
                            We are not yet tracking this NFT. Help us improve!
                        </p>
                        <div className="flex justify-center space-x-2">
                            <button
                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-200"
                                onClick={handleFindBenefitsClick}
                            >
                                Find Benefits
                            </button>
                            <button
                                className="px-2 py-1 text-xs bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition duration-200"
                                onClick={handleSpamClick}
                            >
                                Mark as Spam
                            </button>
                        </div>
                    </>
                )}
            </div>
            {message && (
                <p className="p-2 text-xs italic text-center">{message}</p>
            )}
            {nft.inDatabase && (
                <div className="px-2 pb-2 dark:text-dark-quaternary text-light-font">
                    <NewsFeed
                        collectionIds={[nft.collection_id]}
                        viewingGroup="holders"
                    />
                </div>
            )}
        </div>
    );
}

export default NftTile;