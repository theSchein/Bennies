import db from '../../lib/db';


export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Utilizing PostgreSQL's full-text search capability
        const nftResults = await db.any(`
            SELECT * FROM nfts 
            WHERE to_tsvector('english', nft_name) @@ to_tsquery('english', $1) 
            LIMIT 10
        `, [query]);

        const artistResults = await db.any(`
            SELECT * FROM artists 
            WHERE to_tsvector('english', artist_name) @@ to_tsquery('english', $1) 
            LIMIT 10
        `, [query]);

        const combinedResults = {
            nfts: nftResults,
            artists: artistResults
        };

        res.status(200).json(combinedResults);

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};    