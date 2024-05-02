// pages/api/auth/verifyEmail.js
import db from "../../../lib/db";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "@/lib/emailUtils";

export default async (req, res) => {
    if (req.method === "GET") {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ error: "Token is required" });
        }

        try {
            // Attempt to decode the JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.user_id;

            // Attempt to verify the user and mark as verified
            const user = await db.oneOrNone("UPDATE users SET email_verified = TRUE WHERE user_id = $1 RETURNING *", [userId]);

            // Check if the user was found and updated
            if (!user) {
                return res.status(404).json({ error: "No user found with this token." });
            }

            if (!user.email_verified) {
                return res.status(500).json({ error: "Failed to update user verification status." });
            }

            // Send welcome email after successful verification
            await sendWelcomeEmail(user.email_address, user.username);
            res.status(200).json({ message: "Email verified successfully and welcome email sent!" });

        } catch (error) {
            console.error('Verification Error:', error);
            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ error: "Token has expired" });
            } else if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ error: "Invalid token" });
            } else {
                res.status(500).json({ error: "Internal server error during verification" });
            }
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
};
