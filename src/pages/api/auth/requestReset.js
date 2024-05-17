import db from "../../../lib/db";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "@/lib/emailUtils";

export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).end(); // Method Not Allowed
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email address is required" });
    }

    try {
        const user = await db.oneOrNone("SELECT * FROM users WHERE email_address = $1", [email]);
        if (!user) {
            // You can decide to inform the user or not
            return res.status(404).json({ error: "No account with that email exists." });
        }

        const token = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        const baseUrl = process.env.BASE_URL; // Ensure this is set in your environment
        const link = `${baseUrl}/auth/reset-password/${encodeURIComponent(token)}`;

        await client.sendPasswordResetEmail(email, link );

        res.status(200).json({ message: "A reset email has been sent to " + email + "." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
