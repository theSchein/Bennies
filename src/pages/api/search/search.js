// pages/api/search/search.js
import db from "../../../lib/db";

export default async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { query, page = 1, limit = 12 } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    const offset = (page - 1) * limit;

    try {
        // Search collections with pagination
        const collectionResults = await db.any(
            `
            SELECT collection_id, collection_name, media_url, num_collection_items FROM collections
            WHERE textsearchable_index_col @@ plainto_tsquery('english', $1)
            ORDER BY collection_name
            LIMIT $2 OFFSET $3;
        `,
            [query, limit, offset],
        );

        // Calculate total number of collections for pagination metadata (optional)
        const totalCollections = await db.one(
            `
            SELECT COUNT(*) FROM collections
            WHERE textsearchable_index_col @@ plainto_tsquery('english', $1);
        `,
            [query],
        );

        // Assuming you want to show collections first and then NFTs, calculate remaining limit and offset for NFTs
        const remainingLimit = Math.max(0, limit - collectionResults.length);
        const nftOffset = Math.max(0, offset - totalCollections.count);

        // Search NFTs with adjusted pagination if there's remaining limit
        let nftResults = [];
        if (remainingLimit > 0) {
            nftResults = await db.any(
                `
            SELECT 
            n.nft_id, 
            n.nft_name, 
            n.media_url, 
            n.contract_address, 
            c.collection_name,
            COALESCE(comment_counts.comment_count, 0) AS comment_count
        FROM 
            nfts n
        LEFT JOIN 
            collections c ON n.collection_id = c.collection_id
        LEFT JOIN (
            SELECT 
                nft_id, 
                COUNT(comment_id) AS comment_count
            FROM 
                comments
            GROUP BY 
                nft_id
        ) AS comment_counts ON n.nft_id = comment_counts.nft_id
        WHERE 
            n.textsearchable_index_col @@ plainto_tsquery('english', $1)
        ORDER BY 
            n.nft_name
        LIMIT $2 OFFSET $3;
            `,
                [query, remainingLimit, nftOffset],
            );
        }

        res.status(200).json({
            collections: {
                results: collectionResults,
                total: parseInt(totalCollections.count),
                page: parseInt(page),
                limit: parseInt(limit),
            },
            nfts: nftResults, // Note: NFTs don't have pagination metadata in this setup
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
};
