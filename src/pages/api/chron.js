// api/cron.js
// Running cron jobs to find the leaderboard winners

import db from "../../../lib/db";

export default async function handler(req, res) {
    // Check if the request is authorized
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).send('Unauthorized');
    }

    // Ensure that the request is a POST request
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        // Refresh the materialized views or run your leaderboard update queries here
        await db.query('REFRESH MATERIALIZED VIEW nft_leaderboard;');
        await db.query('REFRESH MATERIALIZED VIEW comment_leaderboard;');

        // Add any additional logic if needed

        res.status(200).send('Cron job executed successfully');
    } catch (error) {
        console.error('Error executing cron job:', error);
        res.status(500).send('Internal Server Error');
    }
}
