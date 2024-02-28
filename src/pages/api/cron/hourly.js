// pages/api/cron/hourly.js
import db from "../../../lib/db";

export default async function handler(req, res) {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).send("Unauthorized");
    }

    try {
        // Example tasks that could be run hourly
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

        // Any additional hourly tasks can be added here

        res.status(200).send("Hourly cron job executed successfully");
    } catch (error) {
        console.error("Error executing hourly cron job:", error);
        res.status(500).send("Internal Server Error");
    }
}
