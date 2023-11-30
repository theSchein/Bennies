// pages/admin.js
// This is the admin page that is used to add NFTs and collections to the database.
// TODO: Password protect this page.

import { useState } from "react";

export default function AdminPage() {
    const [contract, setContract] = useState("");
    const [details, setDetails] = useState(null);

    const fetchDetails = async () => {
        try {
            const response = await fetch(
                `api/crawl/uploadByContract?contract=${contract}`,
            );
            const data = await response.json();
            setDetails(data);
        } catch (error) {
            console.error("Error fetching NFT details:", error);
        }
    };

    return (
        <div>
            <h1>Fetch NFT Details</h1>
            <input
                type="text"
                value={contract}
                onChange={(e) => setContract(e.target.value)}
                placeholder="Enter Contract Address"
            />
            <button onClick={fetchDetails}>Fetch</button>

            {details && (
                <div>
                    {/* Render your details here */}
                    <pre>{JSON.stringify(details, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
