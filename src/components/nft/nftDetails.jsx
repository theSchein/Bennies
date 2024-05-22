// components/NftDetails.jsx
// content rendering for the nft page

import React from "react";
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
import StoreIcon from "@mui/icons-material/Store";
import NewsFeed from "../newsfeed/newsfeed";
import Modal from "@mui/material/Modal";

const NftDetails = ({ nft }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const isOwner = IsOwner(nft.owners || []);
    const isDeployer = IsDeployer(nft.deployer_address);
    const imageSource = getImageSource(nft.media_url, fallbackImageUrl);

    const handleModalToggle = () => setModalOpen(!isModalOpen);

    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    return (
        <div className="max-w-7xl mx-auto bg-light-primary dark:bg-dark-primary p-6 rounded-xl shadow-xl">
            {/* Grid container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className=" p-6 rounded-lg space-y-6">
                    <h1 className="font-heading text-4xl   mb-4 break-words">
                        {nft.nft_name}
                    </h1>
                    <Link
                        href={`/collection/${nft.collection_id}/${nft.collection_name}`}
                        className="text-3xl font-bold italic  hover:text-light-tertiary dark:hover:text-dark-secondary"
                    >
                        {nft.collection_name}
                    </Link>
                    <div className="flex items-center space-x-4">
                        <div className="bg-light-tertiary dark:bg-dark-tertiary p-2 rounded-lg shadow">
                            <p className="font-bold text-lg  dark:text-dark-primary">
                                {nft.category || nft.nft_category}
                            </p>
                        </div>
                        <Likes nft_id={nft.nft_id} />
                    </div>
                    <div className="text-center">
                        <EditPageButton
                            isOwner={isOwner}
                            isDeployer={isDeployer}
                            pageData={nft}
                        />
                    </div>
                    <p className="font-body text-lg   break-words">
                        {nft.nft_description}
                    </p>
                    <div className="bg-light-tertiary dark:bg-dark-tertieary shadow-xl p-3 rounded-xl">
                        <p className="font-bold text-xl m-3">
                            Utility
                        </p>
                        <p className="font-body text-lg break-words m-3">
                            {nft.nft_utility}
                        </p>
                    </div>
                    <CommentSection nft={nft} />
                </div>

                {/* Right Column */}
                <div className="bg-light-tertiary dark:bg-dark-tertiary p-6 rounded-lg space-y-6">
                    <div className="relative w-full h-[500px] rounded overflow-hidden shadow-2xl">
                        <Image
                            src={imageSource}
                            alt={nft.nft_name}
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="flex p-2 bg-light-secondary rounded-md">
                        <p className="font-body italic text-lg dark:text-dark-quaternary break-words">
                            License:
                        </p>
                        <p className="font-body text-lg font-bold = dark:text-dark-quaternary break-words ml-2">
                            {nft.nft_licence}
                        </p>
                        </div>
                        <a
                            href={nft.sales_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto"
                        >
                            <StoreIcon
                                className=" dark:text-dark-primary hover:text-light-secondary dark:hover:text-dark-secondary"
                                style={{ fontSize: 40 }}
                            />
                        </a>
                    </div>
                    <div className="text-lg font-bold italic dark:text-dark-font">
                        <p className="break-words">
                            Owner(s):{" "}
                            {nft.owners.length > 5
                                ? `${nft.owners.length} (Click to view all)`
                                : nft.owners.join(", ")}
                        </p>
                        <p className="break-words">
                            Deployer: {nft.deployer_address}
                        </p>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 italic dark:text-dark-font">News Feed</h2>
                    <NewsFeed
                        collectionIds={[nft.collection_id]}
                        viewingGroup="holders"
                    />
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
