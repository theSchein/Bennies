// components/NftDetails.jsx
// content rendering for the nft page

import React from 'react';
import Image from "next/image";
import { useState } from "react";
import EditPageButton from "../edit/editPageButton";
import IsOwner from "../check/isOwner";
import IsDeployer from "../check/isDeployer";
import CommentSection from "../../components/comment/CommentSection";
import Likes from "../likes/likes";
import Link from "next/link";
import { getImageSource } from "../utils/getImageSource";
import fallbackImageUrl from "../../../public/placeholder.png";
import StoreIcon from '@mui/icons-material/Store';
import NewsFeed from '../newsfeed/newsfeed';

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
        <div className="max-w-4xl mx-auto">
            {/* Grid container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-3xl">
                {/* Left Column */}
                <div className="space-y-4">
                    <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl mb-2 break-words">
                        {nft.nft_name}
                    </h1>
                    <Link href={`/collection/${nft.collection_id}/${nft.collection_name}`} className="font-bold">
                        {nft.collection_name}
                    </Link>
                    <p className="text-sm sm:text-base lg:text-lg break-words">
                        {nft.artist_name}
                    </p>
                    <p className="font-body text-sm sm:text-base lg:text-lg break-words">
                        {`Category: ${nft.category || nft.nft_category}`}
                    </p>
                    <p className="font-body text-sm sm:text-base lg:text-lg break-words">
                        {nft.nft_description}
                    </p>
                    <p className="font-body text-sm sm:text-base lg:text-lg break-words">
                        {nft.nft_utility}
                    </p>
                    <CommentSection nft={nft} />
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div className="relative w-full h-48 sm:h-64 lg:h-[500px] rounded overflow-hidden shadow-2xl">
                        <Image src={imageSource} alt={nft.nft_name} layout="fill" objectFit="contain" />
                    </div>
                    <p className="font-body text-sm sm:text-base lg:text-lg break-words">
                        {`License: ${nft.nft_licence}`}
                    </p>
                    {/* Assuming sales link is tied to an icon */}
                    <div>
                        <a href={nft.sales_link} target="_blank" rel="noopener noreferrer">
                            {/* Icon component or image */}
                            <StoreIcon />
                        </a>
                    </div>
                    <div className="text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4 font-bold italic">
                        <p className="break-words">
                            {`Owners: ${nft.owners.length > 5 ? `${nft.owners.length} (Click to view all)` : nft.owners.join(", ")}`}
                        </p>
                        <p className="break-words">
                            {`Deployer: ${nft.deployer_address}`}
                        </p>
                    </div>
                    {/* <NewsFeed nft={nft.collection_id} /> */}
                </div>
            </div>

            {/* Modal for Owners, if needed */}
            {isModalOpen && (
                <Modal open={isModalOpen} onClose={handleModalToggle}>
                    {/* Modal content */}
                </Modal>
            )}
        </div>
    );
};

export default NftDetails;
