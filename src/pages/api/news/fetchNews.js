// pages/api/news/fetchNews.js
// this api fetches news items from the db according to collection and viewing group

import db from "../../../lib/db";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    let { collection_id, viewing_group } = req.query;

    // Check if collection_id is 'null' and handle accordingly
    if (collection_id === 'null') {
        return res.status(400).json({ error: "Invalid collection_id" });
    }

    // Optional: Check if the user is authenticated if needed for certain viewing groups
    const session = await getToken({ req });
    const user_id = session?.user?.user_id || null;

    try {
        // Construct the base query
        let query = `
            SELECT * FROM news
            WHERE collection_id = $1
        `;

        const queryParams = [collection_id];

        // Filter by viewing group if specified
        if (viewing_group) {
            query += ` AND viewing_group = $2`;
            queryParams.push(viewing_group);

            // Additional logic here to handle authentication/authorization for restricted viewing groups
            // For example, if viewing_group is 'owners', ensure the user is an owner of an NFT in the collection
        }

        const newsItems = await db.manyOrNone(query, queryParams);

        res.status(200).json(newsItems);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
