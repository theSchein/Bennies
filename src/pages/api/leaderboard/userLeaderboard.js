// pages/api/leaderboard/userLeaderboard.js
import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const result = await db.query('SELECT rank, username, score FROM comment_leaderboard LIMIT 10;');
        if (result) {
            res.status(200).json({ userLeaderboard: result });
        } else {
            res.status(404).json({ message: 'Leaderboard data not found' });
        }
    } catch (error) {
        console.error('Error fetching user leaderboard data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
