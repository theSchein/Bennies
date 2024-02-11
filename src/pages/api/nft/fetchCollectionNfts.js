// pages/api/nft/fetchCollectionNfts.js
// This api is used on collection page to pull nft data of a subsection of a collection given a query

import db from "../../../lib/db";

export default async function handler(req, res) {
    const { collection_id, page = 1 } = req.query;
    const limit = parseInt(req.query.limit) || 50; // Allow limit to be specified, default to 50
    const sortBy = req.query.sort_by || 'token_id'; // Allow sort_by to be specified, default to token_id
    const sortOrder = req.query.sort_order || 'ASC'; // Allow sort_order to be specified, default to ASC

    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * limit;

    // Validate sort_order
    if (!['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
        return res.status(400).json({ message: "Invalid sort_order value. Use 'ASC' or 'DESC'." });
    }

    try {
        // Construct dynamic query
        const query = `
            SELECT * FROM nfts
            WHERE collection_id = $1
            ORDER BY ${sortBy} ${sortOrder}
            LIMIT $2 OFFSET $3
        `;

        // Execute query
        const result = await db.query(query, [collection_id, limit, offset]);

        // Check if we have results
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "No NFTs found for the specified collection." });
        }
    } catch (error) {
        console.error('Error fetching collection NFTs:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
