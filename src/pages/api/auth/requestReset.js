import db from "../../../lib/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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

        // Configure your mail server settings
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        });

        // send mail with defined transport object
        await transporter.sendMail({
            from: '"Your App Name" <postmaster@mg.discovry.xyz>', // sender address
            to: email, // list of receivers
            subject: "Password Reset Request", // Subject line
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
                   http://${req.headers.host}/reset-password/${token}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        });

        res.status(200).json({ message: "A reset email has been sent to " + email + "." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
