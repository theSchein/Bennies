import db from '../../../lib/db';

export default async (req, res) => {
  if (req.method === 'GET') {
    const  { artist_id } = req.query;

    try {
      const artistData = await db.oneOrNone('SELECT * FROM artists WHERE artist_id = $1', [artist_id]);
      if (artistData) {
        res.status(200).json(artistData);
      } else {
        res.status(404).json({ error: 'ArtistPage not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Database error: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
};
