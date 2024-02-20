// pages/api/nft/fetchCollectionNfts.js
// This api is used on collection page to pull nft data of a subsection of a collection given a query

import db from "../../../lib/db";

export default async function handler(req, res) {
    const {
        collection_id,
        page = 1,
        limit = 25,
        sort_by = "token_id",
        sort_order = "ASC",
        search = "",
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    try {
        const query = `
    SELECT 
        nfts.nft_id, 
        nfts.nft_name, 
        nfts.owners, 
        nfts.media_url, 
        agg.like_count, 
        agg.comment_count
    FROM 
        nfts
        JOIN collection_nft_aggregates agg ON nfts.nft_id = agg.nft_id
    WHERE 
        nfts.collection_id = $1
        AND (nfts.nft_name ILIKE $4 OR nfts.token_id::text ILIKE $4)
    ORDER BY 
        ${sort_by === "like_count" || sort_by === "comment_count" ? `agg.${sort_by}` : `nfts.${sort_by}`} ${sort_order.toUpperCase()}
    LIMIT $2 OFFSET $3
`;

        const values = [collection_id, limit, offset, `%${search}%`];

        const result = await db.any(query, values);

        // Check if we have results
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                message: "No NFTs found for the specified collection.",
            });
        }
    } catch (error) {
        console.error("Error fetching collection NFTs:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
