// pages/api/auth/register.js
// Registration API route

import bcrypt from "bcryptjs";
import db from "../../../lib/db";

export default async (req, res) => {
    if (req.method === "POST") {
        const { username, email_address, password } = req.body;

        // Check username, email_address, and password
        if (!username || !email_address || !password) {
            res.status(400).json({
                error: "One or more required fields are missing",
            });
            return;
        }
        // Check username, email_address, and password types
        if (
            typeof username !== "string" ||
            typeof email_address !== "string" ||
            typeof password !== "string"
        ) {
            res.status(400).json({
                error: "All input fields must be of type string",
            });
            return;
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        try {
            const result = await db.none(
                "INSERT INTO Users(username, email_address, password) VALUES($1, $2, $3)",
                [username, email_address, hashedPassword],
            );
            res.status(200).json({
                success: true,
                message: "User registered successfully",
            });
        } catch (error) {
            if (error.code === "23505") {
                // This is the error code for a unique violation in PostgreSQL
                if (error.detail.includes("username")) {
                    res.status(409).json({ error: "Username already exists" }); // 409 Conflict
                } else if (error.detail.includes("email_address")) {
                    res.status(409).json({ error: "Email already exists" });
                }
            } else {
                res.status(500).json({ error: "An error occurred." });
            }
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
};
