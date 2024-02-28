// pages/api/cron/daily.js
import db from "../../../lib/db";

export default async function handler(req, res) {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).send("Unauthorized");
    }

    try {
        // Refresh materialized views or any daily task
        await db.query('REFRESH MATERIALIZED VIEW CONCURRENTLY collection_nft_aggregates;');
        await db.query("REFRESH MATERIALIZED VIEW nft_leaderboard;");
        await db.query("REFRESH MATERIALIZED VIEW comment_leaderboard;");

        // Any additional daily tasks can be added here

        res.status(200).send("Daily cron job executed successfully");
    } catch (error) {
        console.error("Error executing daily cron job:", error);
        res.status(500).send("Internal Server Error");
    }
}
