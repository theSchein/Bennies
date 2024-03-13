// pages/admin.js
// This is the admin page that is used to add NFTs and collections to the database.
// TODO: Password protect this page.

import { useState } from "react";

export default function AdminPage() {
    const [contract, setContract] = useState("");
    const [contractType, setContractType] = useState(""); // For contract type (ERC-721 or ERC-1155)
    const [category, setCategory] = useState(""); // For category
    const [metadata, setMetadata] = useState(null);

    const fetchDetails = async () => {
        try {
            const response = await fetch(
                `/api/crawl/uploadByContract?contract=${contract}&contractType=${contractType}`,  // &category=${encodeURIComponent(category)}`,
            );
            const metadata = await response.json();
            setMetadata(metadata);
        } catch (error) {
            console.error("Error fetching NFT details:", error);
        }
    };

    return (
        <div>
            <h1>Fetch NFT Metadata</h1>
            <input
                type="text"
                value={contract}
                onChange={(e) => setContract(e.target.value)}
                placeholder="Enter Contract Address"
            />
            <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                placeholder="Select Contract Type"
            >
                <option value="">Select Contract Type</option>
                <option value="ERC-721">ERC-721</option>
                <option value="ERC-1155">ERC-1155</option>
            </select>
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter Category"
            />
            <button onClick={fetchDetails}>Fetch Metadata</button>

            {metadata && (
                <div>
                    <p>Name: {metadata.name}</p>
                    <p>Description: {metadata.description}</p>
                    <p>Image link: {metadata.image}</p>
                    <p>Token URI: {metadata.tokenURI}</p>
                </div>
            )}
        </div>
    );
}
