// pages/api/wallet/claimWallet.js
import db from "../../../lib/db";

export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Extract wallet info and session data from request
    const { address, session } = req.body;

    if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
    }


    try {
        // Check if the wallet is already registered
        const existingEntry = await db.oneOrNone(
            "SELECT * FROM wallets WHERE user_id = $1 AND wallet_address = $2",
            [session.user_id, address]
        );

        if (existingEntry) {
            return res.status(409).json({ error: "Wallet already exists." });
        }

        // Insert new wallet entry
        await db.none(
            "INSERT INTO wallets(user_id, wallet_address) VALUES($1, $2)",
            [session.user_id, address]
        );

        // Check for NFTs associated with this address
        const existingNFTs = await db.manyOrNone(
            "SELECT * FROM nfts WHERE deployer_address = $1",
            [address]
        );

        // Add user as an artist if they deploy NFTs
        if (existingNFTs.length > 0) {
            await db.none(
                "INSERT INTO artists(user_id, deployer_address) VALUES($1, $2)",
                [session.user_id, address]
            );
        }

        return res.status(201).json({
            success: true,
            message: "Wallet added successfully."
        });
    } catch (error) {
        console.error("Failed to claim wallet:", error);
        return res.status(500).json({ error: "Database error: " + error.message });
    }
};
