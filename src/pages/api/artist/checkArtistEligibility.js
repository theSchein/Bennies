import db from "../../../lib/db";

export default async (req, res) => {
    if (req.method === "POST") {
        try {
            const { address } = req.body;
            if (!address) {
                return res.status(400).json({ error: "Wallet address is required" });
            }

            // Query the database to check if the walletAddress exists in the deployer field
            const matchingEntry = await db.oneOrNone(
                "SELECT * FROM nfts WHERE deployer_address = $1",
                [address],
            );

            if (matchingEntry) {
                res.status(200).json({ isEligible: true });
            } else {
                res.status(200).json({ isEligible: false });
            }
        } catch (error) {
            res.status(500).json({ error: "Database error: " + error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};
