import db from '../../../lib/db';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
    if (req.method === 'POST') {
        const { identifier, password } = req.body;


        // Validate input
        if (!identifier || !password || typeof password !== 'string' || typeof identifier !== 'string') {
            return res.status(400).json({ error: 'Invalid inputs provided' });
        }

        try {
            // Retrieve user from database with username or password
            const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1 OR email_address = $1', [identifier]);

            // Compare passwords if user is found
            if (user && bcryptjs.compareSync(password, user.password)) {
                // Create a JWT
                const token = jwt.sign(
                    { user_id: user.user_id, username: user.username }, // payload
                    process.env.JWT_SECRET, // secret key
                    { expiresIn: '1h' } // token expiration
                );

                // Send token to client
                return res.status(200).json({ token });
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
};
