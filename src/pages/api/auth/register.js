// pages/api/auth/register.js
import bcrypt from "bcryptjs";
import db from "../../../lib/db";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "@/lib/emailUtils";

export default async (req, res) => {
    if (req.method === "POST") {
        const { username, email_address, password } = req.body;

        if (!username || !email_address || !password) {
            return res.status(400).json({ error: "One or more required fields are missing" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        try {
            const user = await db.one(
                "INSERT INTO users (username, email_address, password) VALUES ($1, $2, $3) RETURNING user_id",
                [username, email_address, hashedPassword]
            );

            const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const baseUrl = process.env.BASE_URL;
            const link = `${baseUrl}/auth/verify-email/${encodeURIComponent(token)}`;

            await sendVerificationEmail(email_address, link);

            res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
        } catch (error) {
            console.log(error);
            if (error.code === "23505") {
                res.status(409).json({ error: "Username or email already exists" });
            } else {
                res.status(500).json({ error: "An error occurred: " + error.message });
            }
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
};
