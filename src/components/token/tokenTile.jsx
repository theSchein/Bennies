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
                body: JSON.stringify({
                    contractAddress: token.contractAddress,
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

    return (
        <div className="bg-light-tertiary dark:bg-dark-tertiary text-light-font dark:text-dark-primary rounded-lg shadow-lg p-4 flex flex-col">
            <div className="flex items-center mb-4">
                <Image
                    src={token.logo || fallbackImageUrl}
                    alt={token.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                />
                <div className="ml-4">
                    <h2 className="text-xl font-bold">
                        {token.name || "Unknown Token"}
                    </h2>
                    <p className="text-lg font-heading text-primary">{token.symbol || "N/A"}</p>
                    <p className="text-sm ">Balance: <span className="font-bold">{token.balance}</span></p>
                </div>
            </div>
            <div className="mb-4">
                <p className="">
                    We are not yet tracking this token yet. You can help by flagging
                    it as spam or letting us know you want more info on it.
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
            {message && <p className="mt-2 text-sm italic">{message}</p>}
        </div>
    );
};

export default TokenTile;
