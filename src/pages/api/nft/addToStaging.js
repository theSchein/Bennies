import db from "../../../lib/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { contractAddress } = req.body;

        if (!contractAddress) {
            return res.status(400).json({ error: "Missing contract address" });
        }

        // Generate a new source entry
        const sourceId = uuidv4();
        const sourceDescription = "Entered by user";

        await db.none(
            "INSERT INTO staging.sources (source_id, description) VALUES ($1, $2)",
            [sourceId, sourceDescription]
        );

        // Insert into staging_data table
        await db.none(
            "INSERT INTO staging.staging_data (data_id, source_id, contract_address) VALUES ($1, $2, $3)",
            [uuidv4(), sourceId, contractAddress]
        );

        res.status(200).json({ message: "Finding benfits shortly, check back later!" });
    } catch (error) {
        console.error("Error adding to staging:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
