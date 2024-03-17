// pages/api/cron/weekly.js
import db from "../../../lib/db";
import uploadFileToSpaces from "../crawl/uploadFileToSpaces";

export default async function handler(req, res) {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const nftsToProcess = await db.any(`
            SELECT * FROM nfts WHERE media_url NOT LIKE 'https://shuk.nyc3.cdn.digitaloceanspaces.com/%'
        `);

        let processedCount = 0;
        const maxProcessCount = 5000; // Limit to 5000 NFTs

        for (const nft of nftsToProcess) {
            if (processedCount >= maxProcessCount) {
                break; // Stop processing if the limit is reached
            }

            const newImageUrl = await uploadFileToSpaces(nft.media_url, `${nft.contract_address}/${nft.token_id}`);
            await db.none(`
                UPDATE nfts SET media_url = $1 WHERE nft_id = $2
            `, [newImageUrl, nft.nft_id]);

            processedCount++; // Increment the counter after each successful process
        }

        console.log(`Finished processing ${processedCount} NFT images.`);
        res.status(200).json({ message: `NFT images processed successfully. Total processed: ${processedCount}` });
    } catch (error) {
        console.error("Failed to process NFT images:", error);
        res.status(500).json({ error: "Failed to process NFT images" });
    }
}
