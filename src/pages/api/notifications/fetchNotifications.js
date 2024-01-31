// pages/api/notifications/fetchNotifications.js
// This API fetches notifications for the logged in user

import db from "../../../lib/db";
import { getToken } from "next-auth/jwt";

export default async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
    const session = await getToken({ req });

    if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const notifications = await db.query(
            "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
            [session.user.user_id]
        );
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
} ;
