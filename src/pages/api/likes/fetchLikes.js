// pages/api/likes/fetchLikes.js
// This API fetches the number of likes and dislikes for a specific comment or NFT

import db from "../../../lib/db";

export default async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { nft_id, comment_id } = req.query;

    if (!nft_id && !comment_id) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const query = `
        SELECT type, COUNT(*) as count
        FROM likes
        WHERE ${nft_id ? 'nft_id = $1' : 'comment_id = $1'}
        GROUP BY type;
        `;

        const values = [parseInt(nft_id || comment_id, 10)];

        const result = await db.query(query, values);


        let likes = 0;
        let dislikes = 0;
        // Iterate over the result array
        if (result && result.length > 0) {
            result.forEach(row => {
                if (row.type === 'like') {
                    likes = parseInt(row.count, 10);
                } else if (row.type === 'dislike') {
                    dislikes = parseInt(row.count, 10);
                }
            });
        }

        return res.status(200).json({ likes, dislikes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};