// pages/api/likes/fetchLikes.js
// This API fetches the number of likes and dislikes for a specific comment or NFT

import db from "../../../lib/db";
import { getToken } from "next-auth/jwt";

export default async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    const session = await getToken({ req });
    const { nft_id, comment_id } = req.query;

    if (!nft_id && !comment_id) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    if ((nft_id && !uuidPattern.test(nft_id)) || (comment_id && !uuidPattern.test(comment_id))) {
        return res.status(400).json({ error: "Invalid UUID format." });
    }


    let userStatus = null;

    try {
        if (session) {
            const userStatusQuery = `
            SELECT type
            FROM likes
            WHERE user_id = $1 AND ${nft_id ? "nft_id = $2" : "comment_id = $2"};
            `;

            const userStatusResult = await db.query(userStatusQuery, [
                session.user_id,
                nft_id || comment_id,
            ]);
            userStatus = userStatusResult[0] ? userStatusResult[0].type : null;
        }

        const query = `
        SELECT type, COUNT(*) as count
        FROM likes
        WHERE ${nft_id ? "nft_id = $1" : "comment_id = $1"}
        GROUP BY type;
        `;

        const values = [nft_id || comment_id];

        const result = await db.query(query, values);

        let likes = 0;
        let dislikes = 0;
        // Iterate over the result array
        if (result && result.length > 0) {
            result.forEach((row) => {
                if (row.type === "like") {
                    likes = parseInt(row.count, 10);
                } else if (row.type === "dislike") {
                    dislikes = parseInt(row.count, 10);
                }
            });
        }

        return res.status(200).json({ likes, dislikes, userStatus });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};
