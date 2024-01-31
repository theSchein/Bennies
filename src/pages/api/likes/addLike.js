// pages/api/likes/addLike.js
// This api checks if the user is logged in and then allows it to add a like/dislike

import { getToken } from "next-auth/jwt";
import db from "../../../lib/db";

export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const session = await getToken({ req });
    if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const user_id = session.user.user_id;
    const { nft_id, comment_id, like_dislike } = req.body;

    if (!user_id || !like_dislike || (!nft_id && !comment_id)) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    if (like_dislike !== "like" && like_dislike !== "dislike") {
        return res.status(400).json({ error: "Invalid like/dislike value." });
    }

    try {
        // Check if a like/dislike already exists
        const checkQuery = `
    SELECT id FROM likes
    WHERE user_id = $1 AND 
    ${nft_id ? "nft_id = $2" : "comment_id = $2"}
`;
        const checkResult = await db.query(checkQuery, [
            user_id,
            nft_id || comment_id,
        ]);

        let likeSuccessful = false;

        if (checkResult && checkResult.rows && checkResult.rows.length > 0) {
            // Like/dislike exists, so update it
            const updateQuery = `
        UPDATE likes
        SET type = $1, updated_at = NOW()
        WHERE id = $2
    `;
            await db.query(updateQuery, [like_dislike, checkResult.rows[0].id]);
            likeSuccessful = true;
        } else {
            // Like/dislike does not exist, so insert a new one
            const insertQuery = `
        INSERT INTO likes(user_id, nft_id, comment_id, type, created_at)
        VALUES($1, $2, $3, $4, NOW())
    `;
            const insertResult = await db.query(insertQuery, [
                user_id,
                nft_id || null,
                comment_id || null,
                like_dislike,
            ]);
            likeSuccessful = true;
            if (insertResult.rowCount === 0) {
                throw new Error("Failed to add like/dislike.");
            }
        }

        if (comment_id) {
            const commentOwnerQuery = `SELECT user_id FROM comments WHERE comment_id = $1`;
            const commentOwnerResult = await db.query(commentOwnerQuery, [comment_id]);
            const commentOwnerId = commentOwnerResult[0].user_id;

            if (likeSuccessful && commentOwnerId) {
                const message = `Your comment got a ${like_dislike}!`;
                const insertNotificationQuery = `
                    INSERT INTO notifications (user_id, type, message, entity_id, read, created_at, updated_at)
                    VALUES ($1, $2, $3, $4, false, NOW(), NOW());
                `;
                await db.query(insertNotificationQuery, [
                    commentOwnerId,
                    like_dislike,
                    message,
                    comment_id,
                ]);
            }
        }

        return res
            .status(201)
            .json({ message: `Like/dislike ${like_dislike} added.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};
