// pages/api/likes/removeLike.js
// This API allows a user to remove a like/dislike

import { getToken } from "next-auth/jwt";
import db from "../../../lib/db";

export default async (req, res) => {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const session = await getToken({ req });
    if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const user_id = session.user.user_id;
    const { nft_id, comment_id } = req.body;

    if (!user_id || (!nft_id && !comment_id)) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const query = `
            DELETE FROM likes
            WHERE user_id = $1 AND (nft_id = $2 OR comment_id = $3);
        `;
        const values = [user_id, nft_id || null, comment_id || null];

        const result = await db.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Like/dislike not found or not owned by user." });
        }

        return res.status(200).json({ message: "Like/dislike removed successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};
