// api/cron.js
// Running cron jobs to find the leaderboard winners

import db from "../../lib/db";

export default async function handler(req, res) {
    // Check if the request is authorized
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).send("Unauthorized");
    }

    const taskType = req.query.taskType;

    try {

        if (taskType === 'daily') {
        // Refresh the materialized views
        await db.query('REFRESH MATERIALIZED VIEW CONCURRENTLY collection_nft_aggregates;');
        await db.query("REFRESH MATERIALIZED VIEW nft_leaderboard;");
        await db.query("REFRESH MATERIALIZED VIEW comment_leaderboard;");

        await refreshOwnershipCounts();
        } else if (taskType === 'hourly') {
            
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
        await db.query(updateOwnersQuery);

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
        await db.query(updateLikesQuery);
        }

        res.status(200).send("Cron job executed successfully");
    } catch (error) {
        console.error("Error executing cron job:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function refreshOwnershipCounts() {
    // Step 1: Optionally, clear the existing counts to start fresh
    // This step depends on your application's requirements
    // await db.query("DELETE FROM ownership_counts;");

    // Step 2: Calculate the new counts and update the table
    const updateOwnershipCountsQuery = `
        INSERT INTO ownership_counts (user_id, collection_id, ownership_count)
        SELECT 
            u.user_id, 
            n.collection_id, 
            COUNT(n.nft_id) AS ownership_count
        FROM nfts n
        JOIN wallets w ON w.wallet_address = ANY(n.owners)
        JOIN users u ON u.user_id = w.user_id
        GROUP BY u.user_id, n.collection_id
        ON CONFLICT (user_id, collection_id) DO UPDATE 
        SET ownership_count = EXCLUDED.ownership_count;
    `;

    await db.query(updateOwnershipCountsQuery);
}