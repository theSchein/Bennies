// pages/api/auth/verifyEmail.js
import jwt from "jsonwebtoken";
import db from "../../../lib/db";

export default async (req, res) => {
    if (req.method === "GET") {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.user_id;

            const update = await db.none("UPDATE users SET email_verified = TRUE WHERE user_id = $1", [userId]);
            res.status(200).json({ message: "Email verified successfully!" });
        } catch (error) {
            res.status(500).json({ error: "Invalid or expired token" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
};
