// pages/api/artists/updateArtist.js
// API to update content in artist table

import db from "../../../lib/db";
import { getToken } from "next-auth/jwt";

export default async (req, res) => {
    if (req.method === "POST") {
        const session = await getToken({ req });

        if (!session) {
            // Not authenticated
            return res
                .status(401)
                .json({ error: "Not authenticated from the session" });
        }

        const updateData = req.body;
        let fieldsToUpdate = [];
        let values = [];

        for (const [key, value] of Object.entries(updateData)) {
            if (value !== null && key !== 'artist_id') {
                fieldsToUpdate.push(`${key} = $${fieldsToUpdate.length + 1}`);
                values.push(value);
            }
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ error: "No valid fields provided for update" });
        }

        values.push(session.user_id); // Add user_id as the last parameter for the WHERE clause

        try {
            const query = `
                UPDATE artists
                SET ${fieldsToUpdate.join(", ")}
                WHERE user_id = $${values.length}
            `;

            const result = await db.result(query, values);


            // Check if any row was actually updated
            if (result.rowCount > 0) {
                res.status(200).json({
                    message: "Artist entry updated successfully",
                });
            } else {
                // No row was updated, which means no entry was found for the given user_id
                res.status(404).json({ error: "Artist entry not found" });
            }
        } catch (error) {
            res.status(500).json({ error: "Database error: " + error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};
