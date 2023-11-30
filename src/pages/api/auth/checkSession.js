// pages/api/auth/checkSession.js
// This file is used to check if a session exists.
// It is not actively used in the app but kept around for testing and troubleshooting.

import { getSession } from "next-auth/react";

export default async (req, res) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: "No active session found." });
    }

    return res.status(200).json(session);
};
