import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.waitlist_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email } = req.body;

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if the email format is valid
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        try {
            // Check if the email already exists
            const checkEmailQuery = 'SELECT * FROM waitlist WHERE email = $1';
            const checkResult = await pool.query(checkEmailQuery, [email]);

            if (checkResult.rows.length > 0) {
                // Email already exists in the database
                return res.status(409).json({ message: 'Email already registered.' });
            }

            // Insert new record into the database
            const insertQuery = 'INSERT INTO waitlist (name, email) VALUES ($1, $2)';
            await pool.query(insertQuery, [name, email]);

            res.status(200).json({ message: 'Added to waitlist!' });
        } catch (error) {
            console.error('Database Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        // Handle any other HTTP methods
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

