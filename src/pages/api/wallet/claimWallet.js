// pages/api/wallet/claimWallet.js
// This api is allows a user to tie thier wallet to their account in the database.
// This api also checks to see if there are any deployed nfts from this wallet and creates an artist entry for it


import { getToken } from "next-auth/jwt";
import web3 from "../../../lib/ethersProvider";
import db from "../../../lib/db";

export default async (req, res) => {
    if (req.method === "POST") {
        const session = await getToken({ req });

        if (!session) {
            return res.status(401).json({ error: "Not authenticated from the session" });
        }

        // Extract wallet info from request
        const { address, signature } = req.body;
        const message = "Please sign this message to verify your wallet ownership.";

        try {
            // Verify the signature using web3.js
            const recoveredAddress = web3.eth.accounts.recover(message, signature);

            // Check if the recovered address matches the provided address
            if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
                return res.status(400).json({ error: "Signature verification failed." });
            }

            const existingEntry = await db.oneOrNone(
                "SELECT * FROM wallets WHERE user_id = $1 AND wallet_address = $2",
                [session.user_id, address]
            );
            const existingNFTs = await db.manyOrNone(
                "SELECT * FROM nfts WHERE deployer_address = $1",
                [address]
            );

            if (existingEntry) {
                return res.status(200).json({ error: "Wallet already exists." });
            }

            await db.none(
                "INSERT INTO wallets(user_id, wallet_address) VALUES($1, $2)",
                [session.user_id, address]
            );

            if (existingNFTs.length > 0) {
                await db.none(
                    "INSERT INTO artists(user_id, deployer_address) VALUES($1, $2)",
                    [session.user_id, address]
                );
            }

            return res.status(205).json({
                success: true,
                message: "Wallet added successfully.",
            });
        } catch (error) {
            console.error("Failed to claim wallet:", error);
            return res.status(500).json({ error: "Database error: " + error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
};