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

export async function getServerSideProps({ params }) {
    const { slug } = params;
    const nft = await db.one("SELECT * FROM nfts WHERE nft_id = $1", [slug[0]]);
    return { props: { nft } };
}

export default function NftPage({ nft }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const isOwner = IsOwner(nft.owners);
    const isDeployer = IsDeployer(nft.deployer_address);


    const handleModalToggle = () => {
        setModalOpen(!isModalOpen);
    };

    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center w-full">
                <h1 className="text-quaternary font-heading text-3xl sm:text-4xl mb-8 break-words">
                    {nft.artist_name}
                </h1>
            </div>
            <div className="bg-secondary p-6 sm:p-8 rounded-3xl shadow-3xl space-y-6 w-full max-w-4xl">
                <h1 className="text-quaternary font-heading text-2xl sm:text-3xl mb-4 break-words">
                    {nft.nft_name}
                </h1>
                <p className="text-quaternary font-body text-base sm:text-lg break-words">
                    {nft.nft_description}
                </p>
                <h2 className="text-quaternary font-heading text-xl sm:text-2xl break-words">

                    <EditPageButton isOwner={isOwner} isDeployer={isDeployer} pageData={nft} />
                </h2>
                <div className="relative w-full h-64 sm:h-[500px] rounded overflow-hidden">
                    <Image
                        src={nft.media_url}
                        alt={nft.nft_name}
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                    <h2 className="text-quaternary font-heading text-xl sm:text-2xl break-words">
                        {nft.owners.length === 1 ? "Owner:" : "Owners:"}
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
                    <h2 className="text-quaternary font-heading text-xl sm:text-2xl mt-4 sm:mt-0 break-words">
                        Deployer:{" "}
                        <span className="break-all">{nft.deployer_address}</span>
                    </h2>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full max-h-[400px] overflow-y-auto relative">
                            <button
                                onClick={handleModalToggle}
                                className="absolute top-4 right-4 text-2xl font-bold text-gray-800 hover:text-gray-600"
                            >
                                &times;
                            </button>
                            <h3 className="text-2xl mb-4">Owners</h3>
                            <ul className="list-disc space-y-2 pl-5">
                                {nft.owners.map((owner, index) => (
                                    <li key={index} className="text-lg break-all">
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
    );
}
