// pages/api/waitlist.js
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.waitlist_url, // Use environment variable for the database URL
    ssl: {
        rejectUnauthorized: false // This is important for some hosted databases like Heroku
    }
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email } = req.body;

        try {
            // Insert data into the database
            const query = 'INSERT INTO waitlist (name, email) VALUES ($1, $2)';
            await pool.query(query, [name, email]);

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
