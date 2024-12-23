import React, { useState } from "react";
import Image from "next/image";
import fallbackImageUrl from "../../../public/placeholder.png";
import Link from "next/link";
import Web3 from "web3";

const web3 = new Web3();

const TokenTile = ({ token }) => {
    const [message, setMessage] = useState("");

    const checksumAddress = web3.utils.toChecksumAddress(token.contractAddress);

    const handleFindBenefitsClick = async () => {
        try {
            const response = await fetch("/api/crawl/addToStaging", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contractAddress: checksumAddress,
                    tokenType: "ERC20",
                    collectionName: token.name,
                }),
            });

            if (response.ok) {
                setMessage("Token has been added to staging.");
            } else {
                setMessage("Failed to add token to staging.");
            }
        } catch (error) {
            console.error("Error adding token to staging:", error);
            setMessage("An error occurred. Please try again.");
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
                    contractAddress: checksumAddress,
                    tokenType: "ERC20",
                    collectionName: token.name,
                }),
            });

            if (response.ok) {
                setMessage("Token has been marked as spam.");
            } else {
                setMessage("Failed to mark token as spam.");
            }
        } catch (error) {
            console.error("Error marking token as spam:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    const tileContent = (
        <>
            <div className="flex items-center mb-4">
                <Image
                    src={token.logo || fallbackImageUrl}
                    alt={token.name}
                    width={50}
                    height={50}
                    className="rounded-full flex-shrink-0" // Add flex-shrink-0
                />
                <div className="ml-4 flex-grow min-w-0">
                    <h2 className="text-xl font-bold truncate">
                        {token.name || "Unknown Token"}
                    </h2>
                    <p className="text-lg font-heading text-primary truncate">
                        {token.symbol || "N/A"}
                    </p>
                    <p className="text-sm truncate">
                        <span className="font-bold">{token.balance}</span>
                    </p>
                </div>
            </div>
            {token.description && token.description.trim() !== "" ? (
                <p className="mb-4 line-clamp-3">
                    {token.description}
                </p>
            ) : (
                <>
                    <div className="mb-4 wrap break-words">
                        <p>
                            We are not yet tracking this token. You can help by
                            flagging it as spam or letting us know you want more info
                            on it.
                        </p>
                    </div>
                    <div className="flex space-x-2 w-full">
                        <button
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                            onClick={handleFindBenefitsClick}
                        >
                            Find Benefits
                        </button>
                        <button
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                            onClick={handleSpamClick}
                        >
                            Mark as Spam
                        </button>
                    </div>
                </>
            )}
            {message && <p className="mt-2 text-sm italic">{message}</p>}
        </>
    );

    if (token.description && token.description.trim() !== "") {
        return (
            <Link href={`/token/${checksumAddress}`} legacyBehavior>
                <a className="block bg-light-tertiary dark:bg-dark-tertiary text-light-font dark:text-dark-primary rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300">
                    {tileContent}
                </a>
            </Link>
        );
    } else {
        return (
            <div className="bg-light-tertiary dark:bg-dark-tertiary text-light-font dark:text-dark-primary rounded-lg shadow-lg p-4">
                {tileContent}
            </div>
        );
    }
};

export default TokenTile;
