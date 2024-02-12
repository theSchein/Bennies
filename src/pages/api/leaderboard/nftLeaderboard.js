// api/leaderboard/nftLeaderboard.js

import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Updated query to include ranking and select specific fields
            const query = `
                SELECT
                    ROW_NUMBER() OVER (ORDER BY score DESC) AS ranking,
                    nft_id,
                    nft_name,
                    collection_id,
                    collection_name,
                    score
                FROM
                    nft_leaderboard
                ORDER BY
                    score DESC
                LIMIT 10;
            `;
            const result = await db.query(query);
            const nftLeaderboard = result;

            res.status(200).json({
                nftLeaderboard: nftLeaderboard,
            });
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
