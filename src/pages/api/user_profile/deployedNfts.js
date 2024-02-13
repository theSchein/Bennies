// pages/api/user_profile/deployedNfts.js

import db from "../../../lib/db";
import { getToken } from "next-auth/jwt";

export default async (req, res) => {
    if (req.method === "GET") {
        const session = await getToken({ req });

        if (!session) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const address = req.query.address; // Assuming address is passed as a query parameter

        if (!address) {
            return res.status(400).json({ error: "Missing address" });
        }

        try {
            // Fetch NFTs deployed by the user
            const deployedNfts = await db.manyOrNone(
                "SELECT nfts.contract_address_token_id, nfts.nft_id, nfts.nft_name,  nfts.media_url, collections.collection_name FROM nfts LEFT JOIN collections ON nfts.collection_id = collections.collection_id WHERE LOWER(nfts.deployer_address) = $1",
                [address.toLowerCase()],
            );

            if (!deployedNfts) {
                return res
                    .status(404)
                    .json({ error: "No deployed NFTs found for this address." });
            }

            res.status(200).json(deployedNfts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
};
