// pages/api/artists/updateArtist.js
// API to update content in artist table

import db from "../../../lib/db";
import { getToken } from "next-auth/jwt";

export default async (req, res) => {
    if (req.method === "POST") {
        const session = await getToken({ req });

        if (!session) {
            // Not authenticated
            return res.status(401).json({ error: "Not authenticated from the session" });
        }
    
        const { artistName, artistBio, artistPicture, artistSales, artistSocial } = req.body;
    
        try {
            // Update the existing artist entry
            const result = await db.result(
                `
                UPDATE artists
                SET artist_name = $2,
                    artist_bio = $3,
                    artist_picture = $4,
                    artist_sales_link = $5,
                    social_media_link = $6
                WHERE user_id = $1
                `,
                [
                    session.user_id,
                    artistName,
                    artistBio,
                    artistPicture,
                    artistSales,
                    artistSocial,
                ],
            );
    
            // Check if any row was actually updated
            if (result.rowCount > 0) {
                res.status(200).json({ message: "Artist entry updated successfully" });
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
}
