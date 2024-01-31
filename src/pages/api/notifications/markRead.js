// pages/api/notifications/markRead.js
// This api checks sets the read on a notification to true

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

    const { notificationId } = req.body;

    try {
        await db.query(
            "UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2",
            [notificationId, session.user.user_id]
        );
        res.status(200).json({ message: "Notification marked as read." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};
