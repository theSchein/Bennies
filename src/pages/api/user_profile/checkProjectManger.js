// pages/api/user_profile/checkProjectManager.js
import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'Missing user ID' });
    }

    try {
        const result = await db.oneOrNone('SELECT universe_id FROM users WHERE user_id = $1', [userId]);

        return res.status(200).json({ isProjectManager: result && result.universe_id !== null });
    } catch (error) {
        console.error('Error checking project manager status:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
