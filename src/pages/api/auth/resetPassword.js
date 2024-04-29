import db from "../../../lib/db";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).end(); // Method Not Allowed
    }

    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user_id;

        // Hash the new password
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(newPassword, salt);

        // Update the user's password
        await db.none("UPDATE users SET password = $1 WHERE user_id = $2", [hashedPassword, userId]);

        res.status(200).json({ message: "Password successfully reset" });
    } catch (error) {
        res.status(500).json({ error: "Invalid or expired token" });
    }
};
