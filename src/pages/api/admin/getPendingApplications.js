// pages/api/admin/getPendingApplications.js
import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const applications = await db.manyOrNone(
            'SELECT * FROM project_admin_applications WHERE status = $1',
            ['pending']
        );
        return res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
