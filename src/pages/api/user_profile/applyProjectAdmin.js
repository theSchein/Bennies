// pages/api/user_profile/applyProjectAdmin.js
import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userId, projectName, contractAddresses, affiliation } = req.body;

    if (!userId || !projectName || !contractAddresses || !affiliation) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const universeId = await db.one(
            'INSERT INTO universes (name, description, deployer_address) VALUES ($1, $2, $3) RETURNING universe_id',
            [projectName, `Affiliation: ${affiliation}`, contractAddresses[0]]
        );

        await db.none(
            'UPDATE users SET universe_id = $1 WHERE user_id = $2',
            [universeId.universe_id, userId]
        );

        return res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error submitting application:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
