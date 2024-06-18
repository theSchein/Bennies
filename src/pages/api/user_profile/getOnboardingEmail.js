// api/user_profile/getOnboardingEmail.js
import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { universeId } = req.query;

    if (!universeId) {
        return res.status(400).json({ error: 'Missing universe ID' });
    }

    try {
        const data = await db.oneOrNone('SELECT * FROM onboarding_emails WHERE universe_id = $1', [universeId]);

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching onboarding email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}