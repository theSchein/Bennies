// pages/api/wallet/fetchWallets.js
// This file is used to fetch a specific user's the wallets from the database.

import { getToken } from "next-auth/jwt";
import db from "../../../lib/db";

export default async (req, res) => {
    if (req.method === "GET") {
        const session = await getToken({ req });

        if (!session) {
            // Not authenticated
            return res
                .status(401)
                .json({ error: "Not authenticated from the session" });
        }

        const user_id = session.user_id;
        try {
            const addresses = await db.manyOrNone(
                "SELECT wallet_address FROM wallets WHERE user_id = $1",
                [user_id],
            );
            if (addresses.length > 0) {
                res.status(200).json(addresses);
            } else {
                res.status(404).json({ error: "Wallets not found" });
            }
        } catch (error) {
            res.status(500).json({ error: "Database error: " + error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};
