// components/NftDetails.jsx
// content rendering for the nft page

import React from 'react';
import Image from "next/image";
import { useState } from "react";
import EditPageButton from "../edit/editPageButton";
import IsOwner from "../check/isOwner";
import IsDeployer from "../check/isDeployer";
import Likes from "../likes/likes";
import Link from "next/link";
import { getImageSource } from "../utils/getImageSource";
import fallbackImageUrl from "../../../public/placeholder.png";

const NftDetails = ({ nft }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const isOwner = IsOwner(nft.owners);
    const isDeployer = IsDeployer(nft.deployer_address);
    const imageSource = getImageSource(nft.media_url, fallbackImageUrl);

    const handleModalToggle = () => setModalOpen(!isModalOpen);


    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 rounded-3xl shadow-3xl space-y-4 sm:space-y-6 w-full max-w-4xl">
            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl mb-2 break-words">
                {nft.nft_name}
            </h1>
            <Link href={`/collection/${nft.collection_id}/${nft.collection_name}`} className="font-bold">
                {nft.collection_name}
            </Link>
            <p className="font-body text-sm sm:text-base lg:text-lg break-words">
                {nft.nft_description}
            </p>
            <Likes nft_id={nft.nft_id} />
            <EditPageButton isOwner={isOwner} isDeployer={isDeployer} pageData={nft} />
            <div className="relative w-full h-48 sm:h-64 lg:h-[500px] rounded overflow-hidden">
                <div className="shadow-2xl rounded w-full h-full">
                    <Image src={imageSource} alt={nft.nft_name} layout="fill" objectFit="contain" />
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
        </div>
    );
};

export default NftDetails;
