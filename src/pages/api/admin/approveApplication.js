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

        // Check if a universe with the same name or manager_id already exists
        const existingUniverse = await db.oneOrNone(
            'SELECT * FROM universes WHERE name = $1 OR manager_id = $2',
            [application.project_name, application.user_id]
        );

        if (existingUniverse) {
            return res.status(400).json({ error: 'A universe with this name or manager already exists' });
        }

        // Create a new universe
        const universe = await db.one(
            'INSERT INTO universes (name, manager_id, deployer_address) VALUES ($1, $2, $3) RETURNING universe_id',
            [application.project_name, application.user_id, application.contract_addresses[0]]
        );

        // Insert contract addresses into universe_entities
        const contractAddresses = application.contract_addresses;
        for (const address of contractAddresses) {
            await db.none(
                'INSERT INTO universe_entities (universe_id, entity_id, entity_type, contract_address) VALUES ($1, uuid_generate_v4(), $2, $3)',
                [universe.universe_id, 'collection', address]
            );
            // Update collection and token entries with the universe_id
            await db.none(
                `UPDATE collections SET universe_id = $1 WHERE contract_address = $2;
                 UPDATE tokens SET universe_id = $1 WHERE contract_address = $2;`,
                [universe.universe_id, address]
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
