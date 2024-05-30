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
            const response = await fetch("/api/nft/addToStaging", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ contractAddress: nft.contractAddress }),
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
            const response = await fetch("/api/nft/markSpam", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contractAddress: nft.contractAddress,
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
        <div
            className={`bg-light-secondary dark:bg-dark-secondary bg-opacity-90 text-light-font dark:text-dark-primary rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 ease-in-out m-4`}
            style={{ width: "100%" }}
        >
            <div className="p-4 font-heading text-lg">
                {nft.inDatabase ? (
                    <Link
                        href={`/collection/${nft.collection_id}`}
                        passHref
                        legacyBehavior
                    >
                        <a className="text-lg font-semibold text-primary hover:underline">
                            {nft.collection_name}
                        </a>
                    </Link>
                ) : (
                    <p className="text-lg font-semibold text-primary">
                        {nft.collectionName || "Unknown Collection"}
                    </p>
                )}
            </div>
            <div className="relative w-full h-64">
                <Link
                    href={`/nft/${nft.nft_id || `${nft.contractAddress}-${nft.tokenId}`}/${nft.nftName || "unknown"}`}
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
            </div>
            <div className="p-4 space-y-2">
                <h2 className="text-xl font-bold break-words">
                    {nft.nft_name || nft.nftName || "Unknown NFT"}
                </h2>
                {nft.inDatabase ? (
                    <>
                        <div className="flex justify-between items-center p-4">
                            <div className="flex items-center bg-light-tertiary dark:bg-dark-tertiary text-light-font dark:text-dark-primary rounded-lg shadow px-3 py-1 mr-1">
                                <p className="text-sm sm:text-md">
                                    Category:{" "}
                                    <span className="font-bold text-sm sm:text-md ">
                                        {category}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center bg-light-tertiary dark:bg-dark-tertiary text-light-font dark:text-dark-primary rounded-lg shadow px-3 py-1 ml-1">
                                <p className="text-sm sm:text-md">
                                    License:{" "}
                                    <span className="font-bold text-sm sm:text-md ">
                                        {license}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {utility && (
                            <div className="bg-light-tertiary dark:bg-dark-tertieary shadow-xl p-3 rounded-xl">
                                <p className="font-bold text-light-font dark:text-dark-quaternary m-3">
                                    Ownership Perks
                                </p>
                                <p className="font-body text-light-font dark:text-dark-quaternary break-words m-3">
                                    {utility}
                                </p>
                            </div>
                        )}
                        {isOwner || isDeployer ? (
                            <EditPageButton pageData={nft} />
                        ) : null}
                    </>
                ) : (
                    <>
                        <p className="text-lg text-gray-600 mb-4 text-center">
                            We are not yet tracking this NFT yet. You can help by
                            flagging it as spam or letting us know you want more info
                            on it.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-6 py-3 mt-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
                                onClick={handleFindBenefitsClick}
                            >
                                Find the Benefits of this NFT
                            </button>
                            <button
                                className="px-6 py-3 mt-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition duration-200 ease-in-out transform hover:scale-105"
                                onClick={handleSpamClick}
                            >
                                This NFT is spam, remove it
                            </button>
                        </div>
                        {message && (
                            <p className="mt-4 text-lg text-gray-600 mb-4 text-center">
                                {message}
                            </p>
                        )}
                    </>
                )}
            </div>
            {nft.inDatabase && (
                <div className="px-4 pb-4 dark:text-dark-quaternary text-light-font">
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
