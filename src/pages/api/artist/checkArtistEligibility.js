// pages/api/artist/checkArtistEligibility.js
// API to check if a wallet address is sn nft deployer
// If ues then the user may create an artist page

import db from "../../../lib/db";
import { getToken } from "next-auth/jwt";


export default async (req, res) => {
    if (req.method === "POST") {
        const session = await getToken({ req });

        if (!session) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        let wallets = req.body.wallets; 
        console.log('wallets', wallets)

        // Ensure wallets is always an array
        if (!Array.isArray(wallets)) {
            wallets = [wallets].filter(Boolean); // Filter out falsy values
        }

        // If wallets array is empty, return false immediately
        if (wallets.length === 0) {
            return res.status(200).json({ isEligible: false });
        }

        try {
            // Check if any of the wallet addresses exist in the deployer field
            for (const address of wallets) {
                const matchingEntry = await db.oneOrNone(
                    "SELECT * FROM nfts WHERE deployer_address = $1",
                    [address],
                );

                if (matchingEntry) {
                    return res.status(200).json({ isEligible: true });
                }
            }

            // If none of the wallets are eligible
            return res.status(200).json({ isEligible: false });
        } catch (error) {
            res.status(500).json({ error: "Database error: " + error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};
