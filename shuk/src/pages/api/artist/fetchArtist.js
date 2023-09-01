import db from '../../lib/db';

export default async (req, res) => {
  if (req.method === 'GET') {
    const user_id = req.query.user_id;

    try {
      const artistPage = await db.oneOrNone('SELECT * FROM artist_pages WHERE artist_id = $1', [artist_id]);
      if (artistPage) {
        res.status(200).json(artistPage);
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
