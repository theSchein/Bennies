// pages/api/comments/fetchComments.js
// Api to fetch all comments for an nft to be rendered on the nft page

import db from "../../../lib/db";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const nftId = req.query.nft_id;

    if (!nftId) {
        return res
            .status(400)
            .json({ message: "nft_id query parameter is required." });
    }

    try {
        const query = `
  SELECT
    c.comment_id,
    c.parent_comment_id,
    commenters.user_id,
    commenters.username as commenter,
    c.text as text,
    c.commentdate
  FROM comments c
  JOIN users commenters ON c.user_id = commenters.user_id
  WHERE c.nft_id = $1
    ORDER BY c.CommentDate DESC
    `;

        const values = [nftId];
        const result = await db.query(query, values);

        if (!result || !Array.isArray(result) || result.length === 0) {
            return res
                .status(200)
                .json({ message: "No comments found for this NFT." });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
}
