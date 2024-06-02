// pages/api/admin/denyApplication.js
import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { applicationId } = req.body;

    if (!applicationId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await db.none(
            'UPDATE project_admin_applications SET status = $1 WHERE application_id = $2',
            ['denied', applicationId]
        );

        return res.status(200).json({ message: 'Application denied successfully' });
    } catch (error) {
        console.error('Error denying application:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
