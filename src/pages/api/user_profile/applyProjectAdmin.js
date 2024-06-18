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
        await db.none(
            'INSERT INTO project_admin_applications (user_id, project_name, contract_addresses, affiliation) VALUES ($1, $2, $3, $4)',
            [userId, projectName, contractAddresses, affiliation]
        );

        return res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error submitting application:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
