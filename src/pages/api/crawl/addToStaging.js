import db from "../../../lib/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { contractAddress, tokenType, collectionName } = req.body;

        if (!contractAddress ) {
            return res.status(400).json({ error: "Missing contract address or token type" });
        }

        // Check if the contract address is already in the user_submissions table
        const existingEntry = await db.oneOrNone(
            "SELECT * FROM staging.user_submissions WHERE contract_address = $1",
            [contractAddress]
        );

        if (existingEntry) {
            // If it exists, increment the flagged_count and update the last_flagged timestamp
            await db.none(
                "UPDATE staging.user_submissions SET flagged_count = flagged_count + 1, received_at = CURRENT_TIMESTAMP WHERE contract_address = $1",
                [contractAddress]
            );
        } else {
            // If it doesn't exist, insert a new entry
            await db.none(
                "INSERT INTO staging.user_submissions (submission_id, contract_address, token_type, name, flagged_count) VALUES ($1, $2, $3, $4, $5)",
                [uuidv4(), contractAddress, tokenType, collectionName, 1]
            );
        }

        res.status(200).json({ message: "Submission received, awaiting review by admin." });
    } catch (error) {
        console.error("Error adding user submission:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
