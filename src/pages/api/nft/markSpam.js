import db from "../../../lib/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { contractAddress, collectionName } = req.body;

        if (!contractAddress) {
            return res.status(400).json({ error: "Missing contract address" });
        }

        // Check if the contract address is already in the spam table
        const existingEntry = await db.oneOrNone(
            "SELECT * FROM staging.spam WHERE contract_address = $1",
            [contractAddress]
        );

        if (existingEntry) {
            // If it exists, increment the flagged_count and update the last_flagged timestamp
            await db.none(
                "UPDATE staging.spam SET flagged_count = flagged_count + 1, last_flagged = CURRENT_TIMESTAMP WHERE contract_address = $1",
                [contractAddress]
            );
        } else {
            // If it doesn't exist, insert a new entry
            await db.none(
                "INSERT INTO staging.spam (spam_id, contract_address, collection_name, flagged_count, last_flagged) VALUES ($1, $2, $3, $4, $5)",
                [uuidv4(), contractAddress, collectionName, 1, new Date()]
            );
        }

        res.status(200).json({ message: "Contract address marked as spam" });
    } catch (error) {
        console.error("Error marking as spam:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}