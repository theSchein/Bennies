// pages/api/auth/validateToken.js
import jwt from "jsonwebtoken";

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).end(); // Method Not Allowed
    }

    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ isValid: true });
    } catch (error) {
        res.status(200).json({ isValid: false });
    }
}
