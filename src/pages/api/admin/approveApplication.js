// pages/api/admin/approveApplication.js
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
        // Fetch application details
        const application = await db.oneOrNone(
            'SELECT * FROM project_admin_applications WHERE application_id = $1',
            [applicationId]
        );

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Create a new universe
        const universe = await db.one(
            'INSERT INTO universes (name, description, deployer_address, manager_id) VALUES ($1, $2, $3, $4) RETURNING universe_id',
            [application.project_name, `Affiliation: ${application.affiliation}`, application.contract_addresses[0], application.user_id]
        );

        // Insert contract addresses into universe_entities
        const contractAddresses = application.contract_addresses;
        for (const address of contractAddresses) {
            await db.none(
                'INSERT INTO universe_entities (universe_id, entity_id, entity_type, contract_address) VALUES ($1, $2, $3, $4)',
                [universe.universe_id, universe.universe_id, 'collection', address]
            );
        }

        // Update application status to approved
        await db.none(
            'UPDATE project_admin_applications SET status = $1 WHERE application_id = $2',
            ['approved', applicationId]
        );

        return res.status(200).json({ message: 'Application approved successfully' });
    } catch (error) {
        console.error('Error approving application:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
