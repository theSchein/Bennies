import React from "react";
import Image from "next/image";
import { useState } from "react";
import EditPageButton from "../edit/editPageButton";
import Likes from "../likes/likes";
import { getImageSource } from "../utils/getImageSource";
import fallbackImageUrl from "../../../public/placeholder.png";
import Modal from "@mui/material/Modal";
import TwitterData from "../twitter/TwitterData";
import TokenChart from "./chart";

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
            {/* Title and Image */}
            <div className="flex items-center justify-between mb-6">
                {token.token_name && (
                    <h1 className="font-heading text-4xl break-words">
                        {token.token_name}
                    </h1>
                )}
                <div className="relative w-32 h-32 rounded overflow-hidden shadow-2xl">
                    <Image
                        src={imageSource}
                        alt={token.token_name}
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </div>
            {/* Token Symbol and Likes */}
            {token.token_symbol && (
                <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-light-tertiary dark:bg-dark-tertiary p-2 rounded-lg shadow">
                        <p className="font-bold text-lg dark:text-dark-primary">
                            {token.token_symbol}
                        </p>
                    </div>
                    <Likes token_id={token.token_id} />
                </div>
            )}
            {/* Edit Button */}
            <div className="text-center mb-6">
                <EditPageButton pageData={token} />
            </div>
            {/* Description */}
            {token.description && (
                <p className="font-body text-lg break-words mb-6">
                    {token.description}
                </p>
            )}
            {/* Utility */}
            {token.token_utility && (
                <div className="bg-light-tertiary dark:bg-dark-tertiary shadow-xl p-3 rounded-xl mb-6">
                    <p className="font-bold text-xl m-3">Utility</p>
                    <p className="font-body text-lg break-words m-3">
                        {token.token_utility}
                    </p>
                </div>
            )}
            {/* Twitter Data */}
            <TwitterData twitter={twitterData} />
            {/* Token Chart */}
            <div className="bg-light-tertiary dark:bg-dark-tertiary p-6 rounded-lg shadow-lg space-y-6 mb-6">
                <TokenChart contractAddress={token.contract_address} />
            </div>
            {/* Additional Details */}
            <div className="text-lg font-bold italic dark:text-dark-font">
                {token.deployer_address && (
                    <p className="break-words">Deployer: {token.deployer_address}</p>
                )}
                {token.supply && <p className="break-words">Supply: {token.supply}</p>}
                {token.creation_date && (
                    <p className="break-words">
                        Creation Date: {new Date(token.creation_date).toLocaleDateString()}
                    </p>
                )}
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
