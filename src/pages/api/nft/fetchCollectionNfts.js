// pages/api/nft/fetchCollectionNfts.js
// This api is used on collection page to pull nft data of a subsection of a collection given a query

import db from "../../../lib/db";

export default async function handler(req, res) {
    const { collection_id, page = 1, limit = 25, sort_by = 'token_id', sort_order = 'ASC' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const validSortColumns = {
        token_id: 'nfts.token_id',
        like_count: 'like_count', 
        comment_count: 'comment_count',
        // Add other valid columns here
    };

    const sortByField = validSortColumns[sort_by] || validSortColumns['token_id'];
    const sortOrderValidated = ['ASC', 'DESC'].includes(sort_order.toUpperCase()) ? sort_order.toUpperCase() : 'ASC';


    try {
        const query = `
            SELECT nfts.nft_id, nfts.nft_name, nfts.owners, nfts.media_url, 
                   COUNT(DISTINCT likes.id) AS like_count, COUNT(DISTINCT comments.comment_id) AS comment_count
            FROM nfts
            LEFT JOIN likes ON nfts.nft_id = likes.nft_id AND likes.type = 'like'
            LEFT JOIN comments ON nfts.nft_id = comments.nft_id
            WHERE nfts.collection_id = $1
            GROUP BY nfts.nft_id
            ORDER BY ${sortByField} ${sortOrderValidated}, nfts.nft_id ${sortOrderValidated}
            LIMIT $2 OFFSET $3
        `;

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
