// pages/admin.js
// This is the admin page that is used to add NFTs and collections to the database.
// TODO: Password protect this page.

import { useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";

export default function AdminPage() {
    const [contract, setContract] = useState("");
    const [details, setDetails] = useState(null);
    const [tokenId, setTokenId] = useState("");
    const [metadata, setMetadata] = useState(null);

    const fetchDetails = async () => {
        try {
            const response = await fetch(
                `api/crawl/uploadByContract?contract=${contract}`,
            );
            const metadata = await response.json();
            setMetadata(metadata);
        } catch (error) {
            console.error("Error fetching NFT details:", error);
        }
    };

    // const fetchMetadata = async () => {
    //     try {
    //         console.log("Sending api metadata for", contract, tokenId);
    //         const response = await fetch(
    //             `/api/crawl/metadata?contractAddress=${contract}&tokenId=${tokenId}`,
    //         );
    //         const data = await response.json();
    //         setMetadata(data);
    //     } catch (error) {
    //         console.error("Error fetching NFT metadata:", error);
    //     }
    // };

    return (
        <div>
            <h1>Fetch NFT Metadata</h1>
            <input
                type="text"
                value={contract}
                onChange={(e) => setContract(e.target.value)}
                placeholder="Enter Contract Address"
            />
            {/* <input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="Enter Token ID"
            /> */}
            <button onClick={fetchDetails}>Fetch Metadata</button>

            {metadata && (
                <div>
                    <p>Name: {metadata.name}</p>
                    <p>Description: {metadata.description}</p>
                    <p>image link: {metadata.image} </p>I
                    <p>token URI: </p>
                </div>
            )}
        </div>
    );
}
