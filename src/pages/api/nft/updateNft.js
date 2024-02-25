// pages/api/updateNft.js
// takes inputs from NFT form and updates the database entry according ot user input

import db from "../../../lib/db";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { nft_id, ...updateFields } = req.body;

        const fieldsToExclude = ["textsearchable_index_col", "collection_name"]; // Add any other fields to exclude as needed
        const filteredUpdateFields = Object.keys(updateFields)
            .filter(key => !fieldsToExclude.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateFields[key];
                return obj;
            }, {});

        // Construct the SET part of the SQL query dynamically based on the fields to update
        const setQuery = Object.keys(filteredUpdateFields)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');

        if (!setQuery) {
            throw new Error('No fields to update');
        }

        const values = [nft_id, ...Object.values(filteredUpdateFields)];

        await db.query(
            `UPDATE nfts SET ${setQuery} WHERE nft_id = $1`,
            values
        );

        res.status(200).json({ message: 'NFT updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
