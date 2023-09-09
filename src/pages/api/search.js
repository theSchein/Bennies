import db from '../../lib/db';
import Fuse from 'fuse.js';


export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

       // Fetch a broader set of data or a predefined subset
       const nftData = await db.any(`SELECT * FROM nfts LIMIT 10000`); // Fetch all NFTs limits need added later
       const artistData = await db.any(`SELECT * FROM artists LIMIT 10000`);


        // Configure fuse.js options for nfts and artists
        const fuseOptions = {
            includeScore: true,
            threshold: 0.3,
            keys: ['nft_name', 'artist_name']
        };

        const fuseNFTs = new Fuse(nftData, fuseOptions);
        const fuseArtists = new Fuse(artistData, fuseOptions);

        const nftResults = fuseNFTs.search(query).slice(0, 10).map(item => item.item);
        const artistResults = fuseArtists.search(query).slice(0, 10).map(item => item.item);

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