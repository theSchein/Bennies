import React from "react";
import Image from "next/image";
import { useState } from "react";
import EditPageButton from "../edit/editPageButton";
import CommentSection from "../comment/CommentSection";
import Likes from "../likes/likes";
import Link from "next/link";
import { getImageSource } from "../utils/getImageSource";
import fallbackImageUrl from "../../../public/placeholder.png";
import StoreIcon from "@mui/icons-material/Store";
import NewsFeed from "../newsfeed/newsfeed";
import Modal from "@mui/material/Modal";
import TwitterData from "../twitter/TwitterData";  // Import TwitterData component

const TokenDetails = ({ token, twitterData }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const imageSource = getImageSource(token.logo_media || fallbackImageUrl);

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
                <div className="p-6 rounded-lg space-y-6">
                    <h1 className="font-heading text-4xl mb-4 break-words">
                        {token.token_name}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="bg-light-tertiary dark:bg-dark-tertiary p-2 rounded-lg shadow">
                            <p className="font-bold text-lg dark:text-dark-primary">
                                {token.token_symbol}
                            </p>
                        </div>
                        <Likes token_id={token.token_id} />
                    </div>
                    <div className="text-center">
                        <EditPageButton
                            pageData={token}
                        />
                    </div>
                    <p className="font-body text-lg break-words">
                        {token.description}
                    </p>
                    <div className="bg-light-tertiary dark:bg-dark-tertiary shadow-xl p-3 rounded-xl">
                        <p className="font-bold text-xl m-3">
                            Utility
                        </p>
                        <p className="font-body text-lg break-words m-3">
                            {token.token_utility}
                        </p>
                    </div>
                    {/* <CommentSection token={token} /> */}
                    {/* Twitter Data */}
                    <TwitterData twitter={twitterData} />
                </div>

                {/* Right Column */}
                <div className="bg-light-tertiary dark:bg-dark-tertiary p-6 rounded-lg space-y-6">
                    <div className="relative w-full h-[500px] rounded overflow-hidden shadow-2xl">
                        <Image
                            src={imageSource}
                            alt={token.token_name}
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="flex p-2 bg-light-secondary rounded-md">
                            <p className="font-body italic text-lg dark:text-dark-quaternary break-words">
                                Decimals:
                            </p>
                            <p className="font-body text-lg font-bold dark:text-dark-quaternary break-words ml-2">
                                {token.decimals}
                            </p>
                        </div>
                        <a
                            href={token.marketplace_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto"
                        >
                            <StoreIcon
                                className="dark:text-dark-primary hover:text-light-secondary dark:hover:text-dark-secondary"
                                style={{ fontSize: 40 }}
                            />
                        </a>
                    </div>
                    <div className="text-lg font-bold italic dark:text-dark-font">
                        <p className="break-words">
                            Deployer: {token.deployer_address}
                        </p>
                        <p className="break-words">
                            Supply: {token.supply}
                        </p>
                        <p className="break-words">
                            Creation Date: {new Date(token.creation_date).toLocaleDateString()}
                        </p>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 italic dark:text-dark-font">News Feed</h2>
                    <NewsFeed
                        collectionIds={[token.universe_id]}
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

export default TokenDetails;
