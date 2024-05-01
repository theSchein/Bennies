// pages/api/auth/resendVerification.js
import db from "../../../lib/db";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "@/lib/emailUtils";

export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).end(); // Method Not Allowed
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email address is required" });
    }

    try {
        const user = await db.oneOrNone("SELECT user_id, is_verified FROM users WHERE email_address = $1", [email]);
        if (!user) {
            return res.status(404).json({ error: "No account with that email exists." });
        }

        if (user.is_verified) {
            return res.status(400).json({ error: "Email is already verified." });
        }

        // Generate a new verification token
        const token = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Update the verification token in the database
        await db.none(
            "UPDATE users SET verification_token = $1 WHERE user_id = $2",
            [token, user.user_id]
        );

        const baseUrl = process.env.BASE_URL;
        const link = `${baseUrl}/auth/verify-email/${encodeURIComponent(token)}`;

        // Call the utility function to send a verification email with the new link
        await sendVerificationEmail(email, link);

        res.status(200).json({ message: "Verification email has been resent to " + email + "." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
