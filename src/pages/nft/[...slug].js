// pages/nft/[...slug].js
// This file is used to display the NFT page.
// It grabs the nft metadata by slug from the database.

import { useState } from "react";
import db from "../../lib/db";
import CommentSection from "../../components/comment/CommentSection";
import Image from "next/image";
import EditPageButton from "../../components/edit/editPageButton";
import IsOwner from "../../components/check/isOwner";
import IsDeployer from "@/components/check/isDeployer";
import Likes from "@/components/likes/likes";
import Link from "next/link";
import { getImageSource } from "@/components/utils/getImageSource";
import fallbackImageUrl from "../../../public/placeholder.png";

export async function getServerSideProps({ params }) {
    const { slug } = params;
    const nftDataQuery = `
        SELECT nfts.*, collections.collection_name
        FROM nfts
        JOIN collections ON nfts.collection_id = collections.collection_id
        WHERE nft_id = $1
    `;
    try {
        const nft = await db.one(nftDataQuery, [slug[0]]);
        return { props: { nft } };
    } catch (error) {
        console.error("Error fetching NFT data:", error);
        // Handle errors, such as returning a 404 page or a custom error message
        return { props: { error: "NFT not found" } };
    }
}

export default function NftPage({ nft }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const isOwner = IsOwner(nft.owners);
    const isDeployer = IsDeployer(nft.deployer_address);

    const imageSource = getImageSource(nft.media_url, fallbackImageUrl);

    const handleModalToggle = () => {
        setModalOpen(!isModalOpen);
    };

    return (
         <div
            className="min-h-screen bg-primary flex flex-col items-center justify-center
    py-4 sm:py-6 lg:py-8 px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 bg-gradient-light dark:bg-gradient-dark
    text-light-quaternary dark:text-dark-quaternary"
        >
            <div className="flex bg-light-primary dark:bg-dark-primary flex-col items-center justify-center space-y-3 sm:space-y-4">
                <div className="text-center w-full px-2">
                    <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-8 break-words">
                        {nft.artist_name}
                    </h1>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 rounded-3xl shadow-3xl space-y-4 sm:space-y-6 w-full max-w-4xl">
                    <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl mb-2 break-words">
                        {nft.nft_name}
                    </h1>
                    <Link
                        href={`/collection/${nft.collection_id}/${nft.collection_name}`}
                        className="font-bold"
                    >
                        {nft.collection_name}
                    </Link>
                    <p className="font-body text-sm sm:text-base lg:text-lg break-words">
                        {nft.nft_description}
                   </p>
                    <Likes nft_id={nft.nft_id} />
                    <h2>
                        <EditPageButton
                            isOwner={isOwner}
                            isDeployer={isDeployer}
                            pageData={nft}
                        />
                    </h2>
                    <div className="relative w-full h-48 sm:h-64 lg:h-[500px] rounded overflow-hidden">
                        <div className="shadow-2xl rounded w-full h-full">
                            <Image
                                src={imageSource}
                                alt={nft.nft_name}
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4 font-bold italic">
                        <h2 className="m-2 break-words">
                            {nft.owners.length === 1 ? "Owner: " : "Owners:"}
                            {nft.owners.length > 5 ? (
                                <span
                                    onClick={handleModalToggle}
                                    className="cursor-pointer underline"
                                >
                                    {nft.owners.length} owners (Click to view all)
                                </span>
                            ) : (
                                <span className="break-all">
                                    {nft.owners.join(", ")}
                                </span>
                            )}
                        </h2>
                        <h2 className="break-words">
                            Deployer:{" "}
                            <span className="break-all">{nft.deployer_address}</span>
                        </h2>
                    </div>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-md sm:max-w-xl w-full max-h-[400px] overflow-y-auto relative">
                                <button
                                    onClick={handleModalToggle}
                                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl font-bold text-gray-800 hover:text-gray-600"
                                >
                                    &times;
                                </button>
                                <h3 className="text-xl sm:text-2xl mb-4">Owners</h3>
                                <ul className="list-disc space-y-2 pl-4 sm:pl-5">
                                    {nft.owners.map((owner, index) => (
                                        <li
                                            key={index}
                                            className="text-base sm:text-lg break-all"
                                        >
                                            {owner}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    <CommentSection nft={nft} />
                </div>
            </div>
        </div>
    );
}
