// pages/api/checkSession.js
import { getSession } from "next-auth/react";

export default async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: "No active session found." });
    }

    return res.status(200).json(session);
};
