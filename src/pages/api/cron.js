// api/cron.js
// Running cron jobs to find the leaderboard winners

import db from "../../lib/db";

export default async function handler(req, res) {
    // Check if the request is authorized
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).send("Unauthorized");
    }

    // Ensure that the request is a POST request
    if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
    }

    try {
        const updateOwnersQuery = `
        UPDATE collections
        SET num_owners = derived.num_owners
        FROM (
            SELECT 
                n.collection_id, 
                COUNT(DISTINCT u.owner) AS num_owners
            FROM nfts n
            CROSS JOIN LATERAL unnest(n.owners) AS u(owner)
            GROUP BY n.collection_id
        ) AS derived
        WHERE collections.collection_id = derived.collection_id;
    `;

        // Update total number of likes for each collection
        const updateLikesQuery = `
        UPDATE collections
        SET num_likes = derived.total_likes
        FROM (
            SELECT 
                n.collection_id, 
                SUM(
                    CASE 
                        WHEN l.type = 'like' THEN 1 
                        WHEN l.type = 'dislike' THEN -1 
                        ELSE 0 
                    END
                ) AS total_likes
            FROM likes l
            JOIN nfts n ON l.nft_id = n.nft_id
            GROUP BY n.collection_id
        ) AS derived
        WHERE collections.collection_id = derived.collection_id;
    `;

        await db.query(updateOwnersQuery);
        await db.query(updateLikesQuery);

        // Sorting collections for likes and comments
        await db.query('REFRESH MATERIALIZED VIEW CONCURRENTLY collection_nft_aggregates;');

        // Refresh the materialized views or run your leaderboard update queries here
        await db.query("REFRESH MATERIALIZED VIEW nft_leaderboard;");
        await db.query("REFRESH MATERIALIZED VIEW comment_leaderboard;");

        // Add any additional logic if needed

        res.status(200).send("Cron job executed successfully");
    } catch (error) {
        console.error("Error executing cron job:", error);
        res.status(500).send("Internal Server Error");
    }
}
