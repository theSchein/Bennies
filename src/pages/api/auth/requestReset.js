import db from "../../../lib/db";
import jwt from "jsonwebtoken";
import client from "@/lib/postmarkClient";

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

        const link = `http://${req.headers.host}/reset-password/${token}`;

        await client.sendEmail({
            From: "ben@discovry.xyz", 
            To: email,
            Subject: "Password Reset Request",
            TextBody: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n${link}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`,
            MessageStream: "outbound"
        });

        res.status(200).json({ message: "A reset email has been sent to " + email + "." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
