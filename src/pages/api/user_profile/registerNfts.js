// pages/api/user_profile/registerNfts.js

import { getToken } from "next-auth/jwt";
import db from "../../../lib/db";
import { sendOnboardingEmail } from "../../../lib/emailUtils";

export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const session = await getToken({ req });

    if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const { user_id, username, email_address } = session.user;
    const { nfts } = req.body;

    if (!Array.isArray(nfts)) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    try {
        for (const nft of nfts) {
            const { collection_id } = nft;
            if (!collection_id) {
                console.warn(
                    `Skipping NFT with missing collection_id: ${nft.nft_id}`,
                );
                continue; // Skip NFTs with no collection_id
            }

            const existingEntry = await db.oneOrNone(
                "SELECT * FROM user_nft_communities WHERE user_id = $1 AND collection_id = $2",
                [user_id, collection_id],
            );

            if (!existingEntry) {
                await db.none(
                    "INSERT INTO user_nft_communities (user_id, collection_id) VALUES ($1, $2)",
                    [user_id, collection_id]
                );

                // Fetch collection details
                const collection = await db.oneOrNone(
                    "SELECT collection_name, collection_utility FROM collections WHERE collection_id = $1",
                    [collection_id]
                );

                if (!collection) {
                    console.error("Collection not found");
                    continue;
                }

                const { collection_name, collection_utility } = collection;
                const collectionLink = `https://bennies.fun/collection/${collection_id}/${encodeURIComponent(collection_name)}`;

                // Send onboarding email
                try {
                    await sendOnboardingEmail(
                        email_address,
                        username,
                        collection_name,
                        collection_utility,
                        collectionLink,
                    );
                } catch (emailError) {
                    console.error(`Failed to send onboarding email for collection: ${collection_name}`, emailError);
                }
            }
        }

        res.status(200).json({ message: "NFTs registered successfully" });
    } catch (error) {
        console.error("Failed to register NFTs:", error);
        res.status(500).json({ error: "Database error: " + error.message });
    }
};
