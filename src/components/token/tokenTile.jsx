// components/token/TokenTile.jsx
import React, { useState } from "react";
import Image from "next/image";
import fallbackImageUrl from "../../../public/placeholder.png";

const TokenTile = ({ token }) => {
    const [message, setMessage] = useState("");

    const handleFindBenefitsClick = async () => {
        try {
            const response = await fetch("/api/staging/addToStaging", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ contractAddress: token.contractAddress }),
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
            const response = await fetch("/api/staging/markSpam", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ contractAddress: token.contractAddress, collectionName: token.name }),
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

    return (
        <div className="bg-light-secondary dark:bg-dark-secondary bg-opacity-90 text-light-font dark:text-dark-primary rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 ease-in-out m-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
            <div className="p-4 space-y-2">
                <div className="flex justify-center items-center">
                    <Image
                        src={token.logo || fallbackImageUrl}
                        alt={token.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                </div>
                <h2 className="text-xl font-bold text-center">{token.name || "Unknown Token"}</h2>
                <p className="text-lg text-primary text-center">{token.symbol || "N/A"}</p>
                <p className="text-sm text-gray-500 text-center">Balance: {token.balance}</p>
                <div className="flex justify-center mt-4 space-x-2">
                    <button
                        className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                        onClick={handleFindBenefitsClick}
                    >
                        Find Benefits
                    </button>
                    <button
                        className="px-4 py-2 mt-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                        onClick={handleSpamClick}
                    >
                        Mark as Spam
                    </button>
                </div>
                {message && <p className="mt-2 text-sm text-gray-500 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default TokenTile;