// pages/api/artist/fetchArtistId.js
// API to fetch artists by id to render on the artist page.

import db from "../../../lib/db";
import { getToken } from "next-auth/jwt";

export default async (req, res) => {
    if (req.method === "GET") {
        const session = await getToken({ req });
        if (!session) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const userId = session.user_id;

        try {
            const artistData = await db.oneOrNone(
                "SELECT artist_id, artist_name FROM artists WHERE user_id = $1",
                [userId],
            );

            if (artistData) {
                res.status(200).json({
                    artistId: artistData.artist_id,
                    artistName: artistData.artist_name
                });
            } else {
                res.status(404).json({ error: "Artist not found for the given user" });
            }
        } catch (error) {
            res.status(500).json({ error: "Database error: " + error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};