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

        const { artistName, artistBio, artistPicture, artistSales, artistSocial } =
            req.body;

        try {
            await db.none(
                `
      INSERT INTO artists(
        user_id, 
        artist_name,
        artist_bio, 
        artist_picture,
        artist_sales_link,
        social_media_link) 
        VALUES($1, $2, $3, $4, $5, $6)`,
                [
                    session.user_id,
                    artistName,
                    artistBio,
                    artistPicture,
                    artistSales,
                    artistSocial,
                ],
            );
            res.status(200).json({ message: "Artist entry updated successfully" });
        } catch (error) {
            res.status(500).json({ error: "Database error: " + error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};
