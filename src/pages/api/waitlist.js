// pages/api/waitlist.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email } = req.body;

        // Add your database connection and insertion logic here
        // For example, inserting into a MongoDB database

        res.status(200).json({ message: 'Added to waitlist!' });
    } else {
        // Handle any other HTTP methods
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
