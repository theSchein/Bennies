// pages/api/updateCollection.js
// takes inputs from Collection form and updates the database entry according ot user input

import db from "../../../lib/db";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { collection_id, ...updateFields } = req.body;

        // Construct the SET part of the SQL query dynamically based on the fields to update
        const setQuery = Object.keys(updateFields)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');

        if (!setQuery) {
            throw new Error('No fields to update');
        }

        const values = [collection_id, ...Object.values(updateFields)];

        await db.query(
            `UPDATE collections SET ${setQuery} WHERE collection_id = $1`,
            values
        );

        res.status(200).json({ message: 'Collection updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
