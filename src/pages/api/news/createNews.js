// pages/api/news/createNews.js
// This api allows artist role to create news items for thier respective collections
// Todo: add username to news or render it in its component

import { getToken } from "next-auth/jwt";
import db from "../../../lib/db";

export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const session = await getToken({ req });
    if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const { collection_id, title, content, viewing_group } = req.body;
    if (!collection_id || !title || !content || !viewing_group) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const user_id = session.user.user_id;
    try {
        // const collection = await db.oneOrNone('SELECT artist_id FROM collections WHERE collection_id = $1', [collection_id]);
        // if (!collection || collection.artist_id !== user_id) {
        //     return res.status(403).json({ error: 'You are not authorized to create news for this collection.' });
        // }

        const query = `
            INSERT INTO news(collection_id, title, content, viewing_group, created_at)
            VALUES($1, $2, $3, $4, NOW())
            RETURNING news_id;
        `;
        const values = [collection_id, title, content, viewing_group];
        const result = await db.one(query, values);

        return res.status(201).json({ message: "News created.", newsId: result.news_id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};